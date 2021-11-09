import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import notes from "./modules/notes";
import hiperfolder from "./modules/hiperfolder"
import portals from "./modules/portals"
import spaces from "./modules/spaces"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth, notes, hiperfolder, portals, spaces },
});
