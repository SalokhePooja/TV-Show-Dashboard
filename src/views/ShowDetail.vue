<template>
  <div class="container">
    <button class="back" @click="goBack">← Back</button>

    <div v-if="loading" class="center">Loading...</div>

    <div v-else-if="error" class="center">
      <div class="no-episodes">No result found for this show.</div>
    </div>

    <div v-else-if="show" class="show-detail">
      <img
        :src="show.image?.medium || noImage"
        :alt="show.name"
        class="poster"
      />
      <div class="detail-info">
        <h1>{{ show.name }}</h1>
        <div class="genres" v-if="show.genres && show.genres.length">
          {{ show.genres.join(", ") }}
        </div>
        <div class="rating" v-if="show.rating && show.rating.average">
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
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchShowById, fetchEpisodes } from "../services/tvMazeService";
import type { EpisodeWithImage, Show } from "../types/tv-show";
import noImage from "../assets/placeholder.svg";
import "./ShowDetail.css";

const route = useRoute();
const router = useRouter();

const show = ref<Show | null>(null);
const episodes = ref<EpisodeWithImage[]>([]);
const loading = ref(true);
const error = ref(false);

function goBack() {
  router.push("/");
}

onMounted(async () => {
  const id = Number(route.params.id);
  try {
    // If id is not a valid number, the API will fail
    if (isNaN(id)) {
      error.value = true;
      return;
    }
    const fetchedShow = await fetchShowById(id);
    if (!fetchedShow) {
      error.value = true;
      return;
    }
    show.value = fetchedShow;
    episodes.value = (await fetchEpisodes(id)) as EpisodeWithImage[];
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
