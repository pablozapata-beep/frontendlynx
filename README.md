# frontendlinx

Framework de componentes reutilizables en Vue 3, multi-marca, para la organizacion.

- **Desarrollo** consume la libreria de componentes (`@frontendlinx/ui`) para construir los frontends reales.
- **Marketing** navega el catalogo visual en Storybook, ve cada componente con sus variantes ya renderizado con la piel de cada marca, y elige que usar — sin tocar codigo.

## Estructura

```
packages/
  tokens/   # design tokens por marca (color, tipografia, spacing, radius) -> CSS custom properties
  ui/       # componentes Vue 3 + catalogo Storybook
```

Cada marca es un JSON en `packages/tokens/brands/*.json`. El build genera un CSS por marca en
`packages/tokens/dist/*.css`, activado con un atributo `data-brand="<marca>"` en un elemento
ancestro. Los componentes de `packages/ui` **no conocen ninguna marca** — solo leen variables CSS
(`var(--color-primary)`, etc.), asi que agregar una marca nueva no requiere tocar componentes.

## Requisitos

- Node 20+
- npm 10+ (el repo usa npm workspaces)

## Primeros pasos

```bash
npm install
```

### Ver el catalogo (Storybook)

```bash
npm run storybook
```

Abre `http://localhost:6006`. En el toolbar superior hay un selector **Marca** para alternar entre
`NWT` / `LTK` / `QTZ` y ver los componentes repintados con cada tema.

### Compilar la libreria

```bash
npm run build
```

Genera `packages/tokens/dist/*.css` y `packages/ui/dist/` (JS + CSS + tipos `.d.ts`).

### Tests

```bash
npm test
```

## Agregar una marca nueva

1. Crear `packages/tokens/brands/<marca>.json` con la misma forma que `nwt.json` (el campo `"brand"` interno define el nombre final, no el nombre del archivo).
2. Correr `npm run tokens:build` (regenera el CSS, sin tocar componentes).
3. Sumar la marca al selector de Storybook en `packages/ui/.storybook/preview.ts` (`globalTypes.brand.toolbar.items`).

## Overrides de diseño por marca (cuando los tokens no alcanzan)

Los tokens resuelven diferencias de **valor** (colores, spacing, radios). Cuando una marca necesita
una diferencia de **forma o microinteracción** que no se puede expresar cambiando el valor de una
variable existente (ej. botones pill-shaped con hover de escala, en vez de solo cambiar de color),
se resuelve con un archivo de overrides CSS opcional junto al JSON de esa marca:

```
packages/tokens/brands/
  qtz.json
  qtz.overrides.css   # opcional — solo si esa marca lo necesita
```

El archivo es CSS normal, scoped a mano con el mismo atributo que ya usan los tokens (así la regla
de marca gana por especificidad, sin `!important` ni depender del orden de carga):

```css
[data-brand="qtz"] .ui-button {
  border-radius: 999px;
}
[data-brand="qtz"] .ui-button:hover:not(:disabled) {
  transform: scale(1.03);
}
```

`npm run tokens:build` lo detecta solo — si existe `<brand>.overrides.css`, lo suma al CSS generado
de esa marca. No hace falta tocar el script, ni Storybook, ni los componentes.

**Qué se puede overridear ahí, y qué no** (para que esto no termine en que cada marca reinventa
cada componente):

- ✅ Permitido: color, forma (`radius`/`border`), sombra, tipografía, transiciones/microinteracciones.
- 🚫 No permitido: layout interno, agregar/quitar elementos, cambiar el slot API. Si una marca
  necesita eso, es señal de que el **componente** necesita una prop nueva (ej.
  `<Card :show-badge="...">`), revisada como cualquier cambio de API del componente — nunca un
  parche CSS silencioso. La prop la usa quien consume la librería, no se activa sola "por marca".

## Agregar un componente nuevo

Seguir el patron de `packages/ui/src/components/Button/`:

- `NombreComponente.vue` — usa solo variables CSS de tokens, nunca valores de marca hardcodeados.
- `NombreComponente.stories.ts` — variantes visibles en el catalogo, con `tags: ['autodocs', '<categoria>']`
  (`autodocs` genera la pagina de documentacion sola; la categoria alimenta el filtro por tags del
  sidebar de Storybook — usar una de las existentes: `forms`, `display`, `media`, `feedback`, o sumar
  una nueva si no encaja).
- `NombreComponente.spec.ts` — tests con Vitest + Vue Testing Library.
- Exportarlo desde `packages/ui/src/index.ts`.

Para estado compartido entre componentes (ej. una cola de notificaciones), usar un composable con
estado en closure (ver `Notification/useNotifications.ts`) o `provide`/`inject` para compound
components (ej. `Carousel` + `CarouselSlide`, o el arbol mas profundo de `TicketPicker` — un
composable factory `createXState()` instanciado una vez por componente y proveido a los hijos, ver
`TicketPicker/useTicketPickerState.ts`) — no Pinia, para no forzarle esa dependencia a quien consuma
la libreria.

