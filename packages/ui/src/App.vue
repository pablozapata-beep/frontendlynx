<script setup lang="ts">
import { ref } from 'vue'
import { Button } from './index'

const brand = ref<'nwt' | 'ltk' | 'qtz'>('nwt')
</script>

<template>
  <div :data-brand="brand" style="padding: 2rem; font-family: sans-serif">
    <label>
      Marca:
      <select v-model="brand">
        <option value="nwt">NWT</option>
        <option value="ltk">LTK</option>
        <option value="qtz">QTZ</option>
      </select>
    </label>

    <div style="display: flex; gap: 1rem; margin-top: 1.5rem">
      <Button variant="primary">Primario</Button>
      <Button variant="secondary">Secundario</Button>
      <Button variant="danger">Peligro</Button>
      <Button variant="primary" disabled>Deshabilitado</Button>
    </div>
  </div>
</template>
