import { TBlueMarbleJSON, TCharityJSON } from "./schemas";

export type Schemas = TCharityJSON | TBlueMarbleJSON;
export type SchemaTypeNames = "CHA" | "BM" | "N/A"; // Charity, BlueMarble or unknown