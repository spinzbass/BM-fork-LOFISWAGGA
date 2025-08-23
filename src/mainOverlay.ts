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

/**Updates the values in this window's UI
 * @since 0.2.0-overhaul
 */
function updateUI(){

    if(!charity.game.user.data){ return }

    // Try to get elements and set the appropriate text
    const nameTD = document.querySelector("#bm-main-overlay td#name");
    if(nameTD){
        nameTD.textContent = charity.game.user.data.name;
    }
    const dropletsTD = document.querySelector("#bm-main-overlay td#droplets")
    if(dropletsTD){
        dropletsTD.textContent = charity.game.user.data.droplets.toString();
    }
    const levelTD = document.querySelector("#bm-main-overlay td#level");
    if(levelTD){
        levelTD.textContent = charity.game.user.data.level.toString();
    }
}


/**Initialises this window's UI-related javascript (addEventListener hooks, ect)
 * @since 0.4.0-overhaul
*/
export function initMainOverlay(){

    updateUI();

    // Update the values in the UI whenever user data changes
    Object.defineProperty(charity.game.user, "data", {
        set: function(){
            updateUI();
        }
    })

    // Try to get the close button and connect the appropriate function to the onClick listener
    const closeBtn = document.querySelector("#bm-main-overlay button#close");
    if(closeBtn){
        closeBtn.addEventListener("click", ()=>close());
    }
    const manageTemplatesBtn = document.querySelector("#bm-main-overlay button#manage-templates");
    if(manageTemplatesBtn){
        manageTemplatesBtn.addEventListener("click", ()=>openManTemplates())
    }
    const manageLinksBtn = document.querySelector("#bm-main-overlay button#manage-links");
    if(manageLinksBtn){
        manageLinksBtn.addEventListener("click", ()=>openManLinks())
    }
}