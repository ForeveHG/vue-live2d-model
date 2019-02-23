<template>
  <div id="app">
    <example-one></example-one>
    <!-- <example-two></example-two> -->
  </div>
</template>

<script>
export default {
  name: "app",
  components: {
    exampleOne: () => import('./example1'),
    exampleTwo: () => import('./example2')
  }
};
</script>

<style>

</style>
