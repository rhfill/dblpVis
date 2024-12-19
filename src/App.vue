<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <nav class="RouterLink-container">
    <RouterLink to="/">Home</RouterLink>
    <!-- <RouterLink to="/about">About</RouterLink> -->
  </nav>
  <div class="RouterView-container">
    <RouterView class="RouterView-content" />
  </div>
</template>

