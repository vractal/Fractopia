<template>
  <div id="app">
    <h1>Teste</h1>
    <SolidLogin />
    <solid-track-session />

  </div>
</template>

<script>
import SolidLogin from '@/components/SolidLogin'
import SolidTrackSession from '@/components/SolidTrackSession'


export default {
  name: 'App',
  components: {
    SolidLogin,
    SolidTrackSession
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
