import { createRouter, createWebHistory } from "vue-router";
import CollaborationGraph from "@/components/CollaborationGraph.vue";
import TextCloud from "@/components/TextCloud.vue";
import InfluenceChart from "@/components/InfluenceChart.vue";
import TrendChart from "@/components/TrendChart.vue";
import GeoGraph from "@/components/GeoGraph.vue";
import { geoOrthographic } from "d3";

{
  /* <RouterLink to="/">CollaborationGraph</RouterLink>
<RouterLink to="/TextCloud">TextCloud</RouterLink>
<RouterLink to="/InfluenceChart">InfluenceChart</RouterLink>
<RouterLink to="/TrendChart">TrendChart</RouterLink> */
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: TextCloud,
    },
    {
      path: "/CollaborationGraph",
      name: "CollaborationGraph",
      component: CollaborationGraph,
    },
    {
      path: "/TextCloud",
      name: "TextCloud",
      component: TextCloud,
    },
    {
      path: "/InfluenceChart",
      name: "InfluenceChart",
      component: InfluenceChart,
    },
    {
      path: "/TrendChart",
      name: "TrendChart",
      component: TrendChart,
    },
    {
      path: "/GeoGraph",
      name: "GeoGraph",
      component: GeoGraph,
    }
  ],
});

export default router;
