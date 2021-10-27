<i18n src="@/common/locales.json"></i18n>
<template>
  <div>
    <h1>Nota</h1>

    <v-container>
      <v-card max-width="500">
        <v-form>
          <v-textarea
            name="input-7-1"
            v-model="nota"
            hint="Tarefa"
          ></v-textarea>
        </v-form>
        <v-btn icon @click="create"> <v-icon>mdi-plus</v-icon></v-btn>
        <v-btn icon @click="getAll"> <v-icon>mdi-reload</v-icon></v-btn>
      </v-card>
      <v-card max-width="500">
        <v-list>
          <v-list-item v-for="(item, index) in todos" v-bind:key="index">
            <v-list-item-content>
              <v-list-item-title v-text="item.label"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-container>
  </div>
</template>

<script>
// import EditableDiv from "./EditableDiv.vue";

import "vuetify";
// import { fetchDocument } from "tripledoc";
// import { vcard, dct /* rdfs, foaf, ldp, acl */ } from "rdf-namespaces";
// import axios from "axios";

export default {
  name: "Note",
  components: {},
  computed: {
    webId() {
      return this.$store.state.solid.webId;
    },
    todos() {
      return this.$store.state.todos.todos;
    },
  },
  watch: {
    todos(oldList, newList) {
      console.log(oldList, newList);
    },
  },
  data() {
    return {
      path: {},
      activeTodo: null,
      nota: "",
    };
  },
  mounted() {
    this.$nextTick(this.getAll());
  },
  methods: {
    create() {
      //   this.$store.dispatch("solid/updateProfile", this.profile);
      this.$store.dispatch("todos/createTodo", { name: this.nota });
      this.nota = "";
    },
    getAll() {
      this.$store.dispatch("todos/getTodos");
    },
    update() {},
    delete() {},
  },
};
</script>
