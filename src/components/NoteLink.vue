<template>
  <v-btn @click="newNote">{{ label }}</v-btn>
</template>
<script>
export default {
  created() {
    console.log("newNote", this.$attrs.title);
  },
  props: ["src", "alt"],
  computed: {
    label() {
      return this.$store.state.notes.cache[this.$attrs.href]?.title;
    },
  },
  methods: {
    async newNote() {
      console.log("newNote", this);

      this.$store.dispatch("notes/getNote", this.$attrs.href);
    },
  },
};
</script>
