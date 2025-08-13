export async function getGMResourceTextAsync(resourceName: string): Promise<string>{
    return fetch(await GM.getResourceUrl(resourceName)).then((response => response.text()));
}