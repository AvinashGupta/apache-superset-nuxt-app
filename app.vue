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
        user_id: userId.value,
      }
    },
  });
}

onMounted(() => {
  resetEmbeddedDashboard()
});
</script>

<template>
  <div class="p-3">
    <h2 class="mt-2 mb-2">Superset dashboard embedded inside VueJs app</h2>
    <div class="grid grid-cols-4 gap-4 mb-3">
      <div>
        <UInput v-model="dashboardId" placeholder="dashboard id"/>
      </div>
      <UInput v-model="userId" placeholder="user id"/>
      <div>
        <UButton @click="resetEmbeddedDashboard()">Update Dashboard</UButton>
      </div>
    </div>
  </div>
  <div ref="iframeRef"></div>
</template>

<style module>
  h2 {
    font-size: 20px;
  }
  iframe {
    width: 100%;
    height: calc(100vh - 60px);
  }
</style>