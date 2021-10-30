import Vue from "vue";
import App from "../App.vue";
// import createTodoListPlugin from "@kangc/v-md-editor/lib/plugins/todo-list/index";
import "@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css";
import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
// import VueMarkdownEditor from "@kangc/v-md-editor/lib/codemirror-editor";
// import "@kangc/v-md-editor/lib/style/codemirror-editor.css";
// import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
// import "@kangc/v-md-editor/lib/theme/style/vuepress.css";

import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";

// highlightjs
import hljs from "highlight.js";

// Resources for the codemirror editor
// import Codemirror from "codemirror";
// // mode
// import "codemirror/mode/markdown/markdown";
// import "codemirror/mode/javascript/javascript";
// import "codemirror/mode/css/css";
// import "codemirror/mode/htmlmixed/htmlmixed";
// import "codemirror/mode/vue/vue";
// // edit
// import "codemirror/addon/edit/closebrackets";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/matchbrackets";
// // placeholder
// import "codemirror/addon/display/placeholder";
// // active-line
// import "codemirror/addon/selection/active-line";
// // scrollbar
// import "codemirror/addon/scroll/simplescrollbars";
// import "codemirror/addon/scroll/simplescrollbars.css";
// // style
// import "codemirror/lib/codemirror.css";
import enUS from "@kangc/v-md-editor/lib/lang/en-US";

// VueMarkdownEditor.Codemirror = Codemirror;

VueMarkdownEditor.use(githubTheme, {
  Hljs: hljs,
});
VueMarkdownEditor.lang.use("en-US", enUS);

// VueMarkdownEditor.use(createTodoListPlugin());

Vue.use(VueMarkdownEditor);
export default App;
