<template>
  <v-sheet
    id="2"
    rounded
    elevation="1"
    width="400"
    max-height="500"
    class="mx-4 px-4 pa-2"
  >
    <div class="d-flex flex-row justify-space-between">
      <v-icon @click="fetchInitial">mdi-refresh</v-icon>
      <div>
        <v-icon class="mx-6" big @click="openCreateFolderDialog"
          >mdi-folder-plus</v-icon
        >

        <v-icon big @click="createNote">mdi-text-box-plus</v-icon>
      </div>
    </div>
    <v-divider />
    <v-treeview
      class="left-scrollbar overflow-auto"
      v-model="tree"
      :open="openFolders"
      :items="items"
      activatable
      item-key="url"
      :load-children="load"
      :active.sync="active"
      return-object
      @update:open="onOpenFolderChange"
    >
      <template v-slot:prepend="{ item, open }">
        <v-icon v-if="!item.file">
          {{ open ? "mdi-folder-open" : "mdi-folder" }}
        </v-icon>
        <v-icon v-else @click="() => removeFolder(item.url)">
          {{ files[item.file] }}
        </v-icon>
      </template>
      <template v-slot:append="{ item }">
        <v-icon @click="() => removeFolder(item.url)" v-if="item.file">
          mdi-delete
        </v-icon>
        <v-icon v-else>
          {{ files[item.file] }}
        </v-icon>
      </template>
    </v-treeview>

    <GenericDialog
      @click="createFolder"
      @cancel="showCreateFolderDialog = false"
      v-if="showCreateFolderDialog"
      label="Create Folder"
    >
      <v-text-field v-model="folderNameInput" placeholder="Type folder name" />
    </GenericDialog>
  </v-sheet>
</template>
<script>
// import { fetch } from "@inrupt/solid-client-authn-browser";
//
import HiperFolder from "@/models/HiperFolder";
import GenericDialog from "@/components/GenericDialog";

import { rdf, schema } from "rdf-namespaces";
import { parseFolderItemType } from "@/utils/utils";
import { debounce } from "lodash";
export default {
  created() {
    this.fetchInitial(this.indexUrl);
  },
  components: {
    GenericDialog,
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
    showCreateFolderDialog: false,
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
    folderToReload(newValue) {
      console.log("folderTo", newValue);
      if (newValue?.includes("http")) {
        debounce(() => this.load({ url: newValue }), 200);
      }
      return;
    },
  },
  computed: {
    activeFileUrl() {
      return this.$store.state.notes.activeNote?.url;
    },
    activeFile() {
      return this.$store.state.notes.activeNote;
    },
    folderToReload() {
      return this.$store.state.hiperfolder.folderToReload;
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
      this.items = await this.parseFileTree(this.indexUrl, 0, 3);
    },

    async load(event) {
      var children = await this.parseFileTree(event.url, 0, 3);

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
      this.$store.dispatch("notes/createNote");
    },
    async removeFolder(url) {
      // create new subfolder in desired location
      console.log("removeurl", url);
      this.$store
        .dispatch("hiperfolder/removeFolder", url)
        .then(() => this.fetchInitial());
    },
    openCreateFolderDialog() {
      this.showCreateFolderDialog = true;
    },

    async createFolder() {
      // create new subfolder in desired location
      this.$store
        .dispatch("hiperfolder/createFolder", {
          folderName: this.folderNameInput,
          parentUrl: this.selectedFolder || this.indexUrl,
        })
        .then(() => this.load({ url: this.selectedFolder }));

      // cleans text field
      this.folderNameInput = "";
      this.showCreateFolderDialog = false;
    },
  },
};
</script>
<style >
.left-scrollbar {
  direction: ltr !important;
}
</style>