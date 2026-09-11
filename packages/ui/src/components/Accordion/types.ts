import type { ComputedRef, Ref } from 'vue'

export interface AccordionContext {
  isMultiple: ComputedRef<boolean>
  activeId: Ref<symbol | null>
}
