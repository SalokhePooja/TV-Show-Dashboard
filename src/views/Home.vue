<template>
  <div class="container">
    <SearchBar @search="onSearch" />

    <div v-if="loading" class="center">Loading...</div>
    <div v-else>
      <div v-if="searchResults">
        <h2>Search Results</h2>
        <template v-if="Object.keys(searchResultsByGenre).length > 0">
          <div v-for="genre in searchGenres" :key="genre" class="genre-section">
            <h3>{{ genre }}</h3>
            <ShowHorizontalList :shows="searchResultsByGenre[genre]" />
          </div>
        </template>
        <template v-else>
          <div class="no-search-found">No search found.</div>
        </template>
      </div>
      <div v-else>
        <div v-for="genre in genres" :key="genre" class="genre-section">
          <h2>{{ genre }}</h2>
          <ShowHorizontalList :shows="showsByGenre[genre]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { fetchAllShows, searchShows } from "../services/tvMazeService";
import ShowHorizontalList from "../components/ShowHorizontalList.vue";
import SearchBar from "../components/SearchBar.vue";
import type { Show } from "../types/tv-show";
import "./Home.css";

const shows = ref<Show[]>([]);
const loading = ref(true);
const searchResults = ref<Show[] | null>(null);
const genres = ref<string[]>([]);

const showsByGenre = computed(() => {
  const grouped: Record<string, Show[]> = {};
  for (const show of shows.value) {
    for (const genre of show.genres) {
      if (!grouped[genre]) grouped[genre] = [];
      grouped[genre].push(show);
    }
  }
  // Sort by rating
  for (const genre in grouped) {
    grouped[genre].sort(
      (a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0),
    );
  }
  return grouped;
});

// Group search results by genre
const searchResultsByGenre = computed(() => {
  if (!searchResults.value) return {};
  const grouped: Record<string, Show[]> = {};
  for (const show of searchResults.value) {
    for (const genre of show.genres) {
      if (!grouped[genre]) grouped[genre] = [];
      grouped[genre].push(show);
    }
  }
  // Sort by rating
  for (const genre in grouped) {
    grouped[genre].sort(
      (a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0),
    );
  }
  return grouped;
});

// List of genres present in search results
const searchGenres = computed(() =>
  Object.keys(searchResultsByGenre.value).sort(),
);

onMounted(async () => {
  loading.value = true;
  shows.value = await fetchAllShows();
  // Collect genres
  const allGenres = new Set<string>();
  shows.value.forEach((show) => {
    if (Array.isArray(show.genres)) {
      show.genres.forEach((g) => allGenres.add(g));
    }
  });
  genres.value = Array.from(allGenres).sort();

  loading.value = false;
});

async function onSearch(query: string) {
  if (!query) {
    searchResults.value = null;
    return;
  }
  loading.value = true;
  searchResults.value = await searchShows(query);
  loading.value = false;
}
</script>
