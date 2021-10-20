import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import store from './store'



Vue.config.productionTip = false

// Solid from ?

let solid = window.solid
console.log("SOLID",solid)

// Internacionalization

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: navigator.language.split("-")[0] || 'en',
  messages: {
    en: {}
  }
})

new Vue({
  i18n,
  solid,
  store,
  render: h => h(App),
}).$mount('#app')
