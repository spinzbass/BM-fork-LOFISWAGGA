import { uiManager } from "./main";

function close(){
    uiManager.close("bm-main-overlay")
}

function openManTemplates(){
    uiManager.open("bm-manage-templates")
}

function openManLinks(){
    uiManager.open("bm-manage-links")
}

export function initMainOverlay(){
    // Add event listener hooks
}