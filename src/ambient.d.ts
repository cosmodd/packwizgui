interface Project {
	name: string;
	id: string;
	path: string;
};
namespace Packwiz {

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