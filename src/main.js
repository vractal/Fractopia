import Vue from "vue";
import App from "./App.vue";
import VueI18n from "vue-i18n";
import store from "./store";

import colors from "vuetify/lib/util/colors";
import Vuetify from "vuetify/lib/framework";
import MarkdownEditor from "@/plugins/markdownEditor";



import {
  fetch
} from "@inrupt/solid-client-authn-browser";

// eslint-disable-next-line
import Soukai, { definitionsFromContext } from 'soukai';
// eslint-disable-next-line
import { loadModels } from 'soukai';
// eslint-disable-next-line
import SoukaiSolid, { SolidEngine, bootSolidModels } from 'soukai-solid';
// eslint-disable-next-line
import Note from '@/models/Note'
import NoteContainer from '@/models/NoteContainer'


Soukai.useEngine(new SolidEngine(fetch));
// Soukai.loadModel('Note', new Note());

SoukaiSolid.loadSolidModels();
Soukai.loadModels({ Note, NoteContainer });

// bootSolidModels();



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

new Vue({
  i18n,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
