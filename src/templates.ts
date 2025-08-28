import { TBlueMarbleJSON, TBlueMarbleTemplate } from "../types/schemas";
import { dataManager } from "./main";

/** Draws a singular template of the given index. Only runs if the dataManager object is in Blue marble format
 * @param {number} idx The index of the template in the dataManager object
 * @since 0.4.0-overhaul
 */
function drawTemplateOfIndex(idx: number){

    // Only deal with data in Blue Marble's format
    if(dataManager.getType() !== "BM"){ return };

    // Bounds checking
    if(idx < 0 || idx > (dataManager.get() as TBlueMarbleJSON).templates.length){ return };

    drawTemplate((dataManager.get() as TBlueMarbleJSON).templates[idx]);
}

/** Draws all the templates in the dataManager object. Only runs if the dataManager object is in Blue marble format
 * @since 0.4.0-overhaul
 */
function drawAllTemplates(){
    
    // Only deal with data in Blue Marble's format
    if(dataManager.getType() !== "BM"){ return };

    (dataManager.get() as TBlueMarbleJSON).templates.forEach((template=>{
        drawTemplate(template)
    }))

}

/** Draws a template onto the map / canvas
 * @param {TBlueMarbleTemplate} template The template data in Blue Marble's JSON format
 * @since 0.4.0-overhaul
 */
function drawTemplate(template: TBlueMarbleTemplate){
    // Draw the template
}
