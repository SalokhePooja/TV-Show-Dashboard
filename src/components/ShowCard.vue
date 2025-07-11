<template>
  <router-link :to="`/show/${show.id}`" class="card">
    <img :src="show.image?.medium || noImage" :alt="show.name" />
    <div class="info">
      <div class="title" :title="show.name">{{ show.name }}</div>
      <div class="rating" v-if="show.rating.average">
        ⭐ {{ show.rating.average ?? "" }}
      </div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import type { Show } from "../types/tv-show";
import noImage from "../assets/placeholder.svg";
import "./ShowCard.css";

defineProps<{ show: Show }>();
</script>
