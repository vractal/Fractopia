<i18n src="@/common/locales.json"></i18n>
<template>
  <v-container>
    <v-row class="d-flex justify-center text-center">
      <v-sheet elevation="1" width="700" class="solid-login" padding="1">
        <h1>Fractopia</h1>

        <v-form @submit="login">
          <v-text-field
            label="Url do Pod"
            placeholder="Ex: https://exemplo.fractopia.org"
            v-model="userUrl"
          />
          <v-btn color="primary" @click="login" :loading="loading">
            Login
          </v-btn>
        </v-form>
      </v-sheet>
    </v-row>
  </v-container>
</template>

<script>
import { VBtn, VContainer } from "vuetify/lib";

export default {
  name: "SolidLogin",
  components: {
    VBtn,
    VContainer,
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
    login() {
      this.$store.dispatch("auth/login", { userUrl: this.userUrl });
    },
  },
};
</script>
