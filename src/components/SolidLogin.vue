<i18n src="@/common/locales.json"></i18n>
<template>
  <div class="solid-login">
    <button variant="success" v-if="webId == null" @click="login">{{ $t('login') }}</button>
    <button variant="danger" v-else @click="logout">{{ $t('logout') }}</button>
  </div>
</template>

<script>
import auth from 'solid-auth-client';
import loginMixin from '@/mixins/loginMixin'
import profileMixin from '@/mixins/profileMixin'

export default {
  name: 'SolidLogin',
  mixins: [loginMixin, profileMixin],
  computed:{
    webId() {
      return this.$store.state.solid.webId
    }
  },
  methods: {
    login(){
      this.popupLogin()
    },
    async logout(){
      await  auth.logout()
    },

  }
}
</script>
