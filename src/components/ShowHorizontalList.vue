<template>
  <div class="horizontal-list">
    <ShowCard v-for="show in shows" :key="show.id" :show="show" />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import ShowCard from "./ShowCard.vue";
import type { Show } from "../types/tv-show";
import "./ShowHorizontalList.css";

defineProps<{ shows: Show[] }>();
</script>
