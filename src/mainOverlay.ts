import { uiManager } from "./main";

// Typescript / Javascript for the "manageTemplates" window

/**Closes this window
 * @since 0.1.0-overhaul
 */
function close(){
    uiManager.close("bm-main-overlay")
}

/**Opens the "manage templates" window
 * @since 0.1.0-overhaul
 */
function openManTemplates(){
    uiManager.open("bm-manage-templates")
}

/**Opens the "manage links" window
 * @since 0.1.0-overhaul
 */
function openManLinks(){
    uiManager.open("bm-manage-links")
}

/**Initialises this window's UI-related javascript (addEventListener hooks, ect)
 * @since 0.1.0-overhaul
*/
export function initMainOverlay(){
    // Add event listener hooks
}