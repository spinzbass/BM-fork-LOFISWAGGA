import { dataManager } from "./main";

/**Invokes a document.createElement call with the provided tagname, then adds the provided attributes to the created elements 
 * @param {keyof HTMLElementTagNameMap} tagName Name that dictates what type of element to create
 * @param {Record<string, any>} attributes A map of attribute name to attribute to value. The key "className" converts to "class" and the key "textContent" sets the text of the element
 * @returns The created element with the added attributes
 * @since 0.1.0-overhaul
*/
export function createElementWithAttributes<T extends keyof HTMLElementTagNameMap>(tagName: T, attributes?: Record<string, any>): HTMLElement{

    const elem = document.createElement(tagName);
    if(attributes) {
        // Set the values for each attribute
        Object.entries(attributes).forEach(([attr, value])=>{
            // Do conversions where necessary
            if(attr === "className") {elem.setAttribute("class", value)}
            else if(attr === "textContent") {elem.textContent = value}
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

/**Converts a 4 element array of coordinates into map longitude and latitude
 * @param {number[]} coordinates A 4 element array of coordinates (Tile X, Tile Y, Pixel X, Pixel Y)
 * @returns A lngLat object or undefined if an error occured e.g. malformed coordinates data
 * @since 0.3.0-overhaul
 */
export function canvasPosToLatLng(coordinates: number[]): {lng: number, lat: number} | undefined{
    // Function provided by courtesy of CloudBurst
    if(coordinates.length !== 4) { return };
    let actualX = (coordinates[0] * 1000) + coordinates[2];
    let actualY = (coordinates[1] * 1000) + coordinates[3];

    const mapSize = 2048000;

    let x = actualX / mapSize;
    let y = actualY / mapSize;

    function inverseO_(n: number) { return 360 * x - 180 }
    function inverseN_(n: number) { return (Math.atan(Math.exp(Math.PI - 2 * Math.PI * n)) - Math.PI / 4) * 360 / Math.PI; }

    return {
        lng: inverseO_(x),
        lat: inverseN_(y)
    }
}