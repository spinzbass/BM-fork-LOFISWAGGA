import { EMPTY_BLUE_MARBLE_JSON, TBlueMarbleJSON, TBlueMarbleTemplate } from "../types/schemas.ts";
import { initCreateTemplate } from "./createTemplate.ts";
import DataManager from "./dataManager.ts";
import { initMainOverlay } from "./mainOverlay.ts";
import { initManageLinks } from "./manageLinks.ts";
import { initManageTemplates } from "./manageTemplates.ts";
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
export const dataManager = new DataManager(DUMMY_DATA);
// export const dataManager = new DataManager(EMPTY_BLUE_MARBLE_JSON);

export const uiManager = new UIManager();

const params = new URLSearchParams(document.location.search);
if (params.has("bmShare")) {
    try {
        const json = JSON.parse(params.get("bmShare")!)
        dataManager.appendData(json)
    } catch { }
}

function importFromURL(url: string){
    
    const data = EMPTY_BLUE_MARBLE_JSON; // data should be the data fetched from the URL
    
    dataManager.toBlueMarbleSchema();
    if(dataManager.getType() !== "BM"){
        dataManager.update(EMPTY_BLUE_MARBLE_JSON)
    }
    
    dataManager.appendDataFromURL(data, url);
}

function initialiseWindows() {

    initManageTemplates();
    initManageLinks();
    initCreateTemplate();
    initMainOverlay();
}

initialiseWindows()