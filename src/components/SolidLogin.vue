<i18n src="@/common/locales.json"></i18n>
<template>
  <div class="solid-login">
    <v-text-field label="Seu endereço" v-model="userUrl" />
    <v-btn color="primary" v-if="webId == null" @click="login">{{
      $t("login")
    }}</v-btn>
    <v-btn color="primary" v-else @click="logout">{{ $t("logout") }}</v-btn>
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
      userUrl: "",
    };
  },
  computed: {
    webId() {
      return this.$store.state.auth.webId;
    },
  },
  created() {
    this.$store.dispatch("auth/silentLogin");
  },
  methods: {
    login() {
      this.$store.dispatch("auth/login", { userUrl: this.userUrl });
    },
    async logout() {
      this.$store.dispatch("auth/logout");
    },
  },
};
</script>
