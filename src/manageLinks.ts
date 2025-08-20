import { ur } from "zod/v4/locales";
import { Schemas } from "../types/types";
import { dataManager } from "./main";
import { download } from "./utils";
import { TBlueMarbleJSON } from "../types/schemas";

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
let exportTemplateIndexes: number[] = []

const ErrorText = document.querySelector("#bm-manage-links #error-text")

function save(){
    let urlInput = document.querySelector("#bm-manage-links #url");
    if(!urlInput || urlInput.nodeName.toLocaleUpperCase() !== "INPUT"){ return };

    try{
        const url = new URL((urlInput as HTMLInputElement).value);
        dataManager.addLink({ url: url.toString() })

        reload()
    }catch(err){
        if(ErrorText){
            ErrorText.textContent = "Provided input is not a valid URL" // Transform to Toast
        }
    }
}

function cancel(){
    let urlInput = document.querySelector("#bm-manage-links #url");
    if(!urlInput || urlInput.nodeName.toLocaleUpperCase() !== "INPUT"){ return };

    const temp = (dataManager.get() as TBlueMarbleJSON)
    if(dataManager.getType() === "BM" && temp.links && temp.links.length > 0){
        (urlInput as HTMLInputElement).value = temp.links[0].url;
    }else{
        (urlInput as HTMLInputElement).value = "";
    }
}

function reload(){
    exportTemplateIndexes = [];
    createTableRows();
    // Reload templates
}

function exportToggle(id: number){
    if(exportTemplateIndexes.includes(id)){
        exportTemplateIndexes = exportTemplateIndexes.filter((x)=>x===id);
        return;
    }
    exportTemplateIndexes.push(id)
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

function exportSelected(){
    download(dataManager.getExportableData(exportTemplateIndexes, []))
}