<template>
  <div>
    <v-container class="canvas">
      <v-row class="d-flex justify-center">
        <note v-if="active == 'note'" />
      </v-row>
    </v-container>
  </div>
</template>
<script>
import Note from "./Note.vue";
export default {
  components: { Note },
  data: () => ({ active: "note" }),
};
</script>
<style>
.canvas {
  padding: 3em;
}
</style>
