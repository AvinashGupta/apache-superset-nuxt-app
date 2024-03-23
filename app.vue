<script setup lang="ts">
import { embedDashboard } from "@superset-ui/embedded-sdk"

const DASHBOARD_ID = "f78a2eb9-7b71-47d2-b58d-35195130a3fa";
const iframeRef = ref<HTMLDivElement | null>(null);
const { supersetUrl } = useRuntimeConfig().public;

async function fetchGuestTokenFromBackend() {
  const { data } = await useFetch('/api/guestToken?asd=123', {
    query: {dashboardId: DASHBOARD_ID}
  })
  return data._rawValue.guestToken
}

onMounted(() => {
  if (iframeRef.value === null) return;

  embedDashboard({
    id: DASHBOARD_ID,
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
        foo: 'value1',
        bar: 'value2',
      }
    },
  });
});
</script>

<template>
  <h2>Superset dashboard embedded inside VueJs app</h2>
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