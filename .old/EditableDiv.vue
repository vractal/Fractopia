<template>
  <div class="editable-div grab m-1">
  <!--  {{ label }} -->
    <input type="text"
           v-if="edit"
           :value="valueLocal"
           :placeholder="placeholder"
           @blur="valueLocal = $event.target.value; edit = false; $emit('input', valueLocal);"
           @keyup.enter="valueLocal = $event.target.value; edit = false; $emit('input', valueLocal);"
           v-focus=""
             />
        <span class="valueLocal p-1" variant="info" v-else="" @click="edit = true;">
          <span v-if="valueLocal"><b>{{valueLocal}}</b></span>
          <span v-else>{{placeholder}}</span>
        </span>
    </div>
</template>

<script>
  export default {
name: 'EditableDiv',
  props: ['value', 'placeholder'],

  data () {
  return {
      edit: false,
      valueLocal: this.value
    }
  },

  watch: {
    value: function() {
      this.valueLocal = this.value;
    }
  },

  directives: {
    focus: {
      inserted (el) {
        el.focus()
      }
    }
  }

}
</script>
<style>

</style>
