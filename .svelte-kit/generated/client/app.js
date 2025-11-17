export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30')
];

export const server_loads = [2];

export const dictionary = {
		"/": [~3],
		"/about": [4],
		"/admin": [~5,[2]],
		"/admin/categories": [~6,[2]],
		"/admin/contacts": [~7,[2]],
		"/admin/content": [~8,[2]],
		"/admin/journal": [~9,[2]],
		"/admin/journal/new": [~10,[2]],
		"/admin/journal/[postId]": [~11,[2]],
		"/admin/leads": [~12,[2]],
		"/admin/login": [~13,[2]],
		"/admin/perks": [~14,[2]],
		"/admin/perks/new": [~15,[2]],
		"/admin/perks/[perkId]": [~16,[2]],
		"/admin/settings": [~17,[2]],
		"/admin/subcategories": [~18,[2]],
		"/admin/users": [~19,[2]],
		"/categories": [~20],
		"/categories/[slug]": [~21],
		"/categories/[slug]/[subcategory]": [~22],
		"/contact": [23],
		"/journal": [~24],
		"/journal/[slug]": [~25],
		"/partner": [26],
		"/perks": [~27],
		"/perks/[slug]": [~28],
		"/privacy": [29],
		"/terms": [30]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';