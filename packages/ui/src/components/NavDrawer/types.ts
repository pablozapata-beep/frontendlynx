import type { Component } from 'vue'

export interface NavItem {
  id: string
  label: string
  /**
   * 'item' (por defecto): link o boton. 'heading': titulo de seccion no interactivo.
   * 'divider': separador (ignora el resto de los campos).
   */
  type?: 'item' | 'heading' | 'divider'
  /** Componente Vue (se pinta con currentColor) o URL de una imagen. */
  icon?: Component | string
  /** Con href el item es un <a> real; sin href es un <button>. En ambos casos se emite `select`. */
  href?: string
  /** Texto corto destacado a la derecha, ej. "New". */
  badge?: string
  disabled?: boolean
  /** Con hijos, el item es un grupo desplegable. */
  children?: NavItem[]
  /** Solo grupos: arranca desplegado. */
  expanded?: boolean
}
