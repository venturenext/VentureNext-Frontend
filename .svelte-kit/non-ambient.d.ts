
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/admin" | "/admin/api" | "/admin/api/login" | "/admin/categories" | "/admin/contacts" | "/admin/content" | "/admin/journal" | "/admin/journal/new" | "/admin/journal/[postId]" | "/admin/landing" | "/admin/leads" | "/admin/login" | "/admin/logout" | "/admin/perks" | "/admin/perks/new" | "/admin/perks/[perkId]" | "/admin/settings" | "/admin/subcategories" | "/admin/users" | "/categories" | "/categories/[slug]" | "/categories/[slug]/[subcategory]" | "/contact" | "/journal" | "/journal/[slug]" | "/partner" | "/perks" | "/perks/[slug]" | "/privacy" | "/robots.txt" | "/sitemap.xml" | "/terms";
		RouteParams(): {
			"/admin/journal/[postId]": { postId: string };
			"/admin/perks/[perkId]": { perkId: string };
			"/categories/[slug]": { slug: string };
			"/categories/[slug]/[subcategory]": { slug: string; subcategory: string };
			"/journal/[slug]": { slug: string };
			"/perks/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { postId?: string; perkId?: string; slug?: string; subcategory?: string };
			"/about": Record<string, never>;
			"/admin": { postId?: string; perkId?: string };
			"/admin/api": Record<string, never>;
			"/admin/api/login": Record<string, never>;
			"/admin/categories": Record<string, never>;
			"/admin/contacts": Record<string, never>;
			"/admin/content": Record<string, never>;
			"/admin/journal": { postId?: string };
			"/admin/journal/new": Record<string, never>;
			"/admin/journal/[postId]": { postId: string };
			"/admin/landing": Record<string, never>;
			"/admin/leads": Record<string, never>;
			"/admin/login": Record<string, never>;
			"/admin/logout": Record<string, never>;
			"/admin/perks": { perkId?: string };
			"/admin/perks/new": Record<string, never>;
			"/admin/perks/[perkId]": { perkId: string };
			"/admin/settings": Record<string, never>;
			"/admin/subcategories": Record<string, never>;
			"/admin/users": Record<string, never>;
			"/categories": { slug?: string; subcategory?: string };
			"/categories/[slug]": { slug: string; subcategory?: string };
			"/categories/[slug]/[subcategory]": { slug: string; subcategory: string };
			"/contact": Record<string, never>;
			"/journal": { slug?: string };
			"/journal/[slug]": { slug: string };
			"/partner": Record<string, never>;
			"/perks": { slug?: string };
			"/perks/[slug]": { slug: string };
			"/privacy": Record<string, never>;
			"/robots.txt": Record<string, never>;
			"/sitemap.xml": Record<string, never>;
			"/terms": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/admin" | "/admin/" | "/admin/api" | "/admin/api/" | "/admin/api/login" | "/admin/api/login/" | "/admin/categories" | "/admin/categories/" | "/admin/contacts" | "/admin/contacts/" | "/admin/content" | "/admin/content/" | "/admin/journal" | "/admin/journal/" | "/admin/journal/new" | "/admin/journal/new/" | `/admin/journal/${string}` & {} | `/admin/journal/${string}/` & {} | "/admin/landing" | "/admin/landing/" | "/admin/leads" | "/admin/leads/" | "/admin/login" | "/admin/login/" | "/admin/logout" | "/admin/logout/" | "/admin/perks" | "/admin/perks/" | "/admin/perks/new" | "/admin/perks/new/" | `/admin/perks/${string}` & {} | `/admin/perks/${string}/` & {} | "/admin/settings" | "/admin/settings/" | "/admin/subcategories" | "/admin/subcategories/" | "/admin/users" | "/admin/users/" | "/categories" | "/categories/" | `/categories/${string}` & {} | `/categories/${string}/` & {} | `/categories/${string}/${string}` & {} | `/categories/${string}/${string}/` & {} | "/contact" | "/contact/" | "/journal" | "/journal/" | `/journal/${string}` & {} | `/journal/${string}/` & {} | "/partner" | "/partner/" | "/perks" | "/perks/" | `/perks/${string}` & {} | `/perks/${string}/` & {} | "/privacy" | "/privacy/" | "/robots.txt" | "/robots.txt/" | "/sitemap.xml" | "/sitemap.xml/" | "/terms" | "/terms/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | "/images/hero.svg" | "/images/image.jpg" | "/images/perk-placeholder.svg" | "/logo.svg" | string & {};
	}
}