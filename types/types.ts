import { TBlueMarbleJSON, TCharityJSON } from "./schemas";

export type Schemas = TCharityJSON | TBlueMarbleJSON;
export type SchemaTypeNames = "CHA" | "BM" | "N/A"; // Charity, BlueMarble or unknown
export type WindowNames = "bm-manage-templates" | "bm-manage-links" | "bm-create-template" | "bm-main-overlay"