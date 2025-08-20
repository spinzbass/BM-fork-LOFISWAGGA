import { EMPTY_BLUE_MARBLE } from "../types/schemas.ts";
import { initCreateTemplate } from "./createTemplate.ts";
import DataManager from "./dataManager.ts";
import { initMainOverlay } from "./mainOverlay.ts";
import { initManageLinks } from "./manageLinks.ts";
import { initManageTemplates } from "./manageTemplates.ts";
import UIManager from "./uiManager.ts";

window.charity.game.map.on("click", (e)=>{console.log(e)})

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
// export const dataManager = new DataManager(EMPTY_BLUE_MARBLE);

export const uiManager = new UIManager();

const params = new URLSearchParams(document.location.search);
if(params.has("bmShare")){
    try{
        const json = JSON.parse(params.get("bmShare")!)
        dataManager.appendData(json)
    }catch{}
}

function initialiseWindows(){
    
    initManageTemplates();
    initManageLinks();
    initCreateTemplate();
    initMainOverlay();
}

initialiseWindows()