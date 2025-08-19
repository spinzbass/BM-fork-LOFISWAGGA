import { TBlueMarbleJSON } from "../types/schemas";
import { Schemas } from "../types/types";
import { dataManager } from "./main";
import { createElementWithAttributes, download } from "./utils";
let tableBody = document.querySelector("#bm-manage-templates table");
if(tableBody && tableBody.nodeName.toLocaleUpperCase() === "TABLE"){
    tableBody = tableBody.children[0];
    if(tableBody && dataManager.getType() === "BM"){
        (dataManager.get() as TBlueMarbleJSON).templates.forEach((template, i)=>{
            const row1 = createElementWithAttributes("tr", {id: "main-row"});
            const td1 = createElementWithAttributes("td", {textContent: i.toString()});
            const td2 = createElementWithAttributes("td", {textContent: template.name || "unnamed-0"});
            const td3 = document.createElement("td");
            const buttonEnable = createElementWithAttributes("button", {id: "enable"});
            td3.appendChild(buttonEnable);
            const td4 = document.createElement("td");
            const buttonExportAdd = createElementWithAttributes("button", {id: "exportAdd"});
            td4.appendChild(buttonExportAdd);
            const td5 = document.createElement("td");
            const shiftsContainer = createElementWithAttributes("div", {className: "shifts-container"});
            const buttonUp = createElementWithAttributes("button", {id: "up"});
            const buttonDown = createElementWithAttributes("button", {id: "down"});
            shiftsContainer.append(buttonUp, buttonDown);
            td5.appendChild(shiftsContainer);
            row1.append(td1, td2, td3, td4, td5)
        }
        // <tr id="">
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

let exportTemplateIndexes: number[] = []
function enabledToggle(id: number){
    let temp = dataManager.get() as Schemas
    temp = {
        ...temp,
        templates: temp.templates.map((template, i)=> i === id ? {...template, enabled: !template.enabled} : template)
    }
    dataManager.update(temp)
    // Enable / disable template in overlay
}
function exportToggle(id: number){
    if(exportTemplateIndexes.includes(id)){
        exportTemplateIndexes = exportTemplateIndexes.filter((x)=>x===id);
        return;
    }
    exportTemplateIndexes.push(id)
}
function shareTemplate(id: number){
    dataManager.getExportableData([id], []) // make link from this data
}
function deleteTemplate(id: number){
    let temp = dataManager.get() as Schemas
    temp.templates.splice(id,1);
    dataManager.update(temp)
    reload()
}
function shiftUp(id: number){
    let temp = dataManager.get() as Schemas
    if(id >= temp.templates.length){return}
    [temp.templates[id], temp.templates[id+1]] = [temp.templates[id+1], temp.templates[id]]
    dataManager.update(temp);
    reload()
}
function shiftDown(id: number){
    let temp = dataManager.get() as Schemas
    if(id >= temp.templates.length){return}
    [temp.templates[id], temp.templates[id-1]] = [temp.templates[id-1], temp.templates[id]]
    dataManager.update(temp);
    reload()
}
function exportAll(){
    if(dataManager.getType() !== "BM"){ return }
    download(dataManager.getExportableData(undefined, []))
}
function exportSelected(){
    download(dataManager.getExportableData(exportTemplateIndexes, []))
}
function reload(){
    exportTemplateIndexes = [];
    createTableRows();
    // Reload templates
}