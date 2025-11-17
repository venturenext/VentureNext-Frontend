<script>
  import SEOHead from '$lib/components/seo/SEOHead.svelte';
  import ContactForm from '$lib/components/forms/ContactForm.svelte';
  import { CONTACT_EMAIL, SITE_NAME } from '$lib/config';
  const title = 'Get in Touch';
  const blurb = "We're here to help! Whether you have questions, feedback, or need assistance, we're all ears. Use the form below or drop us an email.";
  const email = CONTACT_EMAIL;
  const mailHref = `mailto:${email}`;
</script>

<SEOHead title={`Contact Us | ${SITE_NAME}`} description={`Get in touch with the ${SITE_NAME} team.`} />

<!-- Hero banner -->
<section class="bg-pink-100">
  <div class="container-w py-16 text-center">
    <h1 class="text-4xl font-extrabold text-brand-richBlack">{title}</h1>
    <p class="mt-3 max-w-3xl mx-auto text-brand-slateGray">{blurb} <a class="underline text-brand-richBlack" href={mailHref}>{email}</a></p>
  </div>
  <div class="sr-only" aria-hidden="true"></div>
</section>

<!-- Form section on subtle background -->
<section class="bg-gray-50 py-12">
  <div class="container-w flex justify-center">
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-card p-6 sm:p-8">
      <ContactForm />
    </div>
  </div>
  
</section>
