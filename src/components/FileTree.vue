<template>
  <v-sheet rounded elevation="1" width="300" class="mx-4">
    <v-treeview
      v-model="tree"
      :open="initiallyOpen"
      :items="items"
      activatable
      item-key="name"
      open-on-click
      :load-children="load"
      :active.sync="active"
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="!item.file">
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
        <v-icon v-else>
          {{ files[item.file] }}
        </v-icon>
      </template>
    </v-treeview>
    <v-btn small @click="fetchInitial"><v-icon>mdi-refresh</v-icon></v-btn>
  </v-sheet>
</template>
<script>
import { fetch } from "@inrupt/solid-client-authn-browser";
import FC from "solid-file-client";
const fc = new FC({ fetch });
export default {
  created() {
    this.fetchInitial();
  },
  data: () => ({
    active: [],
    url: "https://zesolid.solidcommunity.net/public/tmp/notes/",
    initiallyOpen: ["public"],
    files: {
      md: "mdi-language-markdown",
      pdf: "mdi-file-pdf",
      png: "mdi-file-image",
      txt: "mdi-file-document-outline",
      xls: "mdi-file-excel",
      js: "mdi-nodejs",
      json: "mdi-code-json",
      html: "mdi-language-html5",
    },
    tree: [],
    items: [],
  }),
  watch: {
    active(newValue, oldValue) {
      if (newValue.length > 0) {
        this.$store.dispatch("notes/getNote", { noteId: newValue[0] });
      }
      console.log("oldValue", oldValue, newValue);
    },
  },
  methods: {
    async parseFileTree(path, level = 0, maxLevels) {
      console.log("treeParser", level, path);
      const isLastLevel = level === maxLevels;
      level += 1;

      let files = [];
      let subFolders = [];

      try {
        var folder = await this.get(path);
      } catch (e) {
        console.log("error", e);
        return [];
      }

      if (folder.folders && folder.folders.length > 0) {
        for (const subFolder of folder.folders) {
          let parsedSubFolder = {};
          if (isLastLevel) {
            parsedSubFolder = {
              name: subFolder.name,
              children: [],
              unchecked: true,
              url: subFolder.url,
            };
          } else {
            let subFolderChildren = await this.parseFileTree(
              subFolder.url,
              level,
              maxLevels
            );
            subFolderChildren =
              subFolderChildren.length > 0
                ? { children: subFolderChildren }
                : {};
            parsedSubFolder = {
              name: subFolder.name,
              url: subFolder.url,
              ...subFolderChildren,
            };
          }
          subFolders.push(parsedSubFolder);
        }
      }

      if (folder.files && folder.files.length > 0) {
        for (const file of folder.files) {
          files.push({
            name: file.name,
            type: file.type,
            file: "md",
            url: file.url,
          });
        }
      }
      return [...subFolders, ...files];
    },
    async get(url) {
      const folder = await fc.readFolder(url);
      return folder;
    },

    async fetchInitial() {
      this.items = await this.parseFileTree(this.url, 0, 1);
      console.log("initial", this.items);
    },
    async load(event) {
      var children = await this.parseFileTree(event.url, 0, 1);

      const modifyTreeNodeByUrl = (url, array, newField = {}) => {
        let newArray = [];
        for (const item of array) {
          console.log("item", item.url, url);
          if (item.url === url) {
            newArray.push({ ...item, ...newField });
          } else if (item.children && item.children.length > 0) {
            newArray.push({
              ...item,
              children: modifyTreeNodeByUrl(url, item.children, newField),
            });
          } else {
            newArray.push(item);
          }
        }
        return newArray;
      };
      this.items = modifyTreeNodeByUrl(event.url, this.items, { children });
      console.log("this.items", this.items);
    },
  },
};
</script>
