export async function fetchJson(url: URL | RequestInfo, init?: RequestInit): Promise<any> {
	const parameters = Object.assign({
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
	}, init);

	const response = await fetch(url, parameters);

	return response.json();
}