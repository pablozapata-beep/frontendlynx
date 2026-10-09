<script setup lang="ts">
import { toRaw } from 'vue'
import { useUid } from '../FormField/useUid'
import type { NavItem } from './types'

// Interno de NavDrawer: pinta un nivel de items y se llama a si mismo para los hijos de cada grupo.
defineOptions({ name: 'NavDrawerList' })

const props = withDefaults(
  defineProps<{
    items: NavItem[]
    activeId?: string
    expandedIds: ReadonlySet<string>
    level?: number
  }>(),
  {
    activeId: undefined,
    level: 0,
  },
)

const emit = defineEmits<{
  select: [item: NavItem, event: MouseEvent]
  toggle: [id: string]
}>()

const uid = useUid('ui-nav-drawer-group')
const isExpanded = (id: string) => props.expandedIds.has(id)
const hasChildren = (item: NavItem) => !!item.children?.length
// Si los items viven en un ref() el icono-componente queda envuelto en reactivo y Vue avisa; toRaw lo evita.
const rawIcon = (icon: NavItem['icon']) => (typeof icon === 'string' ? icon : toRaw(icon))
</script>

<template>
  <ul class="ui-nav-drawer-list" :class="{ 'ui-nav-drawer-list--nested': level > 0 }">
    <template v-for="item in items" :key="item.id">
      <li v-if="item.type === 'divider'" class="ui-nav-drawer-list__divider" role="separator" />

      <li v-else-if="item.type === 'heading'" class="ui-nav-drawer-list__heading">{{ item.label }}</li>

      <li v-else class="ui-nav-drawer-list__item">
        <button
          v-if="hasChildren(item)"
          type="button"
          class="ui-nav-drawer-list__link"
          :disabled="item.disabled"
          :aria-expanded="isExpanded(item.id)"
          :aria-controls="`${uid}-${item.id}`"
          @click="emit('toggle', item.id)"
        >
          <span v-if="item.icon" class="ui-nav-drawer-list__icon" aria-hidden="true">
            <img v-if="typeof item.icon === 'string'" :src="item.icon" alt="" />
            <component :is="rawIcon(item.icon)" v-else />
          </span>
          <span class="ui-nav-drawer-list__label">{{ item.label }}</span>
          <span v-if="item.badge" class="ui-nav-drawer-list__badge">{{ item.badge }}</span>
          <svg
            class="ui-nav-drawer-list__chevron"
            :class="{ 'ui-nav-drawer-list__chevron--open': isExpanded(item.id) }"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <component
          :is="item.href && !item.disabled ? 'a' : 'button'"
          v-else
          class="ui-nav-drawer-list__link"
          :class="{ 'ui-nav-drawer-list__link--active': item.id === activeId }"
          :href="item.href && !item.disabled ? item.href : undefined"
          :type="item.href && !item.disabled ? undefined : 'button'"
          :disabled="item.disabled || undefined"
          :aria-current="item.id === activeId ? 'page' : undefined"
          @click="emit('select', item, $event)"
        >
          <span v-if="item.icon" class="ui-nav-drawer-list__icon" aria-hidden="true">
            <img v-if="typeof item.icon === 'string'" :src="item.icon" alt="" />
            <component :is="rawIcon(item.icon)" v-else />
          </span>
          <span class="ui-nav-drawer-list__label">{{ item.label }}</span>
          <span v-if="item.badge" class="ui-nav-drawer-list__badge">{{ item.badge }}</span>
        </component>

        <div v-if="hasChildren(item) && isExpanded(item.id)" :id="`${uid}-${item.id}`">
          <NavDrawerList
            :items="item.children!"
            :active-id="activeId"
            :expanded-ids="expandedIds"
            :level="level + 1"
            @select="(child, event) => emit('select', child, event)"
            @toggle="(id) => emit('toggle', id)"
          />
        </div>
      </li>
    </template>
  </ul>
</template>

<style scoped>
.ui-nav-drawer-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.ui-nav-drawer-list--nested {
  margin-top: 4px;
  padding-left: 1.25rem;
}

.ui-nav-drawer-list__divider {
  height: 1px;
  margin: 8px 4px;
  background: var(--color-surface-dark-light);
}

.ui-nav-drawer-list__heading {
  padding: 12px 12px 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-surface-dark-text-primary);
}

.ui-nav-drawer-list__link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  min-height: 2.75rem;
  padding: 0 12px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-surface-dark-text-secondary);
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.ui-nav-drawer-list__link:hover:not(:disabled) {
  background: var(--color-surface-dark-light);
  color: white;
}
.ui-nav-drawer-list__link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}
.ui-nav-drawer-list__link:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.ui-nav-drawer-list__link--active {
  background: var(--color-secondary-active-surface);
  color: white;
}

.ui-nav-drawer-list__icon {
  display: inline-flex;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-surface-dark-text-primary);
}
.ui-nav-drawer-list__link:hover:not(:disabled) .ui-nav-drawer-list__icon,
.ui-nav-drawer-list__link--active .ui-nav-drawer-list__icon {
  color: inherit;
}
.ui-nav-drawer-list__icon :deep(svg),
.ui-nav-drawer-list__icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ui-nav-drawer-list__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-nav-drawer-list__badge {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-on-primary, white);
  font-size: 10px;
  font-weight: 700;
  line-height: 1.3;
}

.ui-nav-drawer-list__chevron {
  flex-shrink: 0;
  opacity: 0.7;
  transition: transform 0.2s ease;
}
.ui-nav-drawer-list__chevron--open {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  .ui-nav-drawer-list__link,
  .ui-nav-drawer-list__chevron {
    transition: none;
  }
}
</style>
