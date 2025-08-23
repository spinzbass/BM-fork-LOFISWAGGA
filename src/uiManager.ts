import { WindowNames } from "../types/types";

/**A map of window names to display values. This value is used to set the "open" state of a window
 * @since 0.1.0-overhaul
 */
const DISPLAY_DEFAULTS: Record<WindowNames, string> = {
    "bm-create-template": "flex",
    "bm-main-overlay": "flex",
    "bm-manage-links": "flex",
    "bm-manage-templates": "flex"
}

/**A manager that handles certain UI changes. Mainly opening and closing windows
 * @since 0.1.0-overhaul
 */
export default class UIManager{

    /** Functions that update the UI of a given window (reinsert data, recreate table rows, ect) 
     * @since 0.1.0-overhaul
     */
    updateFunctions: Record<WindowNames, Function | undefined> = {
        "bm-create-template": undefined,
        "bm-main-overlay": undefined,
        "bm-manage-links": undefined,
        "bm-manage-templates": undefined
    }

    /**Hides the "window" with the corresponding id
     * @param {WindowNames} windowName name / id of the window to hide
     * @since 0.1.0-overhaul
     */
    close(windowName : WindowNames){

        const bmWindow = document.querySelector("#"+windowName);
        if(bmWindow){ (bmWindow as HTMLElement).style.display = "none" }
    }
    /**Displays the "window" with the corresponding id
     * @param {WindowNames} windowName name / id of the window to display
     * @since 0.1.0-overhaul
     */
    open(windowName: WindowNames){

        const bmWindow = document.querySelector("#"+windowName);
        if(bmWindow){
            (bmWindow as HTMLElement).style.display = DISPLAY_DEFAULTS[windowName]
            // If the window has a UI update function, call it when opening the window
            this.updateFunctions[windowName] && this.updateFunctions[windowName]() 
        }
    }
}

