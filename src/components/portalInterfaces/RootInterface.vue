<template>
  <div>
    <div>
      <ToolBar :subPortals="subPortals" />
    </div>
    <v-container class="canvas"> <slot /> </v-container>
  </div>
</template>
<script>
import ToolBar from "@/components/toolbar/ToolBar.vue";

export default {
  components: { ToolBar },
};
</script>
<style>
.canvas {
  padding: 3em;
  max-width: 1200px;
}
</style>
