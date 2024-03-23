<script setup lang="ts">
import { embedDashboard } from "@superset-ui/embedded-sdk"

const iframeRef = ref<HTMLDivElement | null>(null);
const { supersetUrl } = useRuntimeConfig().public;
const dashboardId = ref('f78a2eb9-7b71-47d2-b58d-35195130a3fa')
const userId = ref('')

async function fetchGuestTokenFromBackend() {
  const { data } = await useFetch('/api/guestToken', {
    query: {dashboardId: dashboardId.value}
  })
  return data._rawValue.guestToken
}
function resetEmbeddedDashboard() {
  if (iframeRef.value === null) return;
  iframeRef.value.innerHTML = '';
  embedDashboard({
    id: dashboardId.value,
    supersetDomain: supersetUrl,
    mountPoint: iframeRef.value,
    fetchGuestToken: fetchGuestTokenFromBackend,
    dashboardUiConfig: {
      hideTitle: true,
      hideChartControls: true,
      hideTab: true,
      filters: {
        visible: false,
        expanded: false,
      },
      urlParams: {
        user_id: userId.value, // 'b4088789-37e3-4839-9952-2e0dd1bb97fb',
      }
    },
  });
}

onMounted(() => {
  resetEmbeddedDashboard()
});
</script>

<template>
  <h2>Superset dashboard embedded inside VueJs app</h2>
  <UInput v-model="dashboardId" />
  <UInput v-model="userId"  @change="resetEmbeddedDashboard()"/>
  <div ref="iframeRef"></div>
</template>

<style module>
  h2 {
    font-size: 20px;
    margin: 15px 0;
  }
  iframe {
    width: 100%;
    height: calc(100vh - 60px);
  }
</style>