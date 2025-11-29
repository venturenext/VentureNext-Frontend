<script lang="ts">
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import { SITE_NAME, CONTACT_EMAIL, HERO_IMAGE } from '$lib/config';
  import { withAsset } from '$lib/utils/assets';

  export let data;
  const sections = data?.sections || [];

  const getSection = (key: string) => sections.find((s) => s.section_key === key && s.is_active !== false);

  const hero = getSection('terms_hero');
  const termsSection = getSection('terms_sections');

  const fallbackItems = [
    { id: 'acceptance', title: 'Acceptance of Terms', description: `By accessing or using ${SITE_NAME} (the "Service"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you may not use the Service.` },
    { id: 'usage', title: 'Using the Service', description: 'You agree to use the Service only for lawful purposes and in compliance with applicable laws. You are responsible for any content you submit and for keeping your information accurate.' },
    { id: 'accounts', title: 'Accounts', description: 'You may be required to provide certain information to access features. You are responsible for maintaining the confidentiality of your account and for all activities that occur under it.' },
    { id: 'ip', title: 'Content & Intellectual Property', description: `All materials on the Service are owned by ${SITE_NAME} or our licensors and protected by IP laws. You may not copy, modify, distribute, or create derivative works without permission.` },
    { id: 'thirdparty', title: 'Perks & Third-Party Links', description: 'Perks and offers may be provided by third parties. We do not control and are not responsible for third-party sites, terms, or availability. Always review partner terms before redeeming.' },
    { id: 'disclaimer', title: 'Disclaimer', description: 'The Service is provided on an "as is" and "as available" basis without warranties of any kind. We do not guarantee accuracy, availability, or fitness for a particular purpose.' },
    { id: 'liability', title: 'Limitation of Liability', description: 'To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.' },
    { id: 'termination', title: 'Termination', description: 'We may suspend or terminate access to the Service at any time, with or without cause, and with or without prior notice.' },
    { id: 'law', title: 'Governing Law', description: 'These terms are governed by applicable laws of your local jurisdiction unless otherwise required by law.' },
    { id: 'changes', title: 'Changes to Terms', description: 'We may update these terms from time to time. Updated terms will be posted on this page with a revised "Last updated" date.' },
    { id: 'contact', title: 'Contact', description: 'If you have questions about these terms, contact us at the email below.' }
  ];

  const termsItems =
    Array.isArray(termsSection?.content) && termsSection.content.length > 0
      ? termsSection.content.map((item: any, idx: number) => ({
          id: slugify(item.id || item.slug || item.title || `section-${idx + 1}`),
          title: item.title || item.heading || `Section ${idx + 1}`,
          description: item.description || item.body || item.content || ''
        }))
      : fallbackItems;

  const pageTitle = `Terms of Service | ${SITE_NAME}`;
  const pageDescription = hero?.subtitle || `Terms of Service for ${SITE_NAME}`;
  const heroTitle = hero?.title || 'Terms of Service';
  const heroSubtitle = hero?.subtitle || `Please read these terms carefully before using ${SITE_NAME}.`;
  const email = hero?.content?.contact_email || termsSection?.contact_email || CONTACT_EMAIL || 'hello@example.com';
  const lastUpdated =
    hero?.content?.last_updated ||
    termsSection?.last_updated ||
    termsSection?.content_updated_at ||
    new Date().toISOString().slice(0, 10);

  let currentId: string = termsItems[0]?.id ?? '';

  function slugify(value: string) {
    return (
      value
        ?.toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || 'section'
    );
  }
</script>

<SEOHead title={pageTitle} description={pageDescription} />

<!-- Hero -->
<section class="relative text-white overflow-hidden">
  <div
    class="absolute inset-0 bg-center bg-cover"
    style={`background-image: url('${withAsset(hero?.image_url) || HERO_IMAGE}')`}
    aria-hidden="true"
  ></div>
  <div class="absolute inset-0 bg-brand-darkGreen/85"></div>
  <div class="relative container-w py-20 text-center">
    <h1 class="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">{heroTitle}</h1>
    <p class="mt-3 mx-auto max-w-2xl text-white/85">{heroSubtitle}</p>
  </div>
</section>

<section class="pt-10 md:pt-14">
  <div class="relative container-w w-full">
    <div class="mx-auto max-w-5xl mt-6 md:mt-10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 grid grid-cols-1 md:grid-cols-12">
      <aside class="col-span-4 bg-yellow-50 px-6 pt-8 pb-6">
        <ol class="space-y-3 text-sm">
          {#each termsItems as item, i}
            <li>
              <a
                href={`#${item.id}`}
                on:click={() => (currentId = item.id)}
                class="block rounded px-3 py-2 transition-colors hover:bg-white/60"
                class:text-brand-darkGreen={currentId === item.id}
                class:font-semibold={currentId === item.id}
                class:text-brand-slateGray={currentId !== item.id}
              >
                {i + 1}. {item.title}
              </a>
            </li>
          {/each}
        </ol>
      </aside>

      <div class="col-span-8 bg-brand-darkGreen text-white">
        <div class="p-7 md:p-8 max-h-[70vh] overflow-y-auto space-y-6">
          <h2 class="text-xl font-extrabold tracking-wide">Terms & Conditions</h2>

          {#each termsItems as item, i}
            <section id={item.id} class="scroll-mt-6">
              <h3 class="text-lg font-semibold">{i + 1}. {item.title}</h3>
              <p class="text-white/85 mt-1 leading-relaxed">{item.description}</p>
            </section>
          {/each}

        </div>
      </div>
    </div>
  </div>
</section>
