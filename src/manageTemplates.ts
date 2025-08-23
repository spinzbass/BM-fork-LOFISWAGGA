import { TBlueMarbleJSON, TBlueMarbleTemplate, TCharityTemplate } from "../types/schemas";
import { Schemas } from "../types/types";
import { dataManager, uiManager } from "./main";
import { coordinatesToLatLng, createElementWithAttributes, download } from "./utils";

// Typescript / Javascript for the "manageTemplates" window

let exportTemplateIndexes: number[] = []

/**Closes this window
 * @since 0.1.0-overhaul
 */
function close(){
    uiManager.close("bm-manage-templates")
}


/**Toggles the enabled state a template of given index
 * @param {number} idx Index of the template
 * @since 0.1.0-overhaul
 */
function enabledToggle(idx: number){

    const temp = dataManager.get() as Schemas
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

/**Flies to the location of the template. The exact location is dictated by the template's coords field
 * @param {number} idx Index of the template
 * @since 0.3.0-overhaul
 */
function flyToTemplate(idx: number){
    const coordsArr = (dataManager.get() as TBlueMarbleJSON).templates[idx].coords;
    const lngLat = coordinatesToLatLng(coordsArr);
    if(!lngLat){ return };
    charity.game.map.flyTo({center: lngLat, zoom: 9}) // Fly to the template's position
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

/**Creates the rows in the table and populates them with data from the stored object
 * @since 0.3.0-overhaul
 */
function createTableRows(){

    const table = document.querySelector("#bm-manage-templates table");
    if(table){
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
                // Enabled field
                const td3 = document.createElement("td");
                const buttonEnable = createElementWithAttributes("button", {
                    id: "enable",
                    // Set the looks and text based on the enabled field
                    textContent: template.enabled ? "on" : "off",
                    className: template.enabled ? "enabled" : "disabled",
                }); 
                buttonEnable.addEventListener("click", ()=>enabledToggle(i));
                td3.appendChild(buttonEnable);
                // Export field 
                const td4 = document.createElement("td");
                const exportCheckBox = createElementWithAttributes("input", {
                    id: "exportToggle",
                    type: "checkbox",
                    value: false,
                });
                exportCheckBox.addEventListener("change", ()=>exportToggle(i))
                td4.appendChild(exportCheckBox);
                // Shift template up / down buttons
                const td5 = document.createElement("td");
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
                td5.appendChild(shiftsContainer);

                // Append the table cells to the row
                row1.append(td1, td2, td3, td4, td5);

                // Create the second, "details" row (opens when the main row is clicked)
                const row2 = createElementWithAttributes("tr", {
                    id: "details-row",
                    className: "hide"
                });

                const tdContainer = createElementWithAttributes("td");
                
                const arrowText = createElementWithAttributes("p", {
                    textContent: "&#x21B3;" // ↳
                })
                const authorText = createElementWithAttributes("p", {textContent: `Authored by ${template.authorID}`})

                const buttonFlyTo = createElementWithAttributes("button", {
                    id: "flyTo",
                    textContent: `@ ${template.coords.join(', ')} ✈️`
                });
                buttonFlyTo.addEventListener("click", ()=>flyToTemplate(i))

                const buttonShare = createElementWithAttributes("button", {id: "share"});
                buttonShare.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M448 256C501 256 544 213 544 160C544 107 501 64 448 64C395 64 352 107 352 160C352 165.4 352.5 170.8 353.3 176L223.6 248.1C206.7 233.1 184.4 224 160 224C107 224 64 267 64 320C64 373 107 416 160 416C184.4 416 206.6 406.9 223.6 391.9L353.3 464C352.4 469.2 352 474.5 352 480C352 533 395 576 448 576C501 576 544 533 544 480C544 427 501 384 448 384C423.6 384 401.4 393.1 384.4 408.1L254.7 336C255.6 330.8 256 325.5 256 320C256 314.5 255.5 309.2 254.7 304L384.4 231.9C401.3 246.9 423.6 256 448 256z"/></svg>` // Share icon svg
                buttonShare.addEventListener("click", ()=>shareTemplate(i));

                const buttonDelete = createElementWithAttributes("button", {id: "delete"});
                buttonDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#e01b24" d="M232.7 69.9C237.1 56.8 249.3 48 263.1 48L377 48C390.8 48 403 56.8 407.4 69.9L416 96L512 96C529.7 96 544 110.3 544 128C544 145.7 529.7 160 512 160L128 160C110.3 160 96 145.7 96 128C96 110.3 110.3 96 128 96L224 96L232.7 69.9zM128 208L512 208L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 208zM216 272C202.7 272 192 282.7 192 296L192 488C192 501.3 202.7 512 216 512C229.3 512 240 501.3 240 488L240 296C240 282.7 229.3 272 216 272zM320 272C306.7 272 296 282.7 296 296L296 488C296 501.3 306.7 512 320 512C333.3 512 344 501.3 344 488L344 296C344 282.7 333.3 272 320 272zM424 272C410.7 272 400 282.7 400 296L400 488C400 501.3 410.7 512 424 512C437.3 512 448 501.3 448 488L448 296C448 282.7 437.3 272 424 272z"/></svg>`; // Trash icon svg
                buttonDelete.addEventListener("click", ()=>deleteTemplate(i));
                
                tdContainer.append(arrowText, authorText, buttonFlyTo, buttonShare, buttonDelete);
                row2.appendChild(tdContainer);

                tableBody?.append(row1, row2);
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
export function initManageTemplates(){

    // Try to get elements and connect the appropriate function to the onClick listener
    const closeBtn = document.querySelector("#bm-manage-templates button#close");
    if(closeBtn){
        closeBtn.addEventListener("click", ()=>close());
    }
    const createBtn = document.querySelector("#bm-manage-templates button#create");
    if(createBtn){
        createBtn.addEventListener("click", ()=>uiManager.open("bm-create-template"));
    }
    const exportAllBtn = document.querySelector("#bm-manage-templates button#export-all")
    if(exportAllBtn){
        exportAllBtn.addEventListener("click", ()=>exportAll());
    }
    const exportSelectedBtn = document.querySelector("#bm-manage-templates button#export-selected");
    if(exportSelectedBtn){
        exportSelectedBtn.addEventListener("click", ()=>exportSelected());
    }

    uiManager.updateFunctions["bm-manage-templates"] = updateUI;
}