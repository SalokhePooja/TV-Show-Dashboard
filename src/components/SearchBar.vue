<template>
  <form @submit.prevent="submit" class="search-bar">
    <input v-model="query" type="text" placeholder="Search TV shows..." />
    <button type="submit">Search</button>
    <button v-if="query" type="button" @click="clear">Clear</button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import "./SearchBar.css";

const emit = defineEmits(["search"]);
const query = ref("");

function submit() {
  emit("search", query.value.trim());
}
function clear() {
  query.value = "";
  emit("search", "");
}
</script>
