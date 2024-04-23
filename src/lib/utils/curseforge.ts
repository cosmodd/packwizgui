import { fetchJson } from "./fetch";

const URLS = {
	search: 'https://api.curse.tools/v1/cf/mods/search',
	mods: 'https://api.curse.tools/v1/cf/mods',
};

export enum SortField {
	Featured = 1,
	Popularity = 2,
	LastUpdated = 3,
	Name = 4,
	Author = 5,
	TotalDownloads = 6,
	Category = 7,
	GameVersion = 8,
	EarlyAccess = 9,
	FeaturedReleased = 10,
	ReleasedDate = 11,
	Rating = 12,
}

export enum ModLoaderType {
	Any = 0,
	Forge = 1,
	Cauldron = 2,
	LiteLoader = 3,
	Fabric = 4,
	Quilt = 5,
	NeoForge = 6,
}

export enum CategoryId {
	Mods = 6,
	ResourcePacks = 12,
	Shaders = 6552,
}

export interface ModsSearchOptions {
	sortOrder?: 'asc' | 'desc';
	sortField?: SortField;
	modLoaderType?: ModLoaderType;
	classId?: CategoryId;
	gameVersion?: string;
}

async function searchMods(query: string, page: number, options?: ModsSearchOptions) {
	options = Object.assign({
		sortOrder: 'desc',
		sortField: SortField.Featured,
	}, options);

	const url = new URL(URLS.search);

	url.searchParams.set('searchFilter', query);
	url.searchParams.set('gameId', '432');
	for (const [key, value] of Object.entries(options))
		url.searchParams.set(key, value)
	url.searchParams.set('index', page.toString());

	return fetchJson(url);
}

async function getMods(ids: number[]) {
	return fetchJson(URLS.mods, {
		method: 'POST',
		body: JSON.stringify({ modIds: ids })
	});
}

function convertToMod(response: Curseforge.GameMod, packwizInfo: Packwiz.Mod): Mod {
	const categories: Record<number, Mod["type"]> = {
		[CategoryId.Mods]: 'mod',
		[CategoryId.ResourcePacks]: 'resourcepack',
		[CategoryId.Shaders]: 'shader',
	};

	return {
		slug: response.slug,
		name: response.name,
		description: response.summary,
		projectId: response.id.toString(),
		logoUrl: response.logo?.url,
		side: packwizInfo.side,
		provider: "curseforge",
		type: categories[response.classId],
	};
}

export default {
	searchMods,
	getMods,
	convertToMod
};