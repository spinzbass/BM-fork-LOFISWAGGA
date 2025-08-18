import { TBlueMarbleJSON, TCharityJSON } from "./schemas";

// The Context objects contains data to be passed into the inject function that can only be accessed outside of it
export type Context = {
    HTMLData?: string;
    CSSUrl?: string;
}



export type Schemas = TCharityJSON | TBlueMarbleJSON;
export type SchemaTypeNames = "CHA" | "BM" | "N/A"; // Charity, BlueMarble or unknown