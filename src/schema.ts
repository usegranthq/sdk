import { z } from 'zod';

const FOURTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

export const createProviderSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be less than 50 characters long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 100 characters long'),
});

export const createClientSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be less than 50 characters long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 100 characters long'),
});

export const createTokenSchema = z.object({
  expiresIn: z.number().max(FOURTY_EIGHT_HOURS, 'Expires in must be less than 48 hours'),
  useJwtType: z.boolean(),
  audienceAsArray: z.boolean(),
  forceDefaultDomain: z.boolean(),
});

export const createTenantSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 200 characters long'),
});

export const createTenantProviderSchema = z.object({
  url: z
    .string({ required_error: 'Please provide a provider URL.' })
    .trim()
    .url({ message: 'Please provide a valid URL.' })
    .transform((url) => url.replace(/\/$/, '')),
  fingerprints: z
    .array(
      z
        .string({ required_error: 'Please provide the provider fingerprint.' })
        .min(32, { message: 'Fingerprint must be at least 32 characters long.' })
        .max(64, { message: 'Fingerprint must be at most 64 characters long.' }),
    )
    .min(1, { message: 'At least one fingerprint is required.' })
    .max(5, { message: 'At most 5 fingerprints are allowed.' }),
  audience: z
    .string({ required_error: 'Please provide the provider audience.' })
    .min(3, { message: 'Provider audience must be at least 3 characters long.' })
    .max(100, { message: 'Provider audience must be at most 100 characters long.' })
    .trim(),
  earliestIssuanceTimeAllowed: z
    .number({ required_error: 'Please provide the earliest issuance time allowed.', coerce: true })
    .min(0, { message: 'Earliest issuance time allowed must be at least 0.' })
    .max(12, { message: 'Earliest issuance time allowed must be at most 12.' }),
});
