<template>
  <div class="hello">
    <h1 v-if="shw" v-on:click="counter += 1">{{ msg }} e também {{ counter }}</h1>
  </div>
</template>

<script>
export default {
  name: 'LightSwitch',
  props: {
    msg: String,
    shw: Boolean
  },
  data() {
    return {
      counter: 0
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>