import { Schemas, SchemaTypeNames } from "../types/types";
import { BlueMarbleJSON, CharityJSON, TBlueMarbleJSON, TCharityJSON } from "../types/schemas";

class SchemaManager {
    constructor(data?: Schemas){
        this.data = data;
        if(data){
            if(CharityJSON.parse(data)){this.type = "CHA"}
            else if(BlueMarbleJSON.parse(data)){this.type = "BM"}
            else {this.type = "N/A"}
        }
    }
    data?: Schemas;
    private type: SchemaTypeNames; 
    toCharity(){
        if(this.type==="CHA"){return;}
        if(BlueMarbleJSON.parse(this.data)){
            this.data = this.data as TBlueMarbleJSON;
            this.data = CharityJSON.parse({
                meta:{
                    whoami: this.data.whoami,
                    schemaVersion: this.data.schemaVersion,
                    scriptVersion: this.data.scriptVersion,
                },
                templates: this.data.templates.map((template)=>({
                    name: template.name,
                    enabled: template.enabled,
                    coords: {
                        tx: template.coords[0],
                        ty: template.coords[1],
                        px: template.coords[2],
                        py: template.coords[3],
                    },
                    sources: [template.urlLink],
                    author: template.idUser,
                    uuid: template.idUser,
                })),
                whitelist: [],
                blacklist: [],
            });
        }
    }
    toBlueMarble(){
        if(this.type==="BM"){return;}
        if(CharityJSON.parse(this.data)){
            this.data = this.data as TCharityJSON;
            this.data = BlueMarbleJSON.parse({
                whoami: this.data.meta.whoami,
                schemaVersion: this.data.meta.schemaVersion,
                scriptVersion: this.data.meta.scriptVersion,
                templates: this.data.templates.map((template)=>({
                    name: template.name,
                    coords: Object.values(template.coords),
                    idUser: template.author,
                    enabled: template.enabled,
                    urlLink: template.sources[0], // IDK about this one
                }))
            })
        }
    }
    appendTemplates(schema: Schemas){
        if(this.type !== "BM"){ return; };
        this.data = this.data as TBlueMarbleJSON
        if(CharityJSON.parse(schema)){
            schema = schema as TCharityJSON;
            this.data.templates.push(...schema.templates.map((template)=>({
                name: template.name,
                coords: Object.values(template.coords),
                idUser: template.author,
                enabled: template.enabled,
                urlLink: template.sources[0], 
            })))
        }
        else if(BlueMarbleJSON.parse(schema)){
            schema = schema as TBlueMarbleJSON
            this.data.templates.push(...schema.templates);
        }
    }
}

function toBlueMarbleSchema(schema: Schemas): TBlueMarbleJSON{
    if(BlueMarbleJSON.parse(schema)){ return schema as TBlueMarbleJSON }
    if(CharityJSON.parse(schema)){
        schema = schema as TCharityJSON
        return BlueMarbleJSON.parse({
                whoami: schema.meta.whoami,
                schemaVersion: schema.meta.schemaVersion,
                scriptVersion: schema.meta.scriptVersion,
                templates: schema.templates.map((template)=>({
                    name: template.name,
                    coords: Object.values(template.coords),
                    idUser: template.author,
                    enabled: template.enabled,
                    urlLink: template.sources[0], // IDK about this one
                }))
        })
    }
    return schema as TBlueMarbleJSON
}

function toCharitySchema(schema: Schemas): TCharityJSON{
    if(CharityJSON.parse(schema)){ return schema as TCharityJSON}
    if(BlueMarbleJSON.parse(schema)){
        schema = schema as TBlueMarbleJSON
        return CharityJSON.parse({
                meta:{
                    whoami: schema.whoami,
                    schemaVersion: schema.schemaVersion,
                    scriptVersion: schema.scriptVersion,
                },
                templates: schema.templates.map((template)=>({
                    name: template.name,
                    enabled: template.enabled,
                    coords: {
                        tx: template.coords[0],
                        ty: template.coords[1],
                        px: template.coords[2],
                        py: template.coords[3],
                    },
                    sources: [template.urlLink],
                    author: template.idUser,
                    uuid: template.idUser,
                })),
                whitelist: [],
                blacklist: [],
            });
    }
    return schema as TCharityJSON
}