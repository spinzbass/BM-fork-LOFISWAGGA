import { Schemas } from "../types/types";
import { dataManager, uiManager } from "./main";
import { download } from "./utils";
import { TBlueMarbleJSON } from "../types/schemas";

// Typescript / Javascript for the "manageTemplates" window

let exportTemplateIndexes: number[] = []

/**Closes this window
 * @since 0.1.0-overhaul
 */
function close(){
    uiManager.close("bm-manage-links")
}

/**Creates the rows in the table and populates them with data from the stored object
 * @since 0.1.0-overhaul
 */
function createTableRows(){

    let tableBody = document.querySelector("#bm-manage-links table");
    if(tableBody && tableBody.nodeName.toLocaleUpperCase() === "TABLE"){
        tableBody = tableBody.children[0];
        if(tableBody && dataManager.getType() === "BM"){
            tableBody.innerHTML = "";
            // Create TRs
            // Remember to set the ones from the link object (if exists) and to set exportTemplateIndexes then too
        }
    }
}

/**Updates the link stored in the stored object with the one in the input
 * @since 0.1.0-overhaul
 */
function save(){

    // Try to get the URL input and check if it exists
    let urlInput = document.querySelector("#bm-manage-links #url");
    if(!urlInput || urlInput.nodeName.toLocaleUpperCase() !== "INPUT"){ return };

    try{
        const url = new URL((urlInput as HTMLInputElement).value); // Check if is valid URL
        dataManager.addLink({ url: url.toString() })

        updateUI()
    }catch(err){
        charity.lib.sonner.toast.error("The URL provided is not a valid URL")
    }
}

/**Disregards the link in the input and resets it back to the one in the stored object
 * 
 * Resets to an empty field if no link exists
 * @since 0.1.0-overhaul
 */
function cancel(){
    // Try to get the URL input and check if it exists
    let urlInput = document.querySelector("#bm-manage-links #url");
    if(!urlInput || urlInput.nodeName.toLocaleUpperCase() !== "INPUT"){ return };

    const data = (dataManager.get() as TBlueMarbleJSON) // temp variable to shorten the below code
    if(dataManager.getType() === "BM" && data.links && data.links.length > 0){
        (urlInput as HTMLInputElement).value = data.links[0].url; // Currently only support for one url
    }else{
        (urlInput as HTMLInputElement).value = "";
    }
}


/**Adds or removes the given template from the list of templates exported when clicking "Export selected" 
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
*/
function exportToggle(idx: number){
    if(exportTemplateIndexes.includes(idx)){
        // Remove the template index from the array
        exportTemplateIndexes = exportTemplateIndexes.filter((x)=>x===idx);
        return;
    }
    exportTemplateIndexes.push(idx)
}

/**Moves a template up in draw order / ahead in the stored object's templates array
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
 */
function shiftUp(idx: number){
    let temp = dataManager.get() as Schemas
    if(idx >= temp.templates.length){ return }// Bounds checking

    // Swap the template of the given index with the one ahead of it
    [temp.templates[idx], temp.templates[idx+1]] = [temp.templates[idx+1], temp.templates[idx]]
    dataManager.update(temp);

    updateUI()
}

/**Moves a template down in draw order / back in the stored object's templates array
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
 */
function shiftDown(idx: number){
    let temp = dataManager.get() as Schemas
    if(idx === 0){ return } // Bounds checking

    // Swap the template of the given index with the one before it
    [temp.templates[idx], temp.templates[idx-1]] = [temp.templates[idx-1], temp.templates[idx]]
    dataManager.update(temp);

    updateUI()
}

/**Triggers a download of a JSON file containing the templates the user previously selected
 * @since 0.1.0-overhaul
*/
function exportSelected(){
    download(dataManager.getExportableData(exportTemplateIndexes, []))
}

/**Updates the UI of this window
 * @since 0.1.0-overhaul
 */
function updateUI(){
    
    exportTemplateIndexes = [];
    createTableRows();
    // Reload templates
}

/**Initialises this window's UI-related javascript (addEventListener hooks, ect)
 * @since 0.1.0-overhaul
*/
export function initManageLinks(){
    // Add event listener hooks
}