<script lang="ts">
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import { SITE_NAME, CONTACT_EMAIL, HERO_IMAGE } from '$lib/config';

  export let data;
  const sections = data?.sections || [];

  const getSection = (key: string) => sections.find((s) => s.section_key === key && s.is_active !== false);

  const hero = getSection('privacy_hero');
  const privacySection = getSection('privacy_sections');

  const fallbackItems = [
    { id: 'overview', title: 'Overview', description: `This Privacy Policy describes how ${SITE_NAME} collects, uses, and shares information when you use our website and services.` },
    { id: 'data', title: 'Information We Collect', description: 'Contact details you provide (name, email, company), usage data (pages viewed, clicks), and technical data (IP address, browser) collected via analytics or logs.' },
    { id: 'use', title: 'How We Use Information', description: 'To provide and improve the Service, personalize content, communicate with you, respond to inquiries, and analyze performance while preventing fraud or abuse.' },
    { id: 'cookies', title: 'Cookies & Analytics', description: 'We may use cookies and similar technologies for essential functionality and analytics. You can control cookies through your browser settings.' },
    { id: 'sharing', title: 'Sharing', description: 'We do not sell personal information. We may share limited data with service providers that help us operate the Service, under confidentiality obligations, and as required by law.' },
    { id: 'retention', title: 'Data Retention', description: 'We retain information for as long as necessary to provide the Service and comply with legal obligations.' },
    { id: 'security', title: 'Security', description: 'We implement reasonable safeguards to protect information. However, no method of transmission or storage is completely secure.' },
    { id: 'rights', title: 'Your Rights', description: 'You may request access, correction, or deletion of your personal information subject to legal limitations. Contact us to exercise these rights.' },
    { id: 'children', title: "Children's Privacy", description: 'Our Service is not directed to children under 13. We do not knowingly collect personal information from children.' },
    { id: 'transfers', title: 'International Transfers', description: 'Information may be processed in countries other than your own. We take steps to ensure appropriate protections for such transfers.' },
    { id: 'changes', title: 'Changes to this Policy', description: 'We may update this policy from time to time. We will post any changes on this page with a revised "Last updated" date.' },
    { id: 'contact', title: 'Contact', description: 'Questions about this policy? Contact us at the email below.' }
  ];

  const privacyItems =
    Array.isArray(privacySection?.content) && privacySection.content.length > 0
      ? privacySection.content.map((item: any, idx: number) => ({
          id: slugify(item.id || item.slug || item.title || `section-${idx + 1}`),
          title: item.title || item.heading || `Section ${idx + 1}`,
          description: item.description || item.body || item.content || ''
        }))
      : fallbackItems;

  const pageTitle = `Privacy Policy | ${SITE_NAME}`;
  const pageDescription = hero?.subtitle || `Privacy Policy for ${SITE_NAME}`;
  const heroTitle = hero?.title || 'Privacy Policy';
  const heroSubtitle = hero?.subtitle || 'Your privacy matters to us. This policy explains what we collect and how we use it.';
  const email = hero?.content?.contact_email || privacySection?.contact_email || CONTACT_EMAIL || 'hello@example.com';
  const lastUpdated =
    hero?.content?.last_updated ||
    privacySection?.last_updated ||
    privacySection?.content_updated_at ||
    new Date().toISOString().slice(0, 10);

  let currentId: string = privacyItems[0]?.id ?? '';

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
    style="background-image: url('{hero?.image_url || HERO_IMAGE}')"
    aria-hidden="true"
  ></div>
  <div class="absolute inset-0 bg-brand-darkGreen/85"></div>
  <div class="relative container-w py-20">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 w-max">
      <span class="w-2 h-2 rounded-full bg-yellow-400"></span>
      <span class="text-sm">Legal</span>
    </div>
    <h1 class="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">{heroTitle}</h1>
    <p class="mt-3 max-w-2xl text-white/85">{heroSubtitle}</p>
    <div class="mt-4 text-sm text-white/70">Last updated: {lastUpdated}</div>
  </div>
</section>

<section class="pt-10 md:pt-14">
  <div class="relative container-w w-full">
    <div class="mx-auto max-w-5xl mt-6 md:mt-10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 grid grid-cols-1 md:grid-cols-12">
      <aside class="col-span-4 bg-yellow-50 px-6 pt-8 pb-6">
        <ol class="space-y-3 text-sm">
          {#each privacyItems as item, i}
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
          <h2 class="text-xl font-extrabold tracking-wide">Privacy Policy</h2>

          {#each privacyItems as item, i}
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
