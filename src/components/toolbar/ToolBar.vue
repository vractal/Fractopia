<template>
  <div>
    <v-speed-dial
      class="ma-6"
      v-model="fab"
      direction="top"
      transition="scale-transition"
      open-on-hover
      absolute
      bottom
    >
      <template v-slot:activator>
        <div class="d-flex flex-column align-center">
          <v-btn x-large v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab">
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-account-circle
            </v-icon>
          </v-btn>
          <p class="mt-2">{{ context.name }}</p>
        </div>
      </template>
      <logout-button />

      <v-btn fab dark color="green">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-speed-dial>
  </div>
</template>

<script>
import LogoutButton from "./LogoutButton.vue";
export default {
  name: "ToolBar",
  components: { LogoutButton },
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
