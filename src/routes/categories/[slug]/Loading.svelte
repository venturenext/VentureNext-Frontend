<section class="container-w py-8 animate-pulse">
  <div class="h-4 w-48 bg-gray-200 rounded"></div>
  <div class="mt-2 h-24 bg-white rounded-xl shadow-card"></div>

  <div class="mt-6 h-10 bg-white rounded-full shadow-card"></div>

  <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each Array(6) as _}
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="aspect-[16/9] bg-gray-200"></div>
        <div class="p-4 space-y-2">
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    {/each}
  </div>
</section>

