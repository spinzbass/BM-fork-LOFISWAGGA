export async function getGMResourceText(resourceName: string): Promise<string>{
    return fetch(await GM.getResourceUrl(resourceName)).then((response => response.text()));
}