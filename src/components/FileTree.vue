<template>
  <v-sheet rounded elevation="1" width="300" class="mx-4">
    <v-treeview
      v-model="tree"
      :open="initiallyOpen"
      :items="items"
      activatable
      item-key="name"
      open-on-click
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
  </v-sheet>
</template>
<script>
export default {
  data: () => ({
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
    items: [
      {
        name: "Lista de Filmes",
      },
      {
        name: "Atas",
      },
      {
        name: "Estudos",
        children: [
          {
            name: "Comunalismo",
            children: [
              {
                name: "Reuniões",
                children: [{ name: "Setembro", file: "md" }],
              },
            ],
          },
          {
            name: "Livro Bookchin.epub",
            file: "txt",
          },
          {
            name: "Lista de estudos",
            file: "txt",
          },
        ],
      },
      {
        name: ".tretas",
        file: "txt",
      },
      {
        name: "snippet.js",
        file: "js",
      },

      {
        name: "Inicio.md",
        file: "md",
      },
    ],
  }),
};
</script>
