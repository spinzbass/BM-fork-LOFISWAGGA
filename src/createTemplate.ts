import { TBlueMarbleTemplate } from "../types/schemas";
import { dataManager, uiManager } from "./main";
import { generateUUID } from "./utils";

let selectedFile: Blob = new Blob()

function close(){
    uiManager.close("bm-create-template")
}

function getCoords(): number[]{

    // Get coordinates of clicked on pixel
    return []
}

function setCoords(){

    const coordsContainer = document.querySelector("#bm-create-template #coords-container");
    if(!coordsContainer){ return }
    const coords = getCoords();
    if(coords.length < 4){ return }

    let index = 0;
    coordsContainer.childNodes.forEach((childNode: ChildNode) => {
        if(childNode.nodeName.toLocaleUpperCase() == "INPUT" && index != 4){
            (childNode as HTMLInputElement).value = coords[index].toString();
            index++;
        }
    });
}

function getFormData(): TBlueMarbleTemplate | undefined{

    const coordsContainer = document.querySelector("#bm-create-template #coords-container");
    if(!coordsContainer){ return }
    const nameInput = document.querySelector("#bm-create-template input#name")
    if(!nameInput || nameInput.nodeName !== "INPUT"){ return }
    if(selectedFile.size <= 0){ return }
    
    let coords: number[] = [];
    coordsContainer.childNodes.forEach((childNode: ChildNode) => {
    if(childNode.nodeName.toLocaleUpperCase() == "INPUT"){
        try{
            coords.push(Number((childNode as HTMLInputElement).value))
        }catch(err){}
    }
    });
    if(coords.length !== 4){ return }


    return {
        coords: coords,
        enabled: true,
        uuid: generateUUID(),
        name: (nameInput as HTMLInputElement).value,
        authorID: 0, // Add getting the actual author id
        urlLink: "" // MAKE DATA URL!!
    }
}

function createTemplate(){

    const data = getFormData();
    if(!data){ return }
    dataManager.addTemplate(data);
}

export function initCreateTemplate(){
    // Add event listener hooks
}