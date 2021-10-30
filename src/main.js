import Vue from "vue";
import App from "./App.vue";
import VueI18n from "vue-i18n";
import store from "./store";

import colors from "vuetify/lib/util/colors";
import Vuetify from "vuetify/lib/framework";
import MarkdownEditor from "@/plugins/markdownEditor";
import ActiveView from "@/components/ActiveView";

import VueRouter from "vue-router";
const routes = [{ path: "/", component: ActiveView }];

const router = new VueRouter({
  mode: "history",
  routes,
});
Vue.use(VueRouter);

Vue.use(Vuetify);
const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.purple,
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3,
        background: colors.grey,
      },
    },
  },
});

Vue.config.productionTip = false;

// Internacionalization

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: navigator.language.split("-")[0] || "en",
  messages: {
    en: {},
  },
});

Vue.use(MarkdownEditor);

var vue = new Vue({
  i18n,
  store,
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");

export default vue;
