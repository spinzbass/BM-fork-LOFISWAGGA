import { TBlueMarbleTemplate } from "../types/schemas";
import { dataManager, uiManager } from "./main";
import { generateUUID } from "./utils";

// Typescript / Javascript for the "manageTemplates" window

let selectedFile: Blob = new Blob()
let lngLat: { lng: number; lat: number; }
let zoomLevel: number | null = null;

/**Closes this window
 * @since 0.1.0-overhaul
 */
function close(){
    uiManager.close("bm-create-template")
}

/**Gets the coordinates in longitude and latitude of the clicked-on pixel
 * @returns A 4 element long array representing the coordines of the clicked-on pixel or undefined if an error occured
 * @since 0.1.0-overhaul
 */
function getCoords(): number[] | undefined{

    // lngLat and zoomLevel update whenever the user clicks on a pixel
    if(!(lngLat && zoomLevel)){ 
        // If they don't exist, that means the player hasn't clicked on a pixel
        charity.lib.sonner.toast.error("You must select a pixel first");
        return;
    }
    // Convert latitude and longitude into Tx, Ty, Px and Py
    const tilePixel = charity.game.mercator.latLonToTileAndPixel(lngLat.lat, lngLat.lng, zoomLevel!)
    // Combine the tile and pixel coordinates into one array
    return [...tilePixel.tile, ...tilePixel.pixel]
}

/**Sets the value of the coordinate inputs with the value from the clicked on pixel
 * @since 0.1.0-overhaul
 */
function setCoords(){
    
    // Get the coordinates of the clicked-on pixel
    const coords = getCoords();
    console.log(coords)
    
    // Get the container for the coordinate inputs
    const coordsContainer = document.querySelector("#bm-create-template #coords-container");
    if(!coordsContainer){ return }

    // If coords is undefined or its length less than 4
    if(!coords || coords.length < 4){ 
        // Then the player hadn't clicked on a pixel or a different error occured
        charity.lib.sonner.toast.error("Click on a pixel first")
        return;
    }

    let index = 0;

    // Fill in the inputs with data from the gotten coordinates
    coordsContainer.childNodes.forEach((childNode: ChildNode) => {
        if(childNode.nodeName.toLocaleUpperCase() == "INPUT" && index != 4){
            (childNode as HTMLInputElement).value = coords[index].toString();
            index++;
        }
    });
}

/**Gets the data from all the inputs and organises them into the Blue Marble template format
 * @returns The data organised into a Blue Marble template object or undefined if an error occured
 * @since 0.1.0-overhaul
 */
function getNewTemplateData(): TBlueMarbleTemplate | undefined{

    // Tries to get the given elements and checks if they exist
    const coordsContainer = document.querySelector("#bm-create-template #coords-container");
    if(!coordsContainer){ return }
    const nameInput = document.querySelector("#bm-create-template input#name")
    if(!nameInput){ return }
    
    // Get the coordinates from the 4 inputs
    let coords: number[] = [];
    coordsContainer.childNodes.forEach((childNode: ChildNode) => {
    if(childNode.nodeName.toLocaleUpperCase() === "INPUT"){
        // Don't accept empty inputs
        if((childNode as HTMLInputElement).value !== ""){
            try{
                coords.push(Number((childNode as HTMLInputElement).value))
            }catch{}
        }
    }
    });

    // Coordinates should be exactly 4 elements long
    if(coords.length !== 4){
        // If it isn't that means an error occured,
        // Likely caused by malformed data being inputted
        charity.lib.sonner.toast.error("Fill in all the coordinate inputs with numbers"); 
        return;
    }

    // Check if an image was provided
    if(!selectedFile){ 
        charity.lib.sonner.toast.error("Drag or upload an image");
        return;
    }

    // Create a data URL from the file data
    const dataURL = URL.createObjectURL(selectedFile);

    return {
        coords: coords,
        enabled: true,
        uuid: generateUUID(),
        name: (nameInput as HTMLInputElement).value,
        authorID: charity.game.user.data ? charity.game.user.data.id : -1, // Use id -1 if userData doesn't exist (user isn't logged in)
        urlLink: dataURL
    }
}

/**Creates a new template from the data gotten from the inputs
 * @since 0.1.0-overhaul
 */
function createTemplate(){

    const data = getNewTemplateData(); // Data from inputs
    if(!data){ return }
    dataManager.addTemplate(data);
}

/**Initialises this window's UI-related javascript (addEventListener hooks, ect)
 * @since 0.2.0-overhaul
*/
export function initCreateTemplate(){

    // Update the clicked-on pixel variables whenever the user clicks on a pixel
    charity.game.map.on("click", (e)=>{
        lngLat = e.lngLat as {lat: number, lng: number};
        zoomLevel = charity.game.map.getZoom();
    })

    // Try to get elements and connect the appropriate function to the onClick listener
    const closeBtn = document.querySelector("#bm-create-template button#close");
    if(closeBtn){
        closeBtn.addEventListener("click", ()=>close());
    }
    const coordsBtn = document.querySelector("#bm-create-template button#coords");
    if(coordsBtn){
        coordsBtn.addEventListener("click", ()=>setCoords());
    }
    const createBtn = document.querySelector("#bm-create-template button#create");
    if(createBtn){
        createBtn.addEventListener("click", ()=>createTemplate());
    }
}