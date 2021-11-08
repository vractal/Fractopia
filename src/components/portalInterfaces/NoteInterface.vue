<template>
  <v-container max-width="960px" class="d-flex flex-row justify-center">
    <HiperList />
    <Note />
  </v-container>
</template>
<script>
import Note from "@/components/Note.vue";
import HiperList from "@/components/HiperList.vue";

export default {
  components: { Note, HiperList },
};
</script>
<style>
.canvas {
  padding: 3em;
  max-width: 1200px;
}
</style>
