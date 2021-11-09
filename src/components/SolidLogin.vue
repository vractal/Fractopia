<i18n src="@/common/locales.json"></i18n>
<template>
  <v-sheet
    elevation="0"
    class="d-flex justify-center align-center"
    height="100%"
  >
    <v-card
      rounded
      elevation="1"
      class="pa-8 d-flex justify-center align-center flex-column"
    >
      <!-- <template v-slot: -->
      <h1 class="text--primary">Fractopia</h1>
      <p class="">People, Things,</p>

      <!-- <v-progress-circular color="primary" :size="70" indeterminate />
      <h2>Carregando Aplicação</h2> -->
      <v-form @submit="login">
        <v-text-field
          label="Url do Pod"
          placeholder="Ex: https://exemplo.fractopia.org"
          v-model="userUrl"
        />
        <v-btn block color="primary" @click="login" :loading="loading">
          Login
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script>
import { VBtn } from "vuetify/lib";

export default {
  name: "SolidLogin",
  components: {
    VBtn,
  },
  data() {
    return {
      userUrl: "https://solidweb.org",
    };
  },
  computed: {
    webId() {
      return this.$store.state.auth.webId;
    },
    loading() {
      return this.$store.state.auth.processing;
    },
  },

  methods: {
    login(event) {
      event.preventDefault();
      this.$store.dispatch("auth/login", { userUrl: this.userUrl });
    },
  },
};
</script>
