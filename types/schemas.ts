import z from "zod/v3";

export const CharityJSON = z.object({
  meta: z.object({
    whoami: z.string(),
    schemaVersion: z.string().refine((version) => version.match("^0|([1-9]\d*)([.](0|([1-9]\d*))){2}$")),
    scriptVersion: z
      .string()
      .refine((version) => version.match("^0|([1-9]\d*)([.](0|([1-9]\d*))){2}$"))
      .optional(),
  }),
  alliance: z.object({
    name: z.string(),
    contact: z.string(),
  }).optional(),
  templates: z.array(
    z.object({
      name: z.string().optional(),
      enabled: z.boolean(),
      coords: z.object({
        tx: z.number(),
        ty: z.number(),
        px: z.number(),
        py: z.number(),
      }),
      sources: z.array(z.string()),
      author: z.number().optional(),
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
      uuid: z.string(),
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

