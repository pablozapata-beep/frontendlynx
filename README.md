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
`Brand A` / `Brand B` y ver los componentes repintados con cada tema.

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

1. Crear `packages/tokens/brands/<marca>.json` con la misma forma que `brand-a.json`.
2. Correr `npm run tokens:build` (regenera el CSS, sin tocar componentes).
3. Sumar la marca al selector de Storybook en `packages/ui/.storybook/preview.ts` (`globalTypes.brand.toolbar.items`).

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
components (ej. `Carousel` + `CarouselSlide`) — no Pinia, para no forzarle esa dependencia a quien
consuma la libreria.

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
  <div data-brand="brand-a">
    <Button variant="primary">Continuar</Button>
  </div>
</template>
```
