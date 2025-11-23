<script lang="ts">
  import { onMount } from 'svelte';

  interface TopPerk {
    perk_id: number;
    title: string;
    impressions: number;
    clicks: number;
    form_submissions: number;
    affiliate_clicks: number;
    ctr: number;
    form_conversion_rate: number;
    affiliate_conversion_rate: number;
  }

  interface AnalyticsStats {
    overall: {
      impressions: number;
      clicks: number;
      form_submissions: number;
      affiliate_clicks: number;
      ctr: number;
      form_conversion_rate: number;
      affiliate_conversion_rate: number;
    };
    top_perks: TopPerk[];
    daily_trends: any[];
  }

  let loading = true;
  let error = '';
  let dateRange = '30';
  let stats: AnalyticsStats = {
    overall: {
      impressions: 0,
      clicks: 0,
      form_submissions: 0,
      affiliate_clicks: 0,
      ctr: 0,
      form_conversion_rate: 0,
      affiliate_conversion_rate: 0,
    },
    top_perks: [],
    daily_trends: []
  };

  async function fetchStats() {
    loading = true;
    error = '';
    try {
      const response = await fetch(`/admin/api/analytics/dashboard?range=${dateRange}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      stats = await response.json();
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    fetchStats();
  });

  function handleRangeChange() {
    fetchStats();
  }
</script>

<div class="space-y-6">
  <!-- Header with Date Range Filter -->
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
    <div class="flex items-center gap-2">
      <label for="date-range" class="text-sm text-gray-600">Date Range:</label>
      <select
        id="date-range"
        bind:value={dateRange}
        on:change={handleRangeChange}
        class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
      >
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
        <option value="365">Last year</option>
      </select>
    </div>
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      {error}
    </div>
  {:else}
    <!-- Overall Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Impressions -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Impressions</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{stats.overall.impressions.toLocaleString()}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Clicks -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Clicks</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{stats.overall.clicks.toLocaleString()}</p>
            <p class="text-xs text-green-600 mt-1">CTR: {stats.overall.ctr}%</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Form Submissions -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Form Submissions</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{stats.overall.form_submissions.toLocaleString()}</p>
            <p class="text-xs text-purple-600 mt-1">Conv: {stats.overall.form_conversion_rate}%</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Affiliate Clicks -->
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Affiliate Clicks</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{stats.overall.affiliate_clicks.toLocaleString()}</p>
            <p class="text-xs text-orange-600 mt-1">Conv: {stats.overall.affiliate_conversion_rate}%</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Performing Perks -->
    {#if stats.top_perks.length > 0}
      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Top 10 Performing Perks</h3>
          <span class="text-sm text-gray-500">{stats.top_perks.length} perks</span>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perk</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Subs</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliate</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each stats.top_perks as perk}
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{perk.title}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{perk.impressions.toLocaleString()}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{perk.clicks.toLocaleString()}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{perk.ctr}%</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {perk.form_submissions.toLocaleString()}
                    <span class="text-xs text-gray-400">({perk.form_conversion_rate}%)</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {perk.affiliate_clicks.toLocaleString()}
                    <span class="text-xs text-gray-400">({perk.affiliate_conversion_rate}%)</span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {:else}
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p class="text-gray-500">No analytics data available yet. Start tracking impressions and clicks to see performance metrics.</p>
      </div>
    {/if}
  {/if}
</div>
