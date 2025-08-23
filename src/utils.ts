import { dataManager } from "./main";

/**Invokes a document.createElement call with the provided tagname, then adds the provided attributes to the created elements 
 * @param {keyof HTMLElementTagNameMap} tagName Name that dictates what type of element to create
 * @param {Record<string, string>} attributes A map of attribute name to attribute to value. The key "className" converts to "class"
 * @returns The created element with the added attributes
 * @since 0.1.0-overhaul
*/
export function createElementWithAttributes<T extends keyof HTMLElementTagNameMap>(tagName: T, attributes?: Record<string, string>): HTMLElement{

    const elem = document.createElement(tagName);
    if(attributes) {
        Object.entries(attributes).forEach(([attr, value])=>{
            if(attr === "className") {elem.setAttribute("class", value)}
            else elem.setAttribute(attr, value);
        })
    }

    return elem;
}

/**Prompts a download of the provided data in the browser
 * @param {any} data The data that is downloaded. This can be any JSON-stringifiable data
 * @since 0.1.0-overhaul
 */
export function download(data: any){

    try {
        const jsonString = JSON.stringify(data);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob); // Create a web-accessible link for the templatesJSON resource (necessary for it to be downloaded)
        const anchor = document.createElement("a");
        anchor.download = "ExportJson.json"; // Default fileName of download file
        anchor.href = url; // Set the resource / download link
        anchor.click(); // Simulate clicking on a download link (starts the download)
        URL.revokeObjectURL(url); // Free the URL from memory as it's unnecessary now
    } catch (err) {
        console.error("An error occurded while exporting the templates: ", err);
    }
}

/**Generates a UUID, unique to this user 
 * @returns The generated UUID
 * @since 0.1.0-overhaul
*/
export function generateUUID(): string{

    let uuid = crypto.randomUUID();
    const userID = charity.game.user.data?.id
    if(dataManager.getType() !== "N/A"){
        // Make sure that no template shares this UUID and this user's ID
        while(dataManager.get()?.templates.some((template: any)=>{template.authorID==userID && template.uuid==uuid})){
            uuid = crypto.randomUUID()
        }
    }
    
    return uuid;
}