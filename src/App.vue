<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <nav class="RouterLink-container">
    <RouterLink to="/CollaborationGraph">CollaborationGraph</RouterLink>
    <RouterLink to="/TextCloud">TextCloud</RouterLink>
    <RouterLink to="/InfluenceChart">InfluenceChart</RouterLink>
    <RouterLink to="/TrendChart">TrendChart</RouterLink>
  </nav>
  <div class="RouterView-container">
    <RouterView class="RouterView-content" />
  </div>
</template>

