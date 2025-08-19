import { Schemas, SchemaTypeNames } from "../types/types";
import { BlueMarbleJSON, CharityJSON, TBlueMarbleJSON, TCharityJSON } from "../types/schemas";

class DataManager {
    constructor(data?: Schemas){
        this.data = data;
        if(data){
            // Set the appropriate schema type
            // This allows for a string check instead of schema parse check
            if(CharityJSON.safeParse(data).success){this.type = "CHA"}
            else if(BlueMarbleJSON.safeParse(data).success){this.type = "BM"}
            else {this.type = "N/A"} // Type of data is unknown
        }
    }
    data?: Schemas; // Stored data
    type: SchemaTypeNames; // String variable representing the type / schema of stored data
    /** Converts the current data in the format of any schema into the format of Charity's schema */
    toCharitySchema(){
        if(this.type === "N/A" || this.type === "CHA"){return;} // If the schema type is unknown or already correct, don't do any conversions
        if(this.type === "BM"){
            this.data = this.data as TBlueMarbleJSON; // Type is BM so treat the data as a Blue Marble object
            this.data = {
                meta:{
                    whoami: "Charity", // Identifies the type of JSON format
                    schemaVersion: this.data.schemaVersion,
                    scriptVersion: this.data.scriptVersion,
                },
                templates: this.data.templates.map((template)=>({
                    name: template.name, // Name of the template
                    enabled: template.enabled || false,
                    // Location of the template
                    coords: {
                        tx: template.coords[0],
                        ty: template.coords[1],
                        px: template.coords[2],
                        py: template.coords[3],
                    },
                    sources: [template.urlLink || ""], // File data of the template's image
                    author: template.idUser, // Numerical ID of the author, taken from wplace
                    uuid: template.uuid, // UUID to distinguish templates made by the same author
                })),
                whitelist: [],
                blacklist: [],
            };
        }
        this.type = "CHA"; // Update the type to match
    }
    /** Converts the current data in the format of any schema into the format of Blue Marble's schema */
    toBlueMarbleSchema(){
        if(this.type === "N/A" || this.type === "BM"){return;} // If the schema type is unknown or already correct, don't do any conversions
        if(this.type === "CHA"){
            this.data = this.data as TCharityJSON; // Type is CHA so treat the data as a Charity object
            this.data = {
                whoami: "BlueMarble", // Identifies the type of JSON format
                schemaVersion: this.data.meta.schemaVersion,
                scriptVersion: this.data.meta.scriptVersion,
                templates: this.data.templates.map((template)=>({
                    name: template.name, // Name of the template
                    // Charity stores coordinates in an object, so we get an array of the values in the object
                    coords: Object.values(template.coords),
                    idUser: template.author, // Numerical ID of the author, taken from wplace
                    enabled: template.enabled,
                    urlLink: template.sources[0], // Link to the template image's file data
                    uuid: template.uuid, // UUID to distinguish templates made by the same author
                }))
            }
        }
        this.type = "BM"; // Update the type to match
    }
    appendData(data: Schemas){
        if(this.type !== "BM"){ return; }; // Only append data if the stored data is in Blue Marble's format
        this.data = this.data as TBlueMarbleJSON
        // If the data is in Charity's format
        if(CharityJSON.parse(data)){
            // Then we have to convert the template data to Blue Marble's format and then append the data
            data = data as TCharityJSON;
            this.data.templates.push(...data.templates.map((template)=>({
                name: template.name, // Name of the template
                // Charity stores coordinates in an object, so we convert it to an array valuesz
                coords: Object.values(template.coords),
                idUser: template.author, // Numerical ID of the author, taken from wplace
                enabled: template.enabled,
                urlLink: template.sources[0], // Link to the template image's file data
                uuid: template.uuid // UUID to distinguish templates made by the same author
            })))
        }
        // If the data is already in Blue Marble's format
        else if(BlueMarbleJSON.parse(data)){
            // Then just append the data, no format change necessary
            data = data as TBlueMarbleJSON
            this.data.templates.push(...data.templates);
        }
    }
}

/** Converts data in the format of any schema into the format of Blue Marble's schema
 * @param {Schemas} data Data that is converted.
 */
function toBlueMarbleSchema(data: Schemas): TBlueMarbleJSON{
    if(BlueMarbleJSON.parse(data)){ return data as TBlueMarbleJSON }
    if(CharityJSON.parse(data)){
        data = data as TCharityJSON
        return {
                whoami: data.meta.whoami, // Identifies the type of JSON format
                schemaVersion: data.meta.schemaVersion,
                scriptVersion: data.meta.scriptVersion,
                templates: data.templates.map((template)=>({
                    name: template.name, // Name of the template
                    // Charity stores coordinates in an object, so we get an array of the values in the object
                    coords: Object.values(template.coords),
                    idUser: template.author, // Numerical ID of the author, taken from wplace
                    enabled: template.enabled,
                    urlLink: template.sources[0], // Link to the template image's file data
                    uuid: template.uuid, // UUID to distinguish templates made by the same author
                }))
        }
    }
    return data as TBlueMarbleJSON
}

/** Converts data in the format of any schema into the format of Charity's schema
 * @param {Schemas} data Data that is converted.
 */
function toCharitySchema(data: Schemas): TCharityJSON{
    if(CharityJSON.parse(data)){ return data as TCharityJSON}
    if(BlueMarbleJSON.parse(data)){
        data = data as TBlueMarbleJSON
        return {
                meta:{
                    whoami: data.whoami, // Identifies the type of JSON format
                    schemaVersion: data.schemaVersion,
                    scriptVersion: data.scriptVersion,
                },
                templates: data.templates.map((template)=>({
                    name: template.name, // Name of the template
                    enabled: template.enabled || false,
                    // Location of the template
                    coords: {
                        tx: template.coords[0],
                        ty: template.coords[1],
                        px: template.coords[2],
                        py: template.coords[3],
                    },
                    sources: [template.urlLink || ""], // File data of the template's image
                    author: template.idUser, // Numerical ID of the author, taken from wplace
                    uuid: template.uuid, // UUID to distinguish templates made by the same author
                })),
                whitelist: [],
                blacklist: [],
            };
    }
    return data as TCharityJSON
}