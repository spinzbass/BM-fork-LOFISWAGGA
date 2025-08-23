import { TBlueMarbleJSON, TBlueMarbleTemplate, TCharityTemplate } from "../types/schemas";
import { Schemas } from "../types/types";
import { dataManager, uiManager } from "./main";
import { createElementWithAttributes, download } from "./utils";

// Typescript / Javascript for the "manageTemplates" window

let exportTemplateIndexes: number[] = []

/**Closes this window
 * @since 0.1.0-overhaul
 */
function close(){
    uiManager.close("bm-manage-templates")
}

let tableBody = document.querySelector("#bm-manage-templates table");
if(tableBody && tableBody.nodeName.toLocaleUpperCase() === "TABLE"){
    tableBody = tableBody.children[0];
    if(tableBody && dataManager.getType() === "BM"){
        (dataManager.get() as TBlueMarbleJSON).templates.forEach((template, i)=>{
            const row1 = createElementWithAttributes("tr", {idx: "main-row"});
            const td1 = createElementWithAttributes("td", {textContent: i.toString()});
            const td2 = createElementWithAttributes("td", {textContent: template.name || "unnamed-0"});
            const td3 = document.createElement("td");
            const buttonEnable = createElementWithAttributes("button", {idx: "enable"});
            td3.appendChild(buttonEnable);
            const td4 = document.createElement("td");
            const buttonExportAdd = createElementWithAttributes("button", {idx: "exportAdd"});
            td4.appendChild(buttonExportAdd);
            const td5 = document.createElement("td");
            const shiftsContainer = createElementWithAttributes("div", {className: "shifts-container"});
            const buttonUp = createElementWithAttributes("button", {idx: "up"});
            const buttonDown = createElementWithAttributes("button", {idx: "down"});
            shiftsContainer.append(buttonUp, buttonDown);
            td5.appendChild(shiftsContainer);
            row1.append(td1, td2, td3, td4, td5)
        }
        // <tr idx="">
        //     <td>0</td>
        //     <td>NameTest</td>
        //     <td><button>on</button></td>
        //     <td><button>+</button></td>
        //     <td>
        //         <div class="shifts-container">
        //             <button>&#x1F781;</button>
        //             <button>&#x1F783;</button>
        //         </div>
        //     </td>
        // </tr>
        // <tr class="details hide">
        //     <td colspan="5">
        //         <div>
        //             <p>&#x2937;</p>
        //             <p>Author: Tester</p>
        //             <p>@ 900, 700</p>
        //             <button>Share</button>
        //             <button>Delete</button>
        //         </div>
        //     </td>
        // </tr>
        )
    }
}

/**Creates the rows in the table and populates them with data from the stored object
 * @since 0.1.0-overhaul
 */
function createTableRows(){

    let tableBody = document.querySelector("#bm-manage-templates table");
    if(tableBody && tableBody.nodeName.toLocaleUpperCase() === "TABLE"){
        tableBody = tableBody.children[0];
        if(tableBody && dataManager.getType() === "BM"){
            tableBody.innerHTML = "";
            // Create TRs
        }
    }
}


/**Toggles the enabled state a template of given index
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
 */
function enabledToggle(idx: number){

    let temp = dataManager.get() as Schemas
    temp.templates[idx].enabled = !(temp.templates[idx].enabled);
    dataManager.update(temp)

    // Enable / disable template in overlay
}

/**Adds or removes the given template from the list of templates exported when clicking "Export selected" 
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
*/
function exportToggle(idx: number){

    if(exportTemplateIndexes.includes(idx)){
        // Removes the template index from the array
        exportTemplateIndexes = exportTemplateIndexes.filter((x)=>x===idx);
        return;
    }
    exportTemplateIndexes.push(idx)
}

/**Creates a one-click shareable link for the given template and copies it to the clipboard
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
 */
function shareTemplate(idx: number){
    try{
        const stringifedData = JSON.stringify(dataManager.getExportableData([idx], []));
        const currentURL = window.location.origin + window.location.pathname; // Get the current URL
        const searchParams = new URLSearchParams();
        // Add the template location to the search params
        // Add the data to the search params
        searchParams.set("bmShare", stringifedData);

        navigator.clipboard.writeText(currentURL+searchParams.toString()); // Copy the link to the clipboard

        charity.lib.sonner.toast.success("Share link copied to clipboard")
    }
    catch{ charity.lib.sonner.toast.error("Creating share link failed") }
}

/**Removes a template of the given index from the stored object
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
 */
function deleteTemplate(idx: number){

    let temp = dataManager.get() as Schemas
    temp.templates.splice(idx,1); // Delete the template
    dataManager.update(temp)

    updateUI()
}

/**Moves a template up in draw order / ahead in the stored object's templates array
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
 */
function shiftUp(idx: number){

    let temp = dataManager.get() as Schemas
    if(idx >= temp.templates.length){ return } // Bounds checking

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

/**Triggers a download of a JSON file containing all the user's templates
 * @since 0.1.0-overhaul
 */
function exportAll(){

    if(dataManager.getType() !== "BM"){ return }
    download(dataManager.getExportableData(undefined, []))
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
export function initManageTemplates(){
    
    // Add event listener hooks
}