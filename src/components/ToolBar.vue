<template>
  <div>
    <v-speed-dial
      v-model="fab"
      direction="top"
      transition="scale-transition"
      open-on-hover
      absolute
      bottom
    >
      <template v-slot:activator>
        <v-btn x-large v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-account-circle
          </v-icon>
        </v-btn>
        <p>{{ context.name }}</p>
      </template>
      <v-btn fab dark color="green">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn fab dark color="indigo">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn fab dark color="red">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
  </div>
</template>

<script>
export default {
  name: "ToolBar",
  components: {},
  computed: {},
  data() {
    return {
      fab: false,
      context: {
        name: "@CONTEXTO",
      },
    };
  },

  methods: {},
};
</script>
