<template>
  <div>
    <v-container class="canvas">
      <div class="d-flex justify-center align-start">
        <HiperList />

        <file-tree v-if="showFileManager" />

        <note v-if="active == 'note'" />
      </div>
    </v-container>
  </div>
</template>
<script>
import FileTree from "./FileTree.vue";
import HiperList from "./HiperList.vue";

import Note from "./Note.vue";
export default {
  components: { Note, FileTree, HiperList },
  data: () => ({ active: "note", showFileManager: true }),
};
</script>
<style>
.canvas {
  padding: 3em;
  max-width: 1200px;
}
</style>
