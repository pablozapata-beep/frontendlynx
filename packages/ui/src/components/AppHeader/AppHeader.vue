<script setup lang="ts">
import BalancePill from '../BalancePill/BalancePill.vue'
import Button from '../Button/Button.vue'

withDefaults(
  defineProps<{
    /** Con sesion: se muestra el saldo y el icono de usuario en vez de los botones de acceso. */
    loggedIn?: boolean
    /** Se queda fijo arriba al scrollear. */
    sticky?: boolean
    /** Estado del menu lateral, solo para aria-expanded del boton hamburguesa (el drawer lo controlas tu). */
    menuOpen?: boolean
    /**
     * Hace clickable el logo: lo envuelve en un <a href>. Sin esta prop el slot `logo` se renderiza tal cual
     * (puedes poner tu propio <a> o <router-link> ahi).
     */
    logoHref?: string
    balance?: number
    currency?: string
    lowBalanceThreshold?: number
    balanceLabel?: string
    lowBalanceLabel?: string
    noBalanceLabel?: string
    addBalanceLabel?: string
    loginLabel?: string
    signupLabel?: string
    menuLabel?: string
    accountLabel?: string
    /** aria-label del link del logo (solo con logoHref). */
    logoLabel?: string
  }>(),
  {
    loggedIn: false,
    sticky: true,
    menuOpen: false,
    logoHref: undefined,
    balance: undefined,
    currency: '$',
    lowBalanceThreshold: 200,
    balanceLabel: 'Saldo disponible',
    lowBalanceLabel: 'Saldo bajo',
    noBalanceLabel: 'Sin saldo',
    addBalanceLabel: 'Agregar saldo',
    loginLabel: 'Ingresar',
    signupLabel: 'Registrarse',
    menuLabel: 'Abrir menú',
    accountLabel: 'Mi cuenta',
    logoLabel: 'Ir al inicio',
  },
)

const emit = defineEmits<{
  /** Click en la hamburguesa: abrir/cerrar el menu es decision de quien consume. */
  menu: []
  login: []
  signup: []
  addBalance: []
  /** Click en el icono de usuario. */
  account: []
  /** Click en el logo (solo con logoHref). Con el MouseEvent, para poder hacer preventDefault() y navegar con tu router. */
  logo: [event: MouseEvent]
}>()

defineSlots<{
  /** Logo de la marca (ej. un <img> o <svg>). Con logoHref se envuelve en un link; sin esa prop puedes poner tu propio <a>. */
  logo(): unknown
  /** Botones extra antes del bloque de sesion (idioma, chat...). */
  actions(): unknown
  /** Reemplaza los botones de ingresar/registrarse. */
  guest(): unknown
  /** Reemplaza el saldo y el icono de usuario. */
  user(): unknown
  /** Reemplaza el icono del boton de usuario. */
  'account-icon'(): unknown
  /** Segunda fila debajo de la barra (ej. <SubNav>). */
  subnav(): unknown
}>()
</script>

<template>
  <header class="ui-app-header" :class="{ 'ui-app-header--sticky': sticky }">
    <div class="ui-app-header__bar">
      <button
        type="button"
        class="ui-app-header__icon-btn"
        :aria-label="menuLabel"
        :aria-expanded="menuOpen"
        @click="emit('menu')"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div v-if="$slots.logo" class="ui-app-header__logo">
        <a
          v-if="logoHref !== undefined"
          class="ui-app-header__logo-link"
          :href="logoHref"
          :aria-label="logoLabel"
          @click="emit('logo', $event)"
        >
          <slot name="logo" />
        </a>
        <slot v-else name="logo" />
      </div>

      <div class="ui-app-header__spacer" />

      <div v-if="$slots.actions" class="ui-app-header__actions">
        <slot name="actions" />
      </div>

      <div class="ui-app-header__session">
        <template v-if="loggedIn">
          <slot name="user">
            <BalancePill
              v-if="balance !== undefined"
              :balance="balance"
              :currency="currency"
              :low-threshold="lowBalanceThreshold"
              :label="balanceLabel"
              :low-label="lowBalanceLabel"
              :empty-label="noBalanceLabel"
              :add-label="addBalanceLabel"
              @add="emit('addBalance')"
            />
            <button
              type="button"
              class="ui-app-header__icon-btn ui-app-header__account"
              :aria-label="accountLabel"
              @click="emit('account')"
            >
              <slot name="account-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                </svg>
              </slot>
            </button>
          </slot>
        </template>
        <slot v-else name="guest">
          <Button variant="secondary" size="sm" outlined @click="emit('login')">{{ loginLabel }}</Button>
          <Button variant="primary" size="sm" @click="emit('signup')">{{ signupLabel }}</Button>
        </slot>
      </div>
    </div>

    <div v-if="$slots.subnav" class="ui-app-header__subnav">
      <slot name="subnav" />
    </div>
  </header>
</template>

<style scoped>
.ui-app-header {
  box-sizing: border-box;
  width: 100%;
  font-family: var(--font-family-body);
  background: var(--color-surface-dark);
  color: var(--color-surface-dark-text-secondary);
  border-bottom: 1px solid var(--color-surface-dark-light);
}
.ui-app-header--sticky {
  position: sticky;
  top: 0;
  z-index: 100;
}

.ui-app-header__bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  min-height: 3.5rem;
  padding: 0.5rem var(--spacing-md);
}

.ui-app-header__logo {
  display: flex;
  align-items: center;
  min-width: 0;
}
.ui-app-header__logo :deep(img),
.ui-app-header__logo :deep(svg) {
  display: block;
  max-height: 2.25rem;
  width: auto;
}

.ui-app-header__logo-link {
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm);
  color: inherit;
  text-decoration: none;
}
.ui-app-header__logo-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.ui-app-header__spacer {
  flex: 1 1 0;
}

.ui-app-header__actions,
.ui-app-header__session {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.ui-app-header__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.ui-app-header__icon-btn:hover {
  background: var(--color-surface-dark-light);
  color: white;
}
.ui-app-header__icon-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
.ui-app-header__account {
  border-radius: 50%;
  background: var(--color-surface-dark-light);
}

.ui-app-header__subnav {
  padding: 0 var(--spacing-md) 0.75rem;
}

@media (min-width: 641px) {
  .ui-app-header__session :deep(.ui-button) {
    height: 2.5rem;
    padding: 0 var(--spacing-lg);
    font-size: 15px;
    font-weight: 700;
  }
}

@media (max-width: 640px) {
  .ui-app-header__bar {
    gap: var(--spacing-sm);
    padding: 0.5rem var(--spacing-sm);
  }
  .ui-app-header__subnav {
    padding: 0 var(--spacing-sm) 0.65rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ui-app-header__icon-btn {
    transition: none;
  }
}
</style>
