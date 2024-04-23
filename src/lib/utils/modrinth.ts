import { fetchJson } from "./fetch";

const URLS = {
	search: 'https://api.modrinth.com/v2/search',
	project: 'https://api.modrinth.com/v2/project',
	projects: 'https://api.modrinth.com/v2/projects'
};

interface ModsSearchOptions {
	sortBy?: 'relevance' | 'downloads' | 'follows' | 'newest' | 'updated';
	version?: string;
	projectType?: 'mod' | 'shader' | 'resourcepack';
}

async function searchProjects(query: string, offset: number, options?: ModsSearchOptions): Promise<any> {
	const url = new URL(URLS.search);
	const facets = [];

	options = Object.assign({
		sortBy: 'relevance',
		projectType: 'shader',
	} as ModsSearchOptions, options ?? {});

	url.searchParams.set('query', query);
	url.searchParams.set('offset', offset.toString());
	url.searchParams.set('limit', '100');
	if (options?.sortBy) url.searchParams.set('index', options.sortBy);

	// Handle facets
	if (options?.projectType) facets.push([`project_type:${options.projectType}`]);
	if (options?.version) facets.push([`versions:${options.version}`]);
	if (facets.length) url.searchParams.set('facets', JSON.stringify(facets));

	return fetchJson(url);
}

async function getProjects(ids: string[]): Promise<any> {
	const url = new URL(URLS.projects);

	url.searchParams.set('ids', JSON.stringify(ids));

	return fetchJson(url);
}

function convertToMod(project: Modrinth.Project, packwizData: Packwiz.Mod): Mod {
	return {
		slug: project.slug,
		name: project.title,
		description: project.description,
		projectId: project.id.toString(),
		logoUrl: project.icon_url,
		side: packwizData.side,
		provider: "modrinth",
		type: project.project_type,
	};
}

export default {
	searchProjects,
	getProjects,
	convertToMod
};