import { EMPTY_BLUE_MARBLE_JSON, TBlueMarbleJSON, TBlueMarbleTemplate } from "../types/schemas.ts";
import { initCreateTemplate } from "./createTemplate.ts";
import DataManager from "./dataManager.ts";
import { initMainOverlay } from "./mainOverlay.ts";
import { initManageLinks } from "./manageLinks.ts";
import { initManageTemplates } from "./manageTemplates.ts";
import { drawAllTemplates } from "./templates.ts";
import UIManager from "./uiManager.ts";

import "@placecharity/framework-types"

const DUMMY_DATA = {
whoami: "BlueMarble",
schemaVersion: "",
templates: [
    {
        coords: [0, 1, 2, 3],
        enabled: false,
        uuid: "BLAJSIAFBNIUBAWIFIOANWA",
    },
    {
        coords: [0, 1, 2, 3],
        name: "Test",
        enabled: false,
        authorID: 54,
        uuid: "BLAJSIAFBNIUBAWIFIOANWA",
    }
]
}
const storageData: TBlueMarbleJSON | undefined = DUMMY_DATA // data should be data gotten from storage

// Global object that holds and manages Blue Marble's JSON data (templates, links, ect.)
export const dataManager = new DataManager(storageData);
// export const dataManager = new DataManager(EMPTY_BLUE_MARBLE_JSON);

// Global object that manages the UI of Blue Marble's windows
export const uiManager = new UIManager();

const mainOverlay = document.querySelector("#bm-main-overlay");

// If main overlay already exists that means another Blue Marble instance is already running
if(!mainOverlay){ 
    // Only run the code if this is the first Blue Marble instance
    
    const params = new URLSearchParams(document.location.search); // Gets the URL search query
    if (params.has("bmShare")) {
        try {
            const json = JSON.parse(params.get("bmShare")!)
            dataManager.appendData(json)
        } catch { }
    }

    // Make sure the global data object is in Blue Marble's JSON format
    dataManager.toBlueMarbleSchema();
    if(dataManager.getType() !== "BM"){
        dataManager.update(EMPTY_BLUE_MARBLE_JSON)
    }

    else if((dataManager.get() as TBlueMarbleJSON).links){
        (dataManager.get() as TBlueMarbleJSON).links?.forEach(link => {
            // Imports data from every URL in the global data object
            importFromURL(link.url);
        })
    }

    drawAllTemplates(); // Data has been imported so draw the templates in the array

    // Call the initialisation functions of all the windows
    initManageTemplates();
    initManageLinks();
    initCreateTemplate();
    initMainOverlay();

    uiManager.open("bm-main-overlay");

}

/** Fetches data from a URL and then updates the object stored in dataManager appropriately
 * @since 0.1.0-overhaul
 */
function importFromURL(url: string){
    
    const data = EMPTY_BLUE_MARBLE_JSON; // data should be the data fetched from the URL

    dataManager.appendTemplateDataFromURL(data, url);
}