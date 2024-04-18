interface Project {
	// Basic informations
	name: string;
	id: string;
	path: string;
	versions: {
		minecraft: string;
		fabric?: string;
		forge?: string;
		liteloader?: string;
		quilt?: string;
		neoforge?: string;
	};
	mods: Mod[];
}

interface Mod {
	slug: string;
	name: string;
	description: string;
	projectId: string;
	logoUrl?: string;
	side: "client" | "server" | "both";
	provider: "curseforge" | "modrinth";
	type: "mod" | "shader" | "resourcepack";
}

namespace Modrinth {

	interface Project {
		slug: string;
		title: string;
		description: string;
		categories: string[];
		client_side: 'required' | 'optional' | 'unsupported';
		server_side: 'required' | 'optional' | 'unsupported';
		body: string;
		status: 'approved' | 'archived' | 'rejected' | 'draft' | 'unlisted' | 'processing' | 'withheld' | 'scheduled' | 'private' | 'unknown';
		requested_status: 'approved' | 'archived' | 'unlisted' | 'private' | 'draft' | null;
		additional_categories: string[];
		issues_url: string | null;
		source_url: string | null;
		wiki_url: string | null;
		discord_url: string | null;
		donation_urls: ProjectDonationURL[];
		project_type: 'mod';
		downloads: number;
		icon_url: string;
		color: number;
		thread_id: string;
		monetization_status: 'monetized';
		id: string;
		team: string;
		published: string;
		updated: string;
		approved: string;
		queued: string;
		followers: number;
		license: {
			id: string;
			name: string;
			url: string;
		};
		versions: string[];
		game_versions: string[];
		loaders: string[];
		gallery: ProjectGalleryImage[];
	}

	interface ProjectDonationURL {
		platform: string;
		url: string;
	}

	interface ProjectGalleryImage {
		url: string;
		featured: boolean;
		title: string;
		description: string;
		created: string;
	}

}

namespace Curseforge {

	interface GameMod {
		id: number;
		gameId: number;
		name: string;
		slug: string;
		links: {
			websiteUrl: string;
			wikiUrl: string;
			issuesUrl: string;
			sourceUrl: string;
		};
		summary: string;
		status: number;
		downloadCount: number;
		isFeatured: boolean;
		primaryCategoryId: number;
		categories: Category[];
		classId: number;
		authors: Author[];
		logo: Logo;
		screenshots: Screenshot[];
		mainFileId: number;
		latestFiles: LatestFile[];
		latestFilesIndexes: LatestFilesIndex[];
		latestEarlyAccessFilesIndexes: LatestFilesIndex[];
		dateCreated: string;
		dateModified: string;
		dateReleased: string;
		allowModDistribution: boolean;
		gamePopularityRank: number;
		isAvailable: boolean;
		thumbsUpCount: number;
		rating: number;
	}

	interface Category {
		id: number;
		gameId: number;
		name: string;
		slug: string;
		url: string;
		iconUrl: string;
		dateModified: string;
		isClass: boolean;
		classId: number;
		parentCategoryId: number;
		displayIndex: number;
	}

	interface Author {
		id: number;
		name: string;
		url: string;
	}

	interface Logo {
		id: number;
		modId: number;
		title: string;
		description: string;
		thumbnailUrl: string;
		url: string;
	}

	interface Screenshot {
		id: number;
		modId: number;
		title: string;
		description: string;
		thumbnailUrl: string;
		url: string;
	}

	interface LatestFile {
		id: number;
		gameId: number;
		modId: number;
		isAvailable: boolean;
		displayName: string;
		fileName: string;
		releaseType: number;
		fileStatus: number;
		hashes: Hash[];
		fileDate: string;
		fileLength: number;
		downloadCount: number;
		fileSizeOnDisk: number;
		downloadUrl: string;
		gameVersions: string[];
		sortableGameVersions: SortableGameVersion[];
		dependencies: Dependency[];
		exposeAsAlternative: boolean;
		parentProjectFileId: number;
		alternateFileId: number;
		isServerPack: boolean;
		serverPackFileId: number;
		isEarlyAccessContent: boolean;
		earlyAccessEndDate: string;
		fileFingerprint: number;
		modules: Module[];
	}

	interface Hash {
		value: string;
		algo: number;
	}

	interface SortableGameVersion {
		gameVersionName: string;
		gameVersionPadded: string;
		gameVersion: string;
		gameVersionReleaseDate: string;
		gameVersionTypeId: number;
	}

	interface Dependency {
		modId: number;
		relationType: number;
	}

	interface Module {
		name: string;
		fingerprint: number;
	}

	interface LatestFilesIndex {
		gameVersion: string;
		fileId: number;
		filename: string;
		releaseType: number;
		gameVersionTypeId: number;
		modLoader: number;
	}
}

namespace Packwiz {

	interface Project {
		name: string;
		id: string;
		path: string;
	};

	interface PackInfo {
		name: string;
		author: string;
		version: string;
		"pack-format": string;
		index: {
			file: string;
			"hash-format": string;
			hash: string;
		};
		versions: {
			forge?: string;
			minecraft: string;
		}
	}

	interface IndexFile {
		"hash-format": string;
		files: {
			file: string;
			"hash": string;
			metafile?: boolean;
		}[];
	}

	interface Mod {
		slug: string;
		name: string;
		filename: string;
		side: "client" | "server" | "both";
		update: {
			curseforge?: {
				"file-id": number;
				"project-id": number;
			},
			modrinth?: {
				"mod-id": string;
				version: string;
			}
		}
	}

}