import { Schemas, SchemaTypeNames } from "../types/types";
import { BlueMarbleJSON, CharityJSON, BM_SCHEMA_VERSION, TBlueMarbleJSON, TCharityJSON, CHA_SCHEMA_VERSION, TBlueMarbleTemplate, TBlueMarbleLink } from "../types/schemas";

/**A manager that manages the general data object (templates, links, ect.)
 * 
 * Supports functionality related to appending, storing locally, updating, converting, type-checking and object creation (template, links)
 * @since 0.1.0-overhaul
 */
export default class DataManager {
    constructor(object?: Schemas){
        // Assign the data to the stored object
        this.object = object;
        if(object){
            // Set the appropriate schema type
            // This allows for a string check instead of schema parse check
            if(CharityJSON.safeParse(object).success){this.type = "CHA"}
            else if(BlueMarbleJSON.safeParse(object).success){this.type = "BM"}
            else {this.type = "N/A"} // Type of the object is unknown
        }
    }
    private object?: Schemas; // Stored object

    private type: SchemaTypeNames; // String variable representing the type / schema of the stored object

    /**Updates the stored object whilst making sure the type matches
     * @param {Schemas} data The data used to update the stored object
     * @returns A boolean representing whether the function succeeded
     * @since 0.1.0-overhaul
     * @version 1.1
     */
    update(data: Schemas): boolean{

        // Match the stored type to the type of schema
        if(BlueMarbleJSON.safeParse(data).success){this.type = "BM"}
        else if(CharityJSON.safeParse(data).success){this.type = "CHA"}
        else { return false } // If it doesn't match any known schema, then disregard the data

        // Assign the data to the stored object
        this.object = data;

        this.gmStore();

        return true;
    }
    /**Gets the stored object
     * @returns The stored object
     * @since 0.1.0-overhaul
     */
    get(): Schemas | undefined{
        return this.object;
    }

    /**Gets the stored type of the stored object 
     * @returns A string representing the type of schema / format (see types.ts)
     * @since 0.1.0-overhaul
    */
    getType(): SchemaTypeNames{
        return this.type;
    }

