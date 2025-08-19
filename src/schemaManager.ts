import { Schemas, SchemaTypeNames } from "../types/types";
import { BlueMarbleJSON, CharityJSON, TBlueMarbleJSON, TCharityJSON } from "../types/schemas";

class DataManager {
    constructor(object?: Schemas){
        this.object = object;
        if(object){
            // Set the appropriate schema type
            // This allows for a string check instead of schema parse check
            if(CharityJSON.safeParse(object).success){this.type = "CHA"}
            else if(BlueMarbleJSON.safeParse(object).success){this.type = "BM"}
            else {this.type = "N/A"} // Type of the object is unknown
        }
    }
    object?: Schemas; // Stored object
    type: SchemaTypeNames; // String variable representing the type / schema of the stored object

    /** Converts the current object in the format of any schema into the format of Charity's schema */
    toCharitySchema(){
        if(this.type === "N/A" || this.type === "CHA"){return;} // If the schema type is unknown or already correct, don't do any conversions
        if(this.type === "BM"){
            this.object = this.object as TBlueMarbleJSON; // Type is BM so treat the object as a Blue Marble object
            this.object = {
                meta:{
                    whoami: "Charity", // Identifies the type of JSON format
                    schemaVersion: this.object.schemaVersion,
                    scriptVersion: this.object.scriptVersion,
                },
                templates: this.object.templates.map((template)=>({
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
                    author: template.authorID, // Numerical ID of the author, taken from wplace
                    uuid: template.uuid, // UUID to distinguish templates made by the same author
                })),
                whitelist: [],
                blacklist: [],
            };
        }
        this.type = "CHA"; // Update the type to match
    }

    /** Converts the current object in the format of any schema into the format of Blue Marble's schema */
    toBlueMarbleSchema(){
        if(this.type === "N/A" || this.type === "BM"){return;} // If the schema type is unknown or already correct, don't do any conversions
        if(this.type === "CHA"){
            this.object = this.object as TCharityJSON; // Type is CHA so treat the object as a Charity object
            this.object = {
                whoami: "BlueMarble", // Identifies the type of JSON format
                schemaVersion: this.object.meta.schemaVersion,
                scriptVersion: this.object.meta.scriptVersion,
                templates: this.object.templates.map((template)=>({
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

    /** Appends non-meta data from the provided object into the stored object 
     * @param {Schemas} object Object from which the appended data is taken
    */
    appendData(object: Schemas){
        if(this.type !== "BM"){ return; }; // Only append object if the stored object is in Blue Marble's format
        this.object = this.object as TBlueMarbleJSON
        // If the provided object is in Charity's format
        if(CharityJSON.parse(object)){
            // Then we have to convert the template data to Blue Marble's format and then append the data
            object = object as TCharityJSON;
            this.object.templates.push(...object.templates.map((template)=>({
                name: template.name, // Name of the template
                // Charity stores coordinates in an object, so we convert it to an array valuesz
                coords: Object.values(template.coords),
                idUser: template.author, // Numerical ID of the author, taken from wplace
                enabled: template.enabled,
                urlLink: template.sources[0], // Link to the template image's file data
                uuid: template.uuid // UUID to distinguish templates made by the same author
            })))
        }
        // If the object is already in Blue Marble's format
        else if(BlueMarbleJSON.parse(object)){
            // Then just append the data, no format change necessary
            object = object as TBlueMarbleJSON
            this.object.templates.push(...object.templates);
            if(!this.object.links){ this.object.links = object.links} // If the stored object doesn't have a links array yet, create / set it with the appended data
            else if(object.links){ this.object.links.push(...object.links) } // Check if appended data has a links array, otherwise the spread operator might cause errors or undefined behaviour
        }
    }

    /** Takes in paramaters used to modify or filter data to create a desired subset of data, ready to be exported
     * @param {number[] | undefined} templateIndexes A list of indexes representing which templates to export, if omitted exports all templates, if empty exports none
     * @param {number[] | undefined} linkIndexes A list of indexes representing which links to export, if omitted exports all links, if empty exports none
     * @returns {Schemas | undefined} An object matching the provided parameters. If the stored object is undefined then so is the returned value
     */
    getExportableData(templateIndexes?: number[], linkIndexes?: number[]): Schemas | null{
        if(this.type === "N/A") { return null} // Return nothing if the type of the stored object is unknown
        if((this.object as Schemas).hasOwnProperty("links")){
            const typedCopy = this.object as Schemas & {links: any[]}
            return {
                ...typedCopy,
                // Gets an array of templates at the given indexes (provided the index has a correct value)
                templates: templateIndexes ? 
                    templateIndexes.map((idx)=>
                        // Bounds and index value checking
                        Number.isInteger(idx) && idx >= 0 && typedCopy.templates.length < idx? 
                        typedCopy.templates[idx] as any : false)
                        .filter(Boolean) // Filter out entries that had an index with an incorrect value
                : typedCopy.templates,
                // Gets an array of links at the given indexes (provided the index has a correct value)
                links: linkIndexes ?
                    linkIndexes.map((idx)=>
                        // Bounds and index value checking
                        Number.isInteger(idx) && idx >= 0 && typedCopy.templates.length < idx? 
                        typedCopy.templates[idx] as any : false)
                        .filter(Boolean) // Filter out entries that had an index with an incorrect value
                : typedCopy.links
            }
        }
        const typedCopy = this.object as Schemas
        return {
            ...typedCopy,
            // Gets an array of templates at the given indexes (provided the index has a correct value)
            templates: templateIndexes ? 
            templateIndexes.map((idx)=>
                // Bounds and index value checking
                Number.isInteger(idx) && idx >= 0 && typedCopy.templates.length < idx? 
                typedCopy.templates[idx] as any : false)
            .filter(Boolean) // Filter out entries that had an index with an incorrect value
            : typedCopy.templates,
            
        }

    }
}

/** Converts an object in the format of any schema into the format of Blue Marble's schema
 * @param {Schemas} object The object that is converted.
 */
function toBlueMarbleSchema(object: Schemas): TBlueMarbleJSON{
    if(BlueMarbleJSON.parse(object)){ return object as TBlueMarbleJSON }
    if(CharityJSON.parse(object)){
        object = object as TCharityJSON
        return {
                whoami: object.meta.whoami, // Identifies the type of JSON format
                schemaVersion: object.meta.schemaVersion,
                scriptVersion: object.meta.scriptVersion,
                templates: object.templates.map((template)=>({
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
    return object as TBlueMarbleJSON
}

/** Converts object in the format of any schema into the format of Charity's schema
 * @param {Schemas} object The object that is converted.
 */
function toCharitySchema(object: Schemas): TCharityJSON{
    if(CharityJSON.parse(object)){ return object as TCharityJSON}
    if(BlueMarbleJSON.parse(object)){
        object = object as TBlueMarbleJSON
        return {
                meta:{
                    whoami: object.whoami, // Identifies the type of JSON format
                    schemaVersion: object.schemaVersion,
                    scriptVersion: object.scriptVersion,
                },
                templates: object.templates.map((template)=>({
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
                    author: template.authorID, // Numerical ID of the author, taken from wplace
                    uuid: template.uuid, // UUID to distinguish templates made by the same author
                })),
                whitelist: [],
                blacklist: [],
            };
    }
    return object as TCharityJSON
}