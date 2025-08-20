import { WindowNames } from "../types/types";
const DISPLAY_DEFAULTS: Record<WindowNames, string> = {
    "bm-create-template": "flex",
    "bm-main-overlay": "flex",
    "bm-manage-links": "flex",
    "bm-manage-templates": "flex"
}
export default class UIManager{

    // Functions that update the UI (reinsert data, recreate table rows, ect)
    updateFunctions: Record<WindowNames, Function | undefined> = {
        "bm-create-template": undefined,
        "bm-main-overlay": undefined,
        "bm-manage-links": undefined,
        "bm-manage-templates": undefined
    }

    /**Hides the "window" with the corresponding id */
    close(windowName : WindowNames){
        const bmWindow = document.querySelector(windowName);
        if(bmWindow){ (bmWindow as HTMLElement).style.display = "none" }
    }
    /**Displays the "window" with the corresponding id */
    open(windowName: WindowNames){
        const bmWindow = document.querySelector(windowName);
        if(bmWindow){
            (bmWindow as HTMLElement).style.display = DISPLAY_DEFAULTS[windowName]
            this.updateFunctions[windowName] && this.updateFunctions[windowName]()
        }
    }
}

