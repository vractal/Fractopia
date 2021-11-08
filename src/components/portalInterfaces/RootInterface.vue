<template>
  <div>
    <div>
      <ToolBar />
      <portal-switch class="portal-switch" />
    </div>
    <v-container class="canvas"> <slot /> </v-container>
  </div>
</template>
<script>
import ToolBar from "@/components/toolbar/ToolBar.vue";
import PortalSwitch from "@/components/toolbar/PortalSwitch.vue";

export default {
  components: { ToolBar, PortalSwitch },
};
</script>
<style>
.canvas {
  padding: 3em;
  max-width: 1200px;
}
</style>
