<script lang="ts">
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import { SITE_NAME, CONTACT_EMAIL, HERO_IMAGE } from '$lib/config';
  const title = `Privacy Policy | ${SITE_NAME}`;
  const description = `Privacy Policy for ${SITE_NAME}`;
  const email = CONTACT_EMAIL || 'hello@example.com';
  const lastUpdated = new Date().toISOString().slice(0, 10);

  const sections = [
    { id: 'overview', t: 'Overview' },
    { id: 'data', t: 'Information We Collect' },
    { id: 'use', t: 'How We Use Information' },
    { id: 'cookies', t: 'Cookies & Analytics' },
    { id: 'sharing', t: 'Sharing' },
    { id: 'retention', t: 'Data Retention' },
    { id: 'security', t: 'Security' },
    { id: 'rights', t: 'Your Rights' },
    { id: 'children', t: 'Children’s Privacy' },
    { id: 'transfers', t: 'International Transfers' },
    { id: 'changes', t: 'Changes to this Policy' },
    { id: 'contact', t: 'Contact' }
  ];
  let currentId: string = sections[0].id;
</script>

<SEOHead {title} description={description} />

<!-- Hero -->
<section class="relative text-white overflow-hidden">
  <div class="absolute inset-0 bg-center bg-cover" style={`background-image:url('${HERO_IMAGE}')`} aria-hidden="true"></div>
  <div class="absolute inset-0 bg-brand-darkGreen/85"></div>
  <div class="relative container-w py-20">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 w-max">
      <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
      <span class="text-sm">Legal</span>
    </div>
    <h1 class="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
    <p class="mt-3 max-w-2xl text-white/85">Your privacy matters to us. This policy explains what we collect and how we use it.</p>
    <div class="mt-4 text-sm text-white/70">Last updated: {lastUpdated}</div>
  </div>
</section>


<section class="relative pt-12 md:pt-16">
  <div class="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-yellow-300/20 blur-3xl" aria-hidden="true"></div>
  <div class="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-pink-300/20 blur-3xl" aria-hidden="true"></div>

  <div class="relative container-w w-full">
     <div class="mx-auto max-w-5xl mt-8 md:mt-12 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 grid grid-cols-12">
      <!-- Left nav panel -->
      <aside class="col-span-4 bg-yellow-50 px-6 pt-8 pb-6">
        <ol class="space-y-3 text-sm">
          {#each sections as s, i}
            <li>
              <a href={`#${s.id}`} class="block rounded px-3 py-2 transition-colors hover:bg-white/60"
                on:click={() => (currentId = s.id)}
                class:text-brand-darkGreen={currentId === s.id}
                class:font-semibold={currentId === s.id}
                class:text-brand-slateGray={currentId !== s.id}>
                {i + 1}. {s.t}
              </a>
            </li>
          {/each}
        </ol>
      </aside>

      <div class="col-span-8 bg-brand-darkGreen text-white">
        <div class="px-8 md:px-10 pt-12 pb-10 max-h-[70vh] overflow-y-auto space-y-6">
          <h2 class="text-xl font-extrabold tracking-wide">Privacy Policy</h2>
          <section id="overview">
            <h3 class="text-lg font-semibold">1. Overview</h3>
            <p class="text-white/85 mt-1">This Privacy Policy describes how {SITE_NAME} collects, uses, and shares information when you use our website and services.</p>
          </section>
          <section id="data">
            <h3 class="text-lg font-semibold">2. Information We Collect</h3>
            <ul class="list-disc pl-5 text-white/85 mt-1 space-y-1">
              <li>Contact information you provide (e.g., name, email, company) when submitting forms.</li>
              <li>Usage data (pages viewed, clicks) to improve the Service.</li>
              <li>Technical data (IP address, browser) collected via analytics or logs.</li>
            </ul>
          </section>
          <section id="use">
            <h3 class="text-lg font-semibold">3. How We Use Information</h3>
            <ul class="list-disc pl-5 text-white/85 mt-1 space-y-1">
              <li>To provide and improve the Service and personalize content.</li>
              <li>To communicate with you and respond to inquiries or submissions.</li>
              <li>To analyze performance and prevent fraud or abuse.</li>
            </ul>
          </section>
          <section id="cookies">
            <h3 class="text-lg font-semibold">4. Cookies & Analytics</h3>
            <p class="text-white/85 mt-1">We may use cookies and similar technologies for essential functionality and analytics. You can control cookies through your browser settings.</p>
          </section>
          <section id="sharing">
            <h3 class="text-lg font-semibold">5. Sharing</h3>
            <p class="text-white/85 mt-1">We do not sell personal information. We may share limited data with service providers that help us operate the Service, under confidentiality obligations, and as required by law.</p>
          </section>
          <section id="retention">
            <h3 class="text-lg font-semibold">6. Data Retention</h3>
            <p class="text-white/85 mt-1">We retain information for as long as necessary to provide the Service and comply with legal obligations.</p>
          </section>
          <section id="security">
            <h3 class="text-lg font-semibold">7. Security</h3>
            <p class="text-white/85 mt-1">We implement reasonable safeguards to protect information. However, no method of transmission or storage is completely secure.</p>
          </section>
          <section id="rights">
            <h3 class="text-lg font-semibold">8. Your Rights</h3>
            <p class="text-white/85 mt-1">You may request access, correction, or deletion of your personal information subject to legal limitations. Contact us to exercise these rights.</p>
          </section>
          <section id="children">
            <h3 class="text-lg font-semibold">9. Children’s Privacy</h3>
            <p class="text-white/85 mt-1">Our Service is not directed to children under 13. We do not knowingly collect personal information from children.</p>
          </section>
          <section id="transfers">
            <h3 class="text-lg font-semibold">10. International Transfers</h3>
            <p class="text-white/85 mt-1">Information may be processed in countries other than your own. We take steps to ensure appropriate protections for such transfers.</p>
          </section>
          <section id="changes">
            <h3 class="text-lg font-semibold">11. Changes to this Policy</h3>
            <p class="text-white/85 mt-1">We may update this policy from time to time. We will post any changes on this page with a revised “Last updated” date.</p>
          </section>
          <section id="contact">
            <h3 class="text-lg font-semibold">12. Contact</h3>
            <p class="text-white/85 mt-1">Questions about this policy? Contact us at <a class="underline" href={`mailto:${email}`}>{email}</a>. Last updated: {lastUpdated}.</p>
          </section>

        
        </div>
      </div>
    </div>
  </div>
</section>
