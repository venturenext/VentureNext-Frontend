<script lang="ts">
  export let data: { label: string; value: number }[] = [];
  export let title: string = 'Chart';
  export let height: number = 300;
  export let color: string = '#3b82f6';

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 800;

  $: chartHeight = height - padding.top - padding.bottom;
  $: chartWidth = width - padding.left - padding.right;

 
  $: maxValue = Math.max(...data.map(d => d.value), 0);
  $: minValue = Math.min(...data.map(d => d.value), 0);
  $: valueRange = maxValue - minValue || 1;

 
  $: points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * chartWidth;
    const y = chartHeight - ((d.value - minValue) / valueRange) * chartHeight;
    return { x, y, value: d.value, label: d.label };
  }).filter(p => !isNaN(p.x) && !isNaN(p.y));


  $: linePath = points.length > 0
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x + padding.left} ${p.y + padding.top}`).join(' ')
    : '';

  
  $: areaPath = points.length > 0
    ? linePath + ` L ${points[points.length - 1].x + padding.left} ${chartHeight + padding.top} L ${padding.left} ${chartHeight + padding.top} Z`
    : '';

 
  $: yTicks = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
    value: Math.round(minValue + valueRange * ratio),
    y: chartHeight - (ratio * chartHeight) + padding.top
  }));
</script>

<div class="line-chart-container">
  <div class="mb-3">
    <h3 class="font-semibold text-brand-richBlack">{title}</h3>
  </div>

  <svg viewBox="0 0 {width} {height}" class="w-full" style="max-height: {height}px;">

    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:{color};stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:{color};stop-opacity:0.05" />
      </linearGradient>
    </defs>

    
    <line
      x1={padding.left}
      y1={padding.top}
      x2={padding.left}
      y2={chartHeight + padding.top}
      stroke="#e5e7eb"
      stroke-width="1"
    />

    
    <line
      x1={padding.left}
      y1={chartHeight + padding.top}
      x2={chartWidth + padding.left}
      y2={chartHeight + padding.top}
      stroke="#e5e7eb"
      stroke-width="1"
    />

  
    {#each yTicks as tick}
      <line
        x1={padding.left - 5}
        y1={tick.y}
        x2={chartWidth + padding.left}
        y2={tick.y}
        stroke="#f3f4f6"
        stroke-width="1"
        stroke-dasharray="2,2"
      />
      <text
        x={padding.left - 10}
        y={tick.y}
        text-anchor="end"
        dominant-baseline="middle"
        class="text-xs fill-gray-600"
      >
        {tick.value}
      </text>
    {/each}


    {#if areaPath}
      <path
        d={areaPath}
        fill="url(#lineGradient)"
      />
    {/if}

   
    {#if linePath}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    {/if}

    {#each points as point}
      <circle
        cx={point.x + padding.left}
        cy={point.y + padding.top}
        r="4"
        fill="white"
        stroke={color}
        stroke-width="2"
      />
    {/each}


    {#each points as point, i}
      <text
        x={point.x + padding.left}
        y={chartHeight + padding.top + 20}
        text-anchor="middle"
        class="text-xs fill-gray-600"
      >
        {point.label}
      </text>
    {/each}
  </svg>

  {#if data.length === 0}
    <div class="text-center py-8 text-gray-500 text-sm">
      No data available
    </div>
  {/if}
</div>

<style>
  .line-chart-container {
    background: white;
    border-radius: 0.75rem;
  }
</style>
