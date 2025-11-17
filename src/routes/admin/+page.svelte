<script>
  import StatWidget from '$lib/components/admin/StatWidget.svelte';
  import ActivityFeed from '$lib/components/admin/ActivityFeed.svelte';
  export let data;
  const s = data?.stats || {};
</script>

<!-- Stat row -->
<div class="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
  <StatWidget label="Total Perks" value={s.total_perks || 0} />
  <StatWidget label="Active Perks" value={s.active_perks || 0} />
  <StatWidget label="Total Leads" value={s.total_leads || 0} />
  <StatWidget label="This Week" value={s.recent_leads || 0} sublabel="Leads" />
  </div>

<!-- Main content split with right panel -->
<div class="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
  <!-- Big analytics card -->
  <div class="xl:col-span-2">
    <div class="bg-white rounded-2xl shadow-card border border-admin-border">
      <div class="p-4 md:p-5 border-b border-admin-border flex items-center justify-between">
        <div class="font-semibold text-brand-richBlack">Employee Monitoring</div>
        <div>
          <select class="text-sm border border-admin-border rounded-lg px-2 py-1">
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
      </div>
      <div class="p-4 md:p-5">
        <div class="flex items-center gap-2 text-xs">
          <button class="px-3 py-1 rounded-full bg-admin-blue text-white">Wellness</button>
          <button class="px-3 py-1 rounded-full border border-admin-border">Active Rate</button>
          <button class="px-3 py-1 rounded-full border border-admin-border">Steps</button>
        </div>
        <div class="mt-4 h-64 rounded-xl bg-admin-sidebar border border-admin-border grid place-items-center text-admin-muted">
          Charts placeholder
        </div>
        <div class="mt-4 text-xs text-admin-muted flex flex-wrap gap-4">
          <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-blue-500"></span>Very Often</span>
          <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-green-500"></span>Often</span>
          <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-yellow-500"></span>Sometimes</span>
          <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-orange-500"></span>Rarely</span>
          <span class="inline-flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-red-500"></span>Never</span>
        </div>
      </div>
    </div>

    <!-- Table card below -->
    <div class="mt-6 bg-white rounded-2xl shadow-card border border-admin-border">
      <div class="p-4 md:p-5 border-b border-admin-border flex items-center justify-between">
        <div class="font-semibold text-brand-richBlack">Doctor List</div>
        <div class="text-sm text-admin-muted">placeholder</div>
      </div>
      <div class="p-4 md:p-5 overflow-x-auto text-sm">
        <table class="min-w-full">
          <thead class="bg-admin-sidebar">
            <tr>
              <th class="text-left px-3 py-2">Name</th>
              <th class="text-left px-3 py-2">Role</th>
              <th class="text-left px-3 py-2">Booked</th>
              <th class="text-left px-3 py-2">Appointments</th>
              <th class="text-right px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-admin-border">
              <td class="px-3 py-2">Dr. Example</td>
              <td class="px-3 py-2">General Practitioner</td>
              <td class="px-3 py-2">3</td>
              <td class="px-3 py-2">5</td>
              <td class="px-3 py-2 text-right"><button class="px-3 py-1 rounded-lg border border-admin-border">View</button></td>
            </tr>
            <tr class="border-t border-admin-border">
              <td class="px-3 py-2">Dr. Sample</td>
              <td class="px-3 py-2">Specialist</td>
              <td class="px-3 py-2">1</td>
              <td class="px-3 py-2">2</td>
              <td class="px-3 py-2 text-right"><button class="px-3 py-1 rounded-lg border border-admin-border">View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Right sidebar cards -->
  <div class="space-y-6">
    <div class="bg-white rounded-2xl shadow-card border border-admin-border p-5">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-admin-sidebar grid place-items-center text-sm font-semibold text-brand-richBlack">A</div>
        <div>
          <div class="font-medium text-brand-richBlack">Medical Consultation Division</div>
          <div class="text-xs text-admin-muted">Overview</div>
        </div>
      </div>
      <div class="mt-4 h-40 rounded-lg bg-admin-sidebar border border-admin-border grid place-items-center text-xs text-admin-muted">Chart</div>
    </div>

    <div class="bg-white rounded-2xl shadow-card border border-admin-border p-5">
      <div class="font-semibold text-brand-richBlack mb-3">Top Participants</div>
      <ul class="space-y-2 text-sm">
        <li class="flex items-center justify-between"><span>Beatrice Yewell</span><span class="text-admin-muted">92%</span></li>
        <li class="flex items-center justify-between"><span>Chuks Emeka</span><span class="text-admin-muted">88%</span></li>
        <li class="flex items-center justify-between"><span>Bridger Giacoppe</span><span class="text-admin-muted">84%</span></li>
        <li class="flex items-center justify-between"><span>Michael Street</span><span class="text-admin-muted">79%</span></li>
      </ul>
    </div>

    <ActivityFeed items={data?.recent_leads || []} />
  </div>
</div>
