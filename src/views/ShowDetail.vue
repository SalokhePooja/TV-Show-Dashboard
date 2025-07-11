<template>
  <div class="container" v-if="show">
    <button class="back" @click="$router.back()">← Back</button>
    <div class="show-detail">
      <img
        :src="show.image?.original || noImage"
        :alt="show.name"
        class="poster"
      />
      <div class="detail-info">
        <h1>{{ show.name }}</h1>
        <div class="genres">{{ show.genres.join(", ") }}</div>
        <div class="rating" v-if="show.rating.average">
          ⭐ {{ show.rating.average ?? "" }}
        </div>
        <div class="summary" v-html="show.summary"></div>
        <h3>Episodes</h3>
        <div v-if="episodes.length > 0" class="episodes-horizontal-list">
          <div v-for="ep in episodes" :key="ep.id" class="episode-card">
            <img :src="ep.image?.medium || noImage" :alt="ep.name" />
            <div class="ep-name" :title="ep.name">{{ ep.name }}</div>
          </div>
        </div>
        <div v-else>
          <div class="no-episodes">No episodes found.</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="center">Loading...</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { fetchShowById, fetchEpisodes } from "../services/tvMazeService";
import type { EpisodeWithImage, Show } from "../types/tv-show";
import noImage from "../assets/placeholder.svg";
import "./ShowDetail.css";

const route = useRoute();
const show = ref<Show | null>(null);
const episodes = ref<EpisodeWithImage[]>([]);

onMounted(async () => {
  const id = Number(route.params.id);
  show.value = await fetchShowById(id);
  // The episode API returns image if available
  episodes.value = (await fetchEpisodes(id)) as EpisodeWithImage[];
});
</script>
