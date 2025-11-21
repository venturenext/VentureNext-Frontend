<script>
  import StatWidget from '$lib/components/admin/StatWidget.svelte';
  import LineChart from '$lib/components/admin/LineChart.svelte';
  import { onMount } from 'svelte';

  export let data;
  const s = data?.stats || {};

  let selectedMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  let perkChartData = [];
  let leadsChartData = [];
  let loading = false;

  async function fetchChartData() {
    loading = true;
    try {
      const response = await fetch(`/admin/api/chart-data?month=${selectedMonth}`);

      if (response.ok) {
        const result = await response.json();
        perkChartData = result.perks || [];
        leadsChartData = result.leads || [];
      } else {
        console.error('Failed to fetch chart data:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchChartData();
  });

  $: if (selectedMonth) {
    fetchChartData();
  }
</script>

<!-- Stat row -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
  <StatWidget label="Total Perks" value={s.total_perks || 0} />
  <StatWidget label="Active Perks" value={s.active_perks || 0} />
  <StatWidget label="Total Leads" value={s.total_leads || 0} />
  <StatWidget label="This Week" value={s.recent_leads || 0} sublabel="Leads" />
</div>

<!-- Month Filter -->
<div class="mt-6 flex justify-end">
  <div class="flex items-center gap-2">
    <label for="month-filter" class="text-sm font-medium text-gray-700">Filter by Month:</label>
    <input
      type="month"
      id="month-filter"
      bind:value={selectedMonth}
      class="border border-admin-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
    />
  </div>
</div>

<!-- Charts Section -->
<div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
  <!-- Perks Chart -->
  <div class="bg-white rounded-2xl shadow-card border border-admin-border p-5">
    {#if loading}
      <div class="h-[300px] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    {:else}
      <LineChart
        data={perkChartData}
        title="Perks Created"
        height={300}
        color="#3b82f6"
      />
    {/if}
  </div>

  <!-- Leads Chart -->
  <div class="bg-white rounded-2xl shadow-card border border-admin-border p-5">
    {#if loading}
      <div class="h-[300px] flex items-center justify-center text-gray-500">
        Loading...
      </div>
    {:else}
      <LineChart
        data={leadsChartData}
        title="Leads Submitted"
        height={300}
        color="#10b981"
      />
    {/if}
  </div>
</div>