Si un componente necesita muchos strings de copy overrideables (mas de ~6-8, donde listarlos como
props flat se vuelve incomodo), se aparta la convencion de props flat y se agrupa en un solo prop
`copy?: Partial<XCopy>` con un `DEFAULT_X_COPY` exportado (ver `TicketPicker/types.ts`) — mas facil
de swapear entero para i18n que 20 props sueltos.

## Flujo de trabajo

Desarrollo publica componentes -> Storybook los muestra con variantes y theming por marca ->
marketing navega y elige -> desarrollo implementa esa eleccion en el sitio/app final con
`@frontendlinx/ui`.

## Publicar una version nueva

Los paquetes `@frontendlinx/tokens` y `@frontendlinx/ui` se publican al **npm package registry
de este proyecto en GitLab** (no hace falta infraestructura extra, ya viene con GitLab).

1. Subir la version en el/los `package.json` que cambiaron (`packages/tokens` y/o `packages/ui`).
2. Mergear a `main`.
3. Crear un tag (ej. `git tag v0.2.0 && git push origin v0.2.0`).

El tag dispara el job `publish` en `.gitlab-ci.yml`, que compila todo y hace `npm publish` de
ambos paquetes usando `CI_JOB_TOKEN` (no requiere ningun secreto configurado a mano).

### Publicar a mano (sin CI)

Necesitas un token con permiso de escritura en el registry del proyecto (Settings > Access Tokens,
scope `api` o `write_registry`). En tu `~/.npmrc` local:

```
@frontendlinx:registry=https://gitlab-apps.trillonarios.com/api/v4/projects/<PROJECT_ID>/packages/npm/
//gitlab-apps.trillonarios.com/api/v4/projects/<PROJECT_ID>/packages/npm/:_authToken=<TU_TOKEN>
```

(`<PROJECT_ID>` esta en la pagina principal del proyecto en GitLab, debajo del nombre.) Despues:

```bash
npm run publish:tokens
npm run publish:ui
```

## Como lo instala otro repo (equipo de desarrollo)

En el repo consumidor, agregar al `.npmrc` del proyecto (o al global) la misma linea de registry
de arriba (sin necesidad del `_authToken` si el registry es publico dentro de la org; si es
privado, cada dev necesita su propio token de lectura). Despues:

```bash
npm install @frontendlinx/ui @frontendlinx/tokens
```

Uso en la app:

```js
// una vez, en el entrypoint de la app
import '@frontendlinx/tokens/dist/index.css' // o solo el .css de la marca que usa esa app
import '@frontendlinx/ui/style.css'
```

```vue
<script setup>
import { Button } from '@frontendlinx/ui'
</script>

<template>
  <!-- data-brand activa el theming de esa marca en toda la app -->
  <div data-brand="nwt">
    <Button variant="primary">Continuar</Button>
  </div>
</template>
```

**Importante si usas componentes con `Teleport` (`Modal`, `TicketPicker`):** su contenido se
monta como hijo directo de `<body>`, no dentro de tu `<div data-brand="...">`. Como las variables
CSS de los tokens se heredan por el arbol real del DOM, un `data-brand` puesto solo en un div
interno no llega a ese contenido teleportado (se ve sin estilos de marca). Poné el atributo en
`<html>` o `<body>` en vez de un wrapper interno:

```js
// una vez, al elegir/cambiar de marca en tu app
document.documentElement.dataset.brand = 'nwt'
```

```html
<html data-brand="nwt">
```

### Tipografias

Los tokens solo declaran el nombre de la fuente (`--font-family-body`, etc.) — la libreria **no
inyecta requests externos a Google Fonts por su cuenta** en la app que la consume (cada app decide
si usa Google Fonts, un CDN propio, o fuentes autohospedadas). Cada app consumidora tiene que cargar
la tipografia de su marca. Fuentes actuales por marca (Google Fonts):

| Marca | Fuente |
| --- | --- |
| NWT | [Lato](https://fonts.google.com/specimen/Lato) |
| LTK | [Albert Sans](https://fonts.google.com/specimen/Albert+Sans) |
| QTZ | [Outfit](https://fonts.google.com/specimen/Outfit) (titulos) + [Work Sans](https://fonts.google.com/specimen/Work+Sans) (texto) |

Ejemplo de carga vía Google Fonts (ajustar a las marcas que use cada app):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"
  rel="stylesheet"
/>
```

Storybook y el sandbox de dev (`packages/ui`) sí cargan todas las fuentes de las 3 marcas
actuales (ver `.storybook/preview-head.html` e `index.html`) para que el catalogo se vea con la
tipografia real — si tenes `npm run storybook` corriendo, reiniciá el proceso después de tocar
`preview-head.html`, ese archivo se lee una sola vez al arrancar el servidor, no tiene hot-reload.