    /** Converts the current object in the format of any schema into the format of Charity's schema.
     * 
     * Only runs if the stored object's type is known
     * @returns A boolean representing whether the function succeeded
     * @since 0.1.0-overhaul
     * @version 1.1
    */
    toCharitySchema(): boolean{

        if(this.type === "N/A"){ return false };

        // If the schema type is already correct, don't do any conversions
        if(this.type === "CHA"){ return  true };

        if(this.type === "BM"){
            this.object = this.object as TBlueMarbleJSON; // Type is BM so treat the object as a Blue Marble object
            this.object = {
                meta:{
                    whoami: "BlueCharityPro", // Identifies the type of JSON format
                    schemaVersion: CHA_SCHEMA_VERSION,
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
        return true;
    }

    /** Converts the current object in the format of any schema into the format of Blue Marble's schema.
     * 
     * Only runs if the stored object's type is known
     * @returns A boolean representing whether the function succeeded
     * @since 0.1.0-overhaul
     * @version 1.1
    */
    toBlueMarbleSchema(): boolean{

        if(this.type === "N/A"){ return false };

        // If the schema type is already correct, don't do any conversions
        if(this.type === "BM"){ return  true };

        if(this.type === "CHA"){
            this.object = this.object as TCharityJSON; // Type is CHA so treat the object as a Charity object
            this.object = {
                whoami: "BlueMarble", // Identifies the type of JSON format
                schemaVersion: BM_SCHEMA_VERSION,
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
        return true;
    }

    /** Appends non-meta data from the provided object into the stored object. Only runs if the stored object is in Blue Marble's JSON format
     * @param {Schemas} object Object from which the appended data is taken
     * @returns A boolean representing whether the function succeeded
     * @since 0.1.0-overhaul
     * @version 1.1
    */
    appendData(object: Schemas): boolean{

        if(this.type !== "BM"){ return false }; // Only append object if the stored object is in Blue Marble's JSON format
        this.object = this.object as TBlueMarbleJSON

        // If the provided object is in Charity's format
        if(CharityJSON.safeParse(object).success){
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
        else if(BlueMarbleJSON.safeParse(object).success){
            // Then just append the data, no format change necessary
            object = object as TBlueMarbleJSON
            this.object.templates.push(...object.templates);
            if(!this.object.links){ this.object.links = object.links} // If the stored object doesn't have a links array yet, create / set it with the appended data
            else if(object.links){ this.object.links.push(...object.links) } // Check if appended data has a links array, otherwise the spread operator might cause errors or undefined behaviour
        }

        this.gmStore();
        return true;
    }

    /**Appends template data gotten from a URL, appropriately marking the orign link / url on each of the templates.
     * 
     * Only runs if the stored object is in Blue Marble's JSON format
     * @param {TBlueMarbleJSON} data The data gotten from the URL
     * @param {string} url The URL from which the data came from
     * @returns A boolean representing whether the function succeeded
     * @since 0.1.0-overhaul
     * @version 1.1
    */
    appendTemplateDataFromURL(data: TBlueMarbleJSON, url: string): boolean {

        if(this.type !== "BM") { return false }; // Only append object if the stored object is in Blue Marble's JSON format
        this.object = this.object as TBlueMarbleJSON

        const importedTemplates = data.templates;
        // Set the template origin links
        importedTemplates?.map((template: TBlueMarbleTemplate) => ({ ...template, originLink: url }));
        
        const templatesCopy = this.object.templates;
        let removed = 0; // Removed counter to not mess up indexing
    
        // Append the templates while keeping draw order
        for(const [i, template] of this.object.templates.entries()){
            if(importedTemplates.length === 0){ break; }
            if(template.originLink !== url){ continue }
    
            const idx = importedTemplates.findIndex((elem)=>elem.authorID === template.authorID && elem.uuid === template.uuid);
            if(idx !== -1){
                // If the imported data has this template remove it to not loop over it anymore and not append it later
                // We don't do anything in order to keep draw order
                importedTemplates.splice(idx,1);
            }else{
                // If the imported data doesn't have this template, remove it from the templates list
                templatesCopy.splice(removed+i, 1)
                removed++;
            }
        }
    
        if(importedTemplates.length !== 0){
            // Append imported templates that weren't already in the templates array
            templatesCopy.push(...importedTemplates);
        }
    
        // Update the stored object's templates with the new array
        this.object.templates = templatesCopy;
    
        this.gmStore();
        return true;
    }

    /**Prepends the provided template to the list of templates. 
     * Only runs if the stored object is in Blue Marble's JSON format
     * @param {TBlueMarbleTemplate} template The template data that is appended.
     * @returns A boolean representing whether the operation was successful
     * @since 0.1.0-overhaul
     * @version 1.1
    */
    addTemplate(template: TBlueMarbleTemplate): boolean{

        if(this.type !== "BM"){ return false } // Only append if the stored object is in Blue Marble's JSON format
        (this.object as TBlueMarbleJSON).templates.unshift(template);
        
        this.gmStore();

        return true;
    }

    /**Appends the provided link object to the list of links. 
     * If the stored object's links property doesn't exist, then creates it. 
     * 
     * Only runs if the stored object is in Blue Marble's JSON format
     * @param {TBlueMarbleLink} link The link object data that is appended.
     * @returns A boolean representing whether the function succeeded
     * @since 0.1.0-overhaul
     * @version 1.1
    */
    addLink(link: TBlueMarbleLink): boolean{

        if(this.type !== "BM"){ return false } // Only append if the stored object is in Blue Marble's JSON format
        this.object = this.object as TBlueMarbleJSON

        if(!this.object.links){ // Create links if it doesn't exist
            this.object.links = [link];
            return true;
        }

        this.object.links.push(link);
        
        this.gmStore();
        
        return true;
   }

    /** Takes in paramaters used to modify or filter data to create a desired subset of data, ready to be exported
     * @param {number[] | undefined} templateIndexes A list of indexes representing which templates to export, if omitted exports all templates, if empty exports none
     * @param {number[] | undefined} linkIndexes A list of indexes representing which links to export, if omitted exports all links, if empty exports none
     * @returns {Schemas | undefined} An object matching the provided parameters. If the stored object is undefined then so is the returned value
     * @since 0.1.0-overhaul
     */
    getExportableData(templateIndexes?: number[], linkIndexes?: number[]): Schemas | null{

        if(this.type === "N/A") { return null } // Return nothing if the type of the stored object is unknown

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
                // Gets an array of links at the given indexes (provided the index has a correguct value)
                links: linkIndexes ?
                    linkIndexes.map((idx)=>
                        // Bounds and index value checking
                        Number.isInteger(idx) && idx >= 0 && typedCopy.links.length < idx? 
                        typedCopy.links[idx] as any : false)
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

    /**Stores the current object in local GM storage. Only runs if the stored object is in Blue Marble's JSON format
     * @returns A boolean representing whether the function succeeded
     * @since 0.1.0-overhaul
     * @version 1.1
     */
    gmStore(): boolean{

        if(this.type !== "BM"){ return false }; // Only store objects in Blue Marble's JSON format
        this.object = this.object as TBlueMarbleJSON
        // Store logic

        return true;
    }
}

/** Converts an object in the format of any schema into the format of Blue Marble's schema
 * @param {Schemas} object The object that is converted
 * @returns The object converted into Blue Marble's schema
 * @since 0.1.0-overhaul
 */
function toBlueMarbleSchema(object: Schemas): TBlueMarbleJSON{

    if(BlueMarbleJSON.parse(object)){ return object as TBlueMarbleJSON }

    if(CharityJSON.parse(object)){
        object = object as TCharityJSON
        return {
                whoami: object.meta.whoami, // Identifies the type of JSON format
                schemaVersion: BM_SCHEMA_VERSION,
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
 * @returns The object converted into the shared JSON's schema
 * @since 0.1.0-overhaul
 */
function toCharitySchema(object: Schemas): TCharityJSON{

    if(CharityJSON.parse(object)){ return object as TCharityJSON}

    if(BlueMarbleJSON.parse(object)){
        object = object as TBlueMarbleJSON
        return {
                meta:{
                    whoami: "BlueCharityPro", // Identifies the type of JSON format
                    schemaVersion: CHA_SCHEMA_VERSION,
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