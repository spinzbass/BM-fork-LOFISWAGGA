import { TBlueMarbleTemplate } from "../types/schemas";
import { dataManager, uiManager } from "./main";
import { generateUUID } from "./utils";

let selectedFile: Blob = new Blob()
let lngLat: { lng: number; lat: number; }
let zoomLevel: number | null = null;

function close(){
    uiManager.close("bm-create-template")
}

function getCoords(): number[]{
    if(!(lngLat && zoomLevel)){ window.charity.lib.sonner.toast.error("You must select a pixel first") }
    const tilePixel = window.charity.game.mercator.latLonToTileAndPixel(lngLat.lat, lngLat.lng, zoomLevel!)
    return [...tilePixel.tile, ...tilePixel.pixel]
}

function setCoords(){
    
    const coords = getCoords();
    console.log(coords)
    const coordsContainer = document.querySelector("#bm-create-template #coords-container");
    if(!coordsContainer){ return }
    if(coords.length < 4){ return }

    let index = 0;
    coordsContainer.childNodes.forEach((childNode: ChildNode) => {
        if(childNode.nodeName.toLocaleUpperCase() == "INPUT" && index != 4){
            (childNode as HTMLInputElement).value = coords[index].toString();
            index++;
        }
    });
}

function getNewTemplateData(): TBlueMarbleTemplate | undefined{

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
        authorID: charity.game.user.data ? charity.game.user.data.id : -1, // Use id -1 if userData doesn't exist (user isn't logged in)
        urlLink: "" // MAKE DATA URL!!
    }
}

function createTemplate(){

    const data = getNewTemplateData();
    if(!data){ return }
    dataManager.addTemplate(data);
}

export function initCreateTemplate(){

    // Add event listener hooks
    window.charity.game.map.on("click", (e)=>{
        console.log(e)
        lngLat = e.lngLat;
        zoomLevel = window.charity.game.map.getZoom();
    })
    const coordsBtn = document.querySelector("#bm-create-template button#coords");
    console.log("coordsBtn: testestsetestseesseetestest ",coordsBtn)
    console.log(coordsBtn?.nodeName)
    console.log(coordsBtn?.nodeName.toLocaleUpperCase() === "BUTTON")
    if(coordsBtn && coordsBtn.nodeName.toLocaleUpperCase() === "BUTTON"){
        coordsBtn.addEventListener("click", ()=>{console.log("test");getCoords()})
    }
}