<template>
  <v-sheet id="2" rounded elevation="1" width="300" class="mx-4">
    <v-treeview
      v-model="tree"
      :open="openFolders"
      :items="items"
      activatable
      item-key="url"
      :load-children="load"
      :active.sync="active"
      return-object
      rounded
      @update:open="onOpenFolderChange"
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
    <v-btn small @click="createFolder"><v-icon>mdi-folder-plus</v-icon></v-btn>
    <v-btn small @click="createNote"><v-icon>mdi-text-box-plus</v-icon></v-btn>

    <v-text-field v-model="folderNameInput" placeholder="Type folder name" />
  </v-sheet>
</template>
<script>
// import { fetch } from "@inrupt/solid-client-authn-browser";
//
import HiperFolder from "@/models/HiperFolder";

import { rdf, schema } from "rdf-namespaces";
import { parseFolderItemType } from "@/utils/utils";
export default {
  created() {
    this.fetchInitial(this.indexUrl);
  },
  data: () => ({
    active: [],
    openFolders: [],
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
    folderNameInput: "",
    typeFilter: schema.NoteDigitalDocument,
  }),
  watch: {
    active(newValue) {
      if (newValue.length > 0 && newValue[0].url !== this.activeFile?.url) {
        if (!this.typeFilter || newValue[0].type == this.typeFilter) {
          this.$store.dispatch("notes/getNote", newValue[0].url);
        } else {
          if (!newValue[0]?.type) {
            let selectedFolder = newValue[0].url;
            this.$store.dispatch(
              "hiperfolder/changeSelectedFolder",
              selectedFolder
            );
          }
        }
      } else {
        // this.$store.dispatch("hiperfolder/changeSelectedFolder", null);
      }
    },
    openFolders() {
      // console.log("watchHiperlist", newValue, this.openFolders);
    },
    indexUrl() {
      this.fetchInitial();
    },
    activeFileUrl(newUrl) {
      // receives note
      if (!this.activeFile || !this.activeFile.url) {
        this.active = [];
        return;
      }

      if (newUrl !== this.active[0]?.url) {
        this.active = [
          {
            name: this.activeFile.name,
            type: this.activeFile.class,
            url: this.activeFile.url,
            children: [],
          },
        ];
      }
    },
  },
  computed: {
    activeFileUrl() {
      return this.$store.state.notes.activeNote?.url;
    },
    activeFile() {
      return this.$store.state.notes.activeNote;
    },
    indexUrl() {
      return this.$store.state.hiperfolder.activeFolder;
    },
    selectedFolder() {
      return this.$store.state.hiperfolder.selectedFolder;
    },
  },
  methods: {
    async parseFileTree(path, level = 0, maxLevels) {
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

      if (folder.files && folder.files.length > 0) {
        for (const file of folder.files) {
          if (file.type === rdf.Bag) {
            let parsedSubFolder = {};

            if (isLastLevel) {
              parsedSubFolder = {
                name: file.name,
                children: [],
                unchecked: true,
                url: file.url,
              };
            } else {
              let subFolderChildren = await this.parseFileTree(
                file.url,
                level,
                maxLevels
              );
              subFolderChildren =
                subFolderChildren.length > 0
                  ? { children: subFolderChildren }
                  : {};
              parsedSubFolder = {
                name: file.name,
                url: file.url,
                ...subFolderChildren,
              };
            }
            files.push(parsedSubFolder);
          } else {
            files.push(parseFolderItemType(file));
          }
        }
      }
      return [...subFolders, ...files];
    },
    async get(url) {
      try {
        // const folder = await fc.readFolder(url);

        const folder = await HiperFolder.find(url);
        let children = folder.items.map((hiperItem) =>
          parseFolderItemType(hiperItem)
        );
        return { name: folder.name, files: children };
      } catch (e) {
        // console.warn(e);
        return {};
        // return {};
      }
    },

    async fetchInitial() {
      this.items = await this.parseFileTree(this.indexUrl, 0, 2);
    },

    async load(event) {
      var children = await this.parseFileTree(event.url, 0, 1);

      const modifyTreeNodeByUrl = (url, array, newField = {}) => {
        let newArray = [];
        for (const item of array) {
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
    },
    onOpenFolderChange(folders) {
      console.log("folders", folders);
    },
    createNote() {
      this.$store.dispatch("notes/createNote", this.selectedFolder);
    },

    async createFolder() {
      // create new subfolder in desired location
      this.$store.dispatch("hiperfolder/createFolder", {
        folderName: this.folderNameInput,
        parentUrl: this.selectedFolder || this.indexUrl,
      });

      // cleans text field
      this.folderNameInput = "";
    },
  },
};
</script>
