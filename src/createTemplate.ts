import { TBlueMarbleTemplate } from "../types/schemas";
import { dataManager, uiManager } from "./main";
import { drawTemplateOfIndex } from "./templates";
import { generateUUID } from "./utils";

// Typescript / Javascript for the "createTemplates" window

let selectedFile: File | undefined
let tilePixel: {tile: number[], pixel: number[]}

/**Closes this window
 * @since 0.1.0-overhaul
 */
function close(){
    uiManager.close("bm-create-template")
}

/**Gets the coordinates of the clicked-on pixel
 * @returns A 4 element long array representing the coordines of the clicked-on pixel or undefined if an error occured
 * @since 0.1.0-overhaul
 * @version 2.0
 */
function getCoords(): number[] | undefined{

    // This code will currently take values from the *last* selected pixel
    // If the user deselects a pixel, there will still be data which might cause confusion

    // tilePixel updates whenever the user clicks on a pixel
    if(tilePixel.tile.length != 2 || tilePixel.pixel.length != 2){ 
        // If the .tile or .pixel lengths aren't 2 then something's wrong,
        // which likely means that the player hasn't clicked on a pixel
        charity.lib.sonner.toast.error("You must select a pixel first");
        return;
    }
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
/**Handles the user dropping a file in the window. Sets the selected file
 * @param {DragEvent} e The drop event
 * @since 0.3.0-overhaul
 */
function dropFile(e: DragEvent){

    e.preventDefault() // Prevent default browser behaviour (the file being opened)

    // Check if the item is a file
    if (e.dataTransfer?.items && e.dataTransfer.items[0].kind === "file") {
        // Only get one file, the first one
        selectedFile = (e.dataTransfer.items[0].getAsFile() as File); 
    } else if(e.dataTransfer?.files) {
        // Only get one file, the first one
        selectedFile = e.dataTransfer.files[0];
    }
}


/**This function is triggered whenever the user drags a file over the window
 * @param {DragEvent} e The dragOver event
 * @since 0.3.0-overhaul
 */
function dragOverFile(e: DragEvent){
    // Add functionality
}

/**Handles the onChange functionality of the "upload an image" input. Sets the selected file
 * @param {InputEvent} e The onChange event
 * @since 0.3.0-overhaul
*/
function fileInputChange(e: InputEvent){
    const files = (e.target as HTMLInputElement).files;
    if(!files || files.length === 0){ return }
    selectedFile = files[0]; // Get the file from the input
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
 * @version 2.0
 */
function createTemplate(){

    const data = getNewTemplateData(); // Data from inputs
    if(!data){ return }
    if(dataManager.addTemplate(data)){
        charity.lib.sonner.toast.success("Template added")
        drawTemplateOfIndex(0); // Template is added to the start of the array, so use index 0
    }else{
        charity.lib.sonner.toast.error("Failed to add template")
    }
}

/**Initialises this window's UI-related javascript (addEventListener hooks, ect)
 * @since 0.4.0-overhaul
*/
export function initCreateTemplate(){

    // Update the clicked-on pixel variables whenever the user clicks on a pixel
    charity.game.map.on("click", (e)=>{
        // Convert latitude, longitude and zoom of clicked-on pixel into Tx, Ty, Px and Py
        tilePixel = charity.game.mercator.latLonToTileAndPixel(e.lngLat.lat, e.lngLat.lng, charity.game.map.getZoom())
    })

    // Try to get elements and connect the appropriate function to the corresponding event listener
    const closeBtn = document.querySelector("#bm-create-template button#close");
    if(closeBtn){
        closeBtn.addEventListener("click", ()=>close());
    }
    const coordsBtn = document.querySelector("#bm-create-template button#coords");
    if(coordsBtn){
        coordsBtn.addEventListener("click", ()=>setCoords());
    }
    const fileDrop = document.querySelector("#bm-create-template div#file-drop");
    if(fileDrop){
        fileDrop.addEventListener("dragOver", (e)=>dragOverFile(e as DragEvent));
        fileDrop.addEventListener("drop", (e)=>dropFile(e as DragEvent));
    }
    const fileUpload = document.querySelector("#bm-create-template input#file");
    if(fileUpload){
        fileUpload.addEventListener("change", (e)=>fileInputChange(e as InputEvent))
    }
    const createBtn = document.querySelector("#bm-create-template button#create");
    if(createBtn){
        createBtn.addEventListener("click", ()=>createTemplate());
    }
}