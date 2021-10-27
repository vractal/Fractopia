<i18n src="@/common/locales.json"></i18n>
<template>
  <div>
    <h1>Profile</h1>

    <v-btn @click="get">get</v-btn>

    <h2>Amigos</h2>

    <v-card class="mx-auto" max-width="400" elevation="2" v-if="profile">
      <editable-div
        v-model="profile.name"
        placeholder="Seu Nome"
        @input="update"
      ></editable-div>

      <editable-div
        v-model="profile.gender"
        placeholder="gender"
        @input="update"
      ></editable-div>

      <EditableDiv
        v-model="profile.country"
        placeholder="your COUNTRY"
        @input="update"
      ></EditableDiv
      >.
    </v-card>

    <div v-if="profile">
      <v-card
        class="mx-auto"
        max-width="400"
        v-for="(friend, index) in profile.friends"
        v-bind:key="index"
        >{{ friend }}</v-card
      >
    </div>
  </div>
</template>

<script>
import auth from "solid-auth-client";
import loginMixin from "@/mixins/loginMixin";
import profileMixin from "@/mixins/profileMixin";
import EditableDiv from "./EditableDiv.vue";

export default {
  name: "SolidLogin",
  mixins: [loginMixin, profileMixin],
  components: {
    EditableDiv,
  },
  computed: {
    webId() {
      return this.$store.state.solid.webId;
    },
  },
  data() {
    return {
      profile: null,
    };
  },
  //   created(){
  //       this.get()
  //   },
  methods: {
    update() {
      this.$store.dispatch("solid/updateProfile", this.profile);
    },
    async get() {
      this.profile = await this.getProfile(this.webId);
      console.log("profilepego", this.profile);
    },
    async logout() {
      await auth.logout();
    },
  },
};
</script>
