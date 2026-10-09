<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import NavDrawerList from './NavDrawerList.vue'
import type { NavItem } from './types'

const props = withDefaults(
  defineProps<{
    open: boolean
    items: NavItem[]
    /** Id del item activo: se marca con aria-current="page". */
    activeId?: string
    side?: 'left' | 'right'
    navLabel?: string
    closeLabel?: string
    /** Tras elegir un item (que no sea un grupo) emite `close`. */
    closeOnSelect?: boolean
    closeOnBackdrop?: boolean
    closeOnEscape?: boolean
  }>(),
  {
    activeId: undefined,
    side: 'left',
    navLabel: 'Menú principal',
    closeLabel: 'Cerrar menú',
    closeOnSelect: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
  },
)

const emit = defineEmits<{
  close: []
  /** Se emite con el item y el MouseEvent: quien consume puede hacer preventDefault() si no quiere navegar. */
  select: [item: NavItem, event: MouseEvent]
}>()

defineSlots<{
  /** Arriba del menu, junto al boton de cerrar (ej. logo). */
  header(): unknown
  /** Debajo del menu (ej. idioma, soporte). */
  footer(): unknown
}>()

const panelRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)

function collectExpanded(items: NavItem[], into: Set<string>) {
  for (const item of items) {
    if (item.children?.length) {
      if (item.expanded) into.add(item.id)
      collectExpanded(item.children, into)
    }
  }
  return into
}

const expandedIds = ref<Set<string>>(collectExpanded(props.items, new Set()))

watch(
  () => props.items,
  (items) => {
    expandedIds.value = collectExpanded(items, new Set(expandedIds.value))
  },
)

function toggleGroup(id: string) {
  const next = new Set(expandedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expandedIds.value = next
}

function onSelect(item: NavItem, event: MouseEvent) {
  emit('select', item, event)
  if (props.closeOnSelect) emit('close')
}

function onBackdropClick(event: MouseEvent) {
  if (props.closeOnBackdrop && event.target === event.currentTarget) emit('close')
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    emit('close')
    return
  }
  if (event.key !== 'Tab' || !panelRef.value) return

  const focusables = Array.from(panelRef.value.querySelectorAll<HTMLElement>(FOCUSABLE))
  if (focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const active = document.activeElement

  if (event.shiftKey && (active === first || !panelRef.value.contains(active))) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (active === last || !panelRef.value.contains(active))) {
    event.preventDefault()
    first.focus()
  }
}

let lastFocused: HTMLElement | null = null
let previousBodyOverflow = ''

function lock() {
  lastFocused = document.activeElement as HTMLElement | null
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKeydown)
  closeButtonRef.value?.focus()
}

function unlock() {
  document.body.style.overflow = previousBodyOverflow
  document.removeEventListener('keydown', onKeydown)
  lastFocused?.focus()
  lastFocused = null
}

// flush: 'post' para que el DOM del drawer ya exista (o ya no) cuando corre.
watch(
  () => props.open,
  (isOpen, wasOpen) => {
    if (isOpen) lock()
    else if (wasOpen) unlock()
  },
  { immediate: true, flush: 'post' },
)

onBeforeUnmount(() => {
  if (props.open) unlock()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="ui-nav-drawer">
      <div
        v-if="open"
        class="ui-nav-drawer"
        :class="`ui-nav-drawer--${side}`"
        @click="onBackdropClick"
      >
        <div ref="panelRef" class="ui-nav-drawer__panel" role="dialog" aria-modal="true" :aria-label="navLabel">
          <div class="ui-nav-drawer__top">
            <div v-if="$slots.header" class="ui-nav-drawer__header">
              <slot name="header" />
            </div>
            <button
              ref="closeButtonRef"
              type="button"
              class="ui-nav-drawer__close"
              :aria-label="closeLabel"
              @click="emit('close')"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav class="ui-nav-drawer__nav" :aria-label="navLabel">
            <NavDrawerList
              :items="items"
              :active-id="activeId"
              :expanded-ids="expandedIds"
              @select="onSelect"
              @toggle="toggleGroup"
            />
          </nav>

          <div v-if="$slots.footer" class="ui-nav-drawer__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ui-nav-drawer {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
}
.ui-nav-drawer--right {
  justify-content: flex-end;
}

.ui-nav-drawer__panel {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: min(20rem, 86vw);
  height: 100%;
  padding: var(--spacing-sm);
  overflow-y: auto;
  font-family: var(--font-family-body);
  background: var(--color-surface-dark);
  color: var(--color-surface-dark-text-secondary);
}

.ui-nav-drawer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  min-height: 3rem;
  padding: 0 4px 0 8px;
  margin-bottom: var(--spacing-sm);
}
.ui-nav-drawer__header {
  min-width: 0;
}
.ui-nav-drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  margin-left: auto;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-surface-dark-light);
  color: var(--color-surface-dark-text-secondary);
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.ui-nav-drawer__close:hover {
  background: var(--color-secondary-active-surface);
  color: white;
}
.ui-nav-drawer__close:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.ui-nav-drawer__nav {
  flex: 1;
}

.ui-nav-drawer__footer {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-surface-dark-light);
}

.ui-nav-drawer-enter-active,
.ui-nav-drawer-leave-active {
  transition: background-color 0.25s ease, backdrop-filter 0.25s ease;
}
.ui-nav-drawer-enter-active .ui-nav-drawer__panel,
.ui-nav-drawer-leave-active .ui-nav-drawer__panel {
  transition: transform 0.28s cubic-bezier(0.2, 0.9, 0.25, 1);
}
.ui-nav-drawer-enter-from,
.ui-nav-drawer-leave-to {
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0);
}
.ui-nav-drawer--left.ui-nav-drawer-enter-from .ui-nav-drawer__panel,
.ui-nav-drawer--left.ui-nav-drawer-leave-to .ui-nav-drawer__panel {
  transform: translateX(-100%);
}
.ui-nav-drawer--right.ui-nav-drawer-enter-from .ui-nav-drawer__panel,
.ui-nav-drawer--right.ui-nav-drawer-leave-to .ui-nav-drawer__panel {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .ui-nav-drawer-enter-active,
  .ui-nav-drawer-leave-active,
  .ui-nav-drawer-enter-active .ui-nav-drawer__panel,
  .ui-nav-drawer-leave-active .ui-nav-drawer__panel {
    transition: none;
  }
}
</style>
