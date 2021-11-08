<i18n src="@/common/locales.json"></i18n>
<template>
  <div class="d-flex align-center justify-center">
    <v-sheet
      elevation="1"
      width="700"
      class="pa-8 d-flex flex-column text-center solid-login"
      padding="1"
    >
      <h1>Fractopia</h1>

      <v-form @submit="login">
        <v-text-field
          label="Url do Pod"
          placeholder="Ex: https://exemplo.fractopia.org"
          v-model="userUrl"
        />
        <v-btn color="primary" @click="login" :loading="loading"> Login </v-btn>
      </v-form>
    </v-sheet>
  </div>
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
