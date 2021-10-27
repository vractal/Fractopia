// const solid = window.solid;
import {
  getSolidDataset,
  getThing,
  getThingAll,
  getUrl,
  getStringNoLocale,
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
/* eslint-disable-next-line */
import auth from "solid-auth-client";
import { fetchDocument, createDocument } from "tripledoc";
// import { vcard, dct /* rdfs, foaf, ldp, acl */ } from "rdf-namespaces";
/* eslint-disable-next-line */
import axios from "axios";
import { rdf, rdfs, schema } from "rdf-namespaces";
// import Task from "@/models/Task";
// import FC from "solid-file-client";
// const fc = new FC(auth);

// initial state
const state = () => ({
  webId: null,
  todos: [],
  //Storage / Browser
});

// getters
const getters = {};

// actions
const actions = {
  async createTodo(context, todo) {
    let tmp = context.rootState.solid.storage + "/public/tmp/todos/";
    let indexFile = tmp + "/todos.ttl";

    let ttl_name = todo.name.replace(/\s/g, "_");
    let todoDoc = {};

    // todo.subject = ttl_name;
    // todo.path = context.rootState.solid.storage + "tmp/todos" + ttl_name + "/";
    try {
      todoDoc = await fetchDocument(indexFile);
    } catch (e) {
      todoDoc = await createDocument(indexFile);
    }

    let subject = todoDoc.addSubject({ identifier: ttl_name });
    subject.addRef(rdf.type, "https://vocab.org/lifecycle/schema#Task");

    subject.addLiteral(rdfs.label, todo.name.trim());
    subject.addDateTime(schema.dateCreated, new Date(Date.now()));

    await todoDoc.save();
    context.dispatch("getTodos");
  },
  async getTodos(context) {
    const webId = context.rootState.auth.webId;
    const profileDataset = await getSolidDataset(webId, {
      fetch: fetch,
    });
    const profileThing = getThing(profileDataset, webId);
    const storageUrl = getUrl(
      profileThing,
      "http://www.w3.org/ns/pim/space#storage"
    );
    let indexFile = storageUrl + "public/tmp/todos/todos.ttl";
    let todos = [];

    let todoDataset = await getSolidDataset(indexFile);
    let todoThings = await getThingAll(todoDataset);

    for (let task of todoThings) {
      todos.push({
        label: getStringNoLocale(task, rdfs.label),
      });
      context.commit("updateTodos", todos);
    }
  },
};

// mutations
const mutations = {
  setTodos() {},
  updateTodos(state, todos) {
    state.todos = todos;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
