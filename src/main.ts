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

function importDataFromURL(url: string) {
    // fetch from URL
    const data = new DataManager(EMPTY_BLUE_MARBLE_JSON); // should be data gotten from the url
    data.toBlueMarbleSchema();
    if (data.getType() !== "BM") {
        window.charity.lib.sonner.toast.error(`url: ${url} returned data in an incompatible format`);
        return;
    }
    const importedTemplates = (data.get() as TBlueMarbleJSON).templates;
    // Set the template origins
    importedTemplates?.map((template: TBlueMarbleTemplate) => ({ ...template, originLink: url }));

    dataManager.toBlueMarbleSchema();
    if(dataManager.getType() !== "BM"){
        dataManager.update(EMPTY_BLUE_MARBLE_JSON)
    }

    const templatesCopy = (dataManager.get() as TBlueMarbleJSON).templates;

    for(const [i, template] of (dataManager.get() as TBlueMarbleJSON).templates.entries()){
        if(importedTemplates.length === 0){ break; }
        if(template.originLink !== url){ continue }

        const idx = importedTemplates.findIndex((elem)=>elem.authorID === template.authorID && elem.uuid === template.uuid);
        if(idx !== -1){
            // If the imported data has this template remove it to not loop over it anymore and not append it later
            importedTemplates.splice(idx,1);
        }else{
            // If the imported data doesn't have this template, remove it from the templates list
            templatesCopy.splice(i, 1)
        }
    }

    if(importedTemplates.length !== 0){
        // Append imported templates that weren't already in the templates array
        templatesCopy.push(...importedTemplates);
    }

    // Update the stored object with the new array
    dataManager.update({...this.object, templates: templatesCopy});
}

function initialiseWindows() {

    initManageTemplates();
    initManageLinks();
    initCreateTemplate();
    initMainOverlay();
}

initialiseWindows()