<template>
  <div id="app">
    <v-app>
      <v-main>
        <loading-card v-if="returningFromAuth && loadingSilent" />

        <div v-else-if="logged">
          <active-view />
        </div>
        <SolidLogin v-else />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import SolidLogin from "@/components/SolidLogin";
import ActiveView from "./components/ActiveView.vue";
import LoadingCard from "./components/LoadingCard.vue";

export default {
  name: "App",
  components: {
    SolidLogin,
    ActiveView,
    LoadingCard,
  },
  created() {
    if (this.returningFromAuth) {
      this.$store.dispatch("auth/silentLogin");
    }
  },
  computed: {
    logged() {
      return this.$store.state.auth.webId;
    },
    returningFromAuth() {
      return this.$route.query.code;
    },
    loadingSilent() {
      return this.$store.state.auth.processingSilent;
    },
    loading() {
      return this.$store.state.auth.processing;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* background-color: #3a3b3c; */
}
</style>
