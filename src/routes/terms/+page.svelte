<script lang="ts">
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import { SITE_NAME, CONTACT_EMAIL, HERO_IMAGE } from '$lib/config';
  const title = `Terms of Service | ${SITE_NAME}`;
  const description = `Terms of Service for ${SITE_NAME}`;
  const email = CONTACT_EMAIL || 'hello@example.com';
  const lastUpdated = new Date().toISOString().slice(0, 10);

  const sections = [
    { id: 'acceptance', t: 'Acceptance of Terms' },
    { id: 'usage', t: 'Using the Service' },
    { id: 'accounts', t: 'Accounts' },
    { id: 'ip', t: 'Content & Intellectual Property' },
    { id: 'thirdparty', t: 'Perks & Third‑Party Links' },
    { id: 'disclaimer', t: 'Disclaimer' },
    { id: 'liability', t: 'Limitation of Liability' },
    { id: 'termination', t: 'Termination' },
    { id: 'law', t: 'Governing Law' },
    { id: 'changes', t: 'Changes to Terms' },
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
    <h1 class="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
    <p class="mt-3 max-w-2xl text-white/85">Please read these terms carefully before using {SITE_NAME}.</p>
    <div class="mt-4 text-sm text-white/70">Last updated: {lastUpdated}</div>
  </div>
</section>

<section class="pt-10 md:pt-14">
<script>
  export let sections = [
    { id: "acceptance", t: "Acceptance of Terms" },
    { id: "usage", t: "Using the Service" },
    { id: "accounts", t: "Accounts" },
    { id: "ip", t: "Content & IP" },
    { id: "thirdparty", t: "Perks & Third-Party Links" },
    { id: "disclaimer", t: "Disclaimer" },
    { id: "liability", t: "Limitation of Liability" },
    { id: "termination", t: "Termination" },
    { id: "law", t: "Governing Law" },
    { id: "changes", t: "Changes to Terms" },
    { id: "contact", t: "Contact" }
  ];

  export let SITE_NAME = "PerkPal";
  export let email = "support@perkpal.com";
  export let lastUpdated = "Nov 8, 2025";

  let currentId = sections[0].id;
</script>

<div class="relative container-w w-full">
  <div class="mx-auto max-w-5xl mt-6 md:mt-10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 grid grid-cols-1 md:grid-cols-12">
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
      <div class="p-7 md:p-8 max-h-[70vh] overflow-y-auto space-y-6">
        <h2 class="text-xl font-extrabold tracking-wide">Terms & Conditions</h2>

        <section id="acceptance">
          <h3 class="text-lg font-semibold">1. Acceptance of Terms</h3>
          <p class="text-white/85 mt-1">By accessing or using {SITE_NAME} (the “Service”), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use the Service.</p>
        </section>

        <section id="usage">
          <h3 class="text-lg font-semibold">2. Using the Service</h3>
          <p class="text-white/85 mt-1">You agree to use the Service only for lawful purposes and in compliance with applicable laws. You are responsible for any content you submit and for keeping your information accurate.</p>
        </section>

        <section id="accounts">
          <h3 class="text-lg font-semibold">3. Accounts</h3>
          <p class="text-white/85 mt-1">You may be required to provide certain information to access features. You are responsible for maintaining the confidentiality of your account and for all activities that occur under it.</p>
        </section>

        <section id="ip">
          <h3 class="text-lg font-semibold">4. Content & Intellectual Property</h3>
          <p class="text-white/85 mt-1">All materials on the Service are owned by {SITE_NAME} or our licensors and protected by IP laws. You may not copy, modify, distribute, or create derivative works without permission.</p>
        </section>

        <section id="thirdparty">
          <h3 class="text-lg font-semibold">5. Perks & Third-Party Links</h3>
          <p class="text-white/85 mt-1">Perks and offers may be provided by third parties. We do not control and are not responsible for third-party sites, terms, or availability. Always review partner terms before redeeming.</p>
        </section>

        <section id="disclaimer">
          <h3 class="text-lg font-semibold">6. Disclaimer</h3>
          <p class="text-white/85 mt-1">The Service is provided on an “as is” and “as available” basis without warranties of any kind. We do not guarantee accuracy, availability, or fitness for a particular purpose.</p>
        </section>

        <section id="liability">
          <h3 class="text-lg font-semibold">7. Limitation of Liability</h3>
          <p class="text-white/85 mt-1">To the maximum extent permitted by law, {SITE_NAME} will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.</p>
        </section>

        <section id="termination">
          <h3 class="text-lg font-semibold">8. Termination</h3>
          <p class="text-white/85 mt-1">We may suspend or terminate access to the Service at any time, with or without cause, and with or without prior notice.</p>
        </section>

        <section id="law">
          <h3 class="text-lg font-semibold">9. Governing Law</h3>
          <p class="text-white/85 mt-1">These terms are governed by applicable laws of your local jurisdiction unless otherwise required by law.</p>
        </section>

        <section id="changes">
          <h3 class="text-lg font-semibold">10. Changes to Terms</h3>
          <p class="text-white/85 mt-1">We may update these terms from time to time. Updated terms will be posted on this page with a revised “Last updated” date.</p>
        </section>

        <section id="contact">
          <h3 class="text-lg font-semibold">11. Contact</h3>
          <p class="text-white/85 mt-1">If you have questions about these terms, contact us at <a class="underline" href={`mailto:${email}`}>{email}</a>. Last updated: {lastUpdated}.</p>
        </section>

      </div>
    </div>

  </div>
</div>


</section>
