import auth from 'solid-auth-client';

export default {
  methods: {
    async popupLogin() {
      let session = await auth.currentSession();
      let popupUri = './dist-popup/popup.html';  //  let popupUri = 'https://solidcommunity.net/common/popup.html';
      if (!session){
        session = await auth.popupLogin({ popupUri });
      }
    },
    makeToast(title, content,variant = null) {
      // this.$bvToast.toast(content , {
      //   title: title,
      //   variant: variant,
      //   solid: true
      // })
      console.log('toast',content,variant)

    }
  }


}
