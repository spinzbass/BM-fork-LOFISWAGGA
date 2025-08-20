import { WindowNames } from "../types/types";
const DISPLAY_DEFAULTS: Record<WindowNames, string> = {
    "bm-create-template": "flex",
    "bm-main-overlay": "flex",
    "bm-manage-links": "flex",
    "bm-manage-templates": "flex"
}
export default class UIManager{
    /**Hides the "window" with the corresponding id */
    static close(windowName : WindowNames){
        const bmWindow = document.querySelector(windowName);
        if(bmWindow){ (bmWindow as HTMLElement).style.display = "none" }
    }
    /**Displays the "window" with the corresponding id */
    static open(windowName: WindowNames){
        const bmWindow = document.querySelector(windowName);
        if(bmWindow){ (bmWindow as HTMLElement).style.display = DISPLAY_DEFAULTS[windowName] }
    }
}

