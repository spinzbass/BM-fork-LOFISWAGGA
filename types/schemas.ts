import z from "zod/v3";


// "^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$" is Regex to only match a version in semver compliant format

export const CharityJSON = z.object({
  meta: z.object({
    whoami: z.literal('BlueCharityPro'), // Identifies the type of JSON format
    schemaVersion: z.string().refine((version) => version.match("^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$")),
    scriptVersion: z
      .string()
      .refine((version) => version.match("^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$"))
      .optional(),
  }),
  // Which alliance was this JSON created by
  alliance: z.object({
    name: z.string(),
    contact: z.string(),
  }).optional(),
  templates: z.array(
    z.object({
      name: z.string().optional(), // Name of the template
      enabled: z.boolean(),
      // Location of the template
      coords: z.object({
        tx: z.number(),
        ty: z.number(),
        px: z.number(),
        py: z.number(),
      }),
      sources: z.array(z.string()), // File data of the template's image
      author: z.number().optional(), // Numerical ID of the author, taken from wplace
      // Animation object used for overlays that support animations
      animation: z
        .object({
          frameWidth: z.number().optional(),
          frameHeight: z.number().optional(),
          frameCount: z.number().optional(),
          secondsPerFrame: z.number().optional(),
          frameRate: z.number().optional(),
          frameSpeed: z.number().optional(),
          startTimestamp: z.number().optional(),
          startTime: z.number().optional(),
          looping: z.boolean().optional(),
        })
        .optional(),
      uuid: z.string(), // UUID to distinguish templates made by the same author
    })
  ),
  whitelist: z.array(
    z.object({
      name: z.string().optional(),
      url: z.string(),
    })
  ),
  blacklist: z.array(
    z.object({
      name: z.string().optional(),
      url: z.string(),
    })
  ),
});

export const BlueMarbleTemplate = z.object({
  name: z.string().optional(), // Name of the template
  coords: z.array(z.number()), // 4 element array containing the location of the template
  authorID: z.number().optional(), // Numerical ID of the author, taken from wplace
  enabled: z.boolean(),
  urlLink: z.string().optional(), // Link to the template image's file data
  originLink: z.string().optional(), // The link from which a template was imported. Undefined if the template is local
  uuid: z.string(), // UUID to distinguish templates made by the same author
})

export const BlueMarbleLink = z.object({
  name: z.string().optional(), // Name of URL
  url: z.string(),
})

export const BlueMarbleJSON = z.object({
  whoami: z.string().refine((whoami)=>whoami.includes("BlueMarble")), // Identifies the type of JSON format
  scriptVersion: z
    .string()
    .refine((version) => version.match("^0|([1-9]\d*)([.](0|([1-9]\d*))){2}$"))
    .optional(),
  schemaVersion: z.string().refine((version) => version.match("^0|([1-9]\d*)([.](0|([1-9]\d*))){2}$")),
  templates: z.array(BlueMarbleTemplate),
  links: z.array(BlueMarbleLink).optional(),
})

export type TCharityJSON = z.infer<typeof CharityJSON>; // Creates a type matching the schema for better typesafety
export type TBlueMarbleJSON = z.infer<typeof BlueMarbleJSON>; // Creates a type matching the schema for better typesafety
export type TBlueMarbleTemplate = z.infer<typeof BlueMarbleTemplate>; // Creates a type matching the schema for better typesafety
export type TBlueMarbleLink = z.infer<typeof BlueMarbleLink>; // Creates a type matching the schema for better typesafety

export const CHA_SCHEMA_VERSION = "0.1.0"
export const BM_SCHEMA_VERSION = "0.1.0"

export const EMPTY_BLUE_MARBLE_JSON: TBlueMarbleJSON = {
  whoami: "BlueMarble",
  schemaVersion: BM_SCHEMA_VERSION,
  templates: [],
}