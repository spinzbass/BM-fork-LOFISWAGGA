import { Schemas } from "../types/types";
import { dataManager, uiManager } from "./main";
import { createElementWithAttributes, download } from "./utils";
import { TBlueMarbleJSON } from "../types/schemas";
import { drawAllTemplates } from "./templates";

// Typescript / Javascript for the "manageTemplates" window

let exportTemplateIndexes: number[] = []

/**Closes this window
 * @since 0.1.0-overhaul
 */
function close(){
    uiManager.close("bm-manage-links")
}

/**Updates the link stored in the stored object with the one in the input
 * @since 0.1.0-overhaul
 * @version 2.0
 */
function save(){

    // Try to get the URL input and check if it exists
    let urlInput = document.querySelector("#bm-manage-links input#url");
    if(!urlInput){ return };

    try{
        const url = new URL((urlInput as HTMLInputElement).value); // Check if is valid URL
        if(dataManager.addLink({ url: url.toString() })){
            updateUI()
            charity.lib.sonner.toast.success("URL added. Reload the page to load templates from the URL")
        }else{
            charity.lib.sonner.toast.error("Adding URL failed")
        }

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
    let urlInput = document.querySelector("#bm-manage-links input#url");
    if(!urlInput){ return };

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

/**Moves a template up in draw order / ahead in the stored object's templates array and reflects the changes on the canvas / map
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
 * @version 2.0
 */
function shiftUp(idx: number){
    let temp = dataManager.get() as Schemas
    if(idx >= temp.templates.length){ return }// Bounds checking

    // Swap the template of the given index with the one ahead of it
    [temp.templates[idx], temp.templates[idx+1]] = [temp.templates[idx+1], temp.templates[idx]]
    dataManager.update(temp);

    updateUI()
    drawAllTemplates(); // Redraw all templates to update draw order
}

/**Moves a template down in draw order / back in the stored object's templates array and reflects the changes on the canvas / map
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
 * @version 2.0
 */
function shiftDown(idx: number){
    let temp = dataManager.get() as Schemas
    if(idx === 0){ return } // Bounds checking

    // Swap the template of the given index with the one before it
    [temp.templates[idx], temp.templates[idx-1]] = [temp.templates[idx-1], temp.templates[idx]]
    dataManager.update(temp);

    updateUI()
    drawAllTemplates(); // Redraw all templates to update draw order
}

/**Triggers a download of a JSON file containing the templates the user previously selected
 * @since 0.1.0-overhaul
*/
function exportSelected(){
    download(dataManager.getExportableData(exportTemplateIndexes, []))
}

/**Creates the rows in the table and populates them with data from the stored object
 * @since 0.2.0-overhaul
 */
function createTableRows(){

    const table = document.querySelector("#bm-manage-templates table");
    if(table && table.nodeName.toLocaleUpperCase() === "TABLE"){
        const tableBody = table.children[0];
        if(tableBody && dataManager.getType() === "BM"){

            // Reset the table body's contents
            tableBody.innerHTML = "";

            // Create the table rows and use them to populate the table body
            (dataManager.get() as TBlueMarbleJSON).templates.forEach((template, i)=>{

                // Create the first, main row
                const row1 = createElementWithAttributes("tr", {id: "main-row"});
                
                // # field
                const td1 = createElementWithAttributes("td", {textContent: i.toString()});
                // Name field
                const td2 = createElementWithAttributes("td", {textContent: template.name || "unnamed"});
                // Export field 
                const td3 = document.createElement("td");
                const exportCheckBox = createElementWithAttributes("input", {
                    id: "exportToggle",
                    type: "checkbox",
                    value: false,
                });
                exportCheckBox.addEventListener("change", ()=>exportToggle(i))
                td3.appendChild(exportCheckBox);
                // Shift template up / down buttons
                const td4 = document.createElement("td");
                const shiftsContainer = createElementWithAttributes("div", {className: "shifts-container"});
                
                const buttonUp = createElementWithAttributes("button", {
                    id: "up",
                    textContent: "&#x1F702;", // 🜂
                });
                buttonUp.addEventListener("click", ()=>shiftUp(i));

                const buttonDown = createElementWithAttributes("button", {
                    id: "down",
                    textContent: "&#x1F704;" // 🜄
                });
                buttonDown.addEventListener("click", ()=>shiftDown(i));

                shiftsContainer.append(buttonUp, buttonDown);
                td4.appendChild(shiftsContainer);

                // Append the table cells to the row
                row1.append(td1, td2, td3, td4);

                tableBody?.append(row1);
            })
        }
    }
}

/**Updates the UI of this window
 * @since 0.1.0-overhaul
 */
function updateUI(){
    
    exportTemplateIndexes = [];
    createTableRows();
}

/**Initialises this window's UI-related javascript (addEventListener hooks, ect)
 * @since 0.2.0-overhaul
*/
export function initManageLinks(){
    
    // Try to get elements and connect the appropriate function to the onClick listener
    const closeBtn = document.querySelector("#bm-manage-links button#close");
    if(closeBtn){
        closeBtn.addEventListener("click", ()=>close());
    }
    const saveBtn = document.querySelector("#bm-manage-links button#save");
    if(saveBtn){
        saveBtn.addEventListener("click", ()=>save());
    }
    const cancelBtn = document.querySelector("#bm-manage-links button#cancel");
    if(cancelBtn){
        cancelBtn.addEventListener("click", ()=>cancel());
    }
    const exportSelectedBtn = document.querySelector("#bm-manage-links button#export-selected");
    if(exportSelectedBtn){
        exportSelectedBtn.addEventListener("click", ()=>exportSelected());
    }

    uiManager.updateFunctions["bm-manage-links"] = updateUI;
}