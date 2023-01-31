<template>
  <button class="custom-button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'custom-button'
}
</script>

<style scoped>
.custom-button {
  padding: 10px 15px;
  background: none;
  color: rgb(98, 0, 255);
  border: 1px solid rgb(98, 0, 255);
}
</style>