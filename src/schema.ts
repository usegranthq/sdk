import { z } from 'zod';

const FOURTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

export const CreateProviderSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be less than 50 characters long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 100 characters long'),
});

export const CreateClientSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be less than 50 characters long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 100 characters long'),
});

export const CreateTokenSchema = z.object({
  expiresIn: z.number().max(FOURTY_EIGHT_HOURS, 'Expires in must be less than 48 hours'),
  useJwtType: z.boolean(),
  audienceAsArray: z.boolean(),
  forceDefaultDomain: z.boolean(),
});

export const CreateTenantSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 200 characters long'),
});

export const CreateTenantProviderSchema = z.object({
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

export const ProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export const TenantProviderSchema = z.object({
  id: z.string(),
  url: z.string(),
  fingerprints: z.array(z.string()),
  audience: z.string(),
  earliestIssuanceTimeAllowed: z.number(),
});

export const TokenSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.string(),
  type: z.literal('Bearer'),
});

export const ValidateTokenResponseSchema = z.object({
  isValid: z.boolean(),
});

export const ProviderIdSchema = z.string().min(1, { message: 'Provider ID is required.' });
export const ClientIdSchema = z.string().min(1, { message: 'Client ID is required.' });
export const TenantIdSchema = z.string().min(1, { message: 'Tenant ID is required.' });
export const TenantProviderIdSchema = z.string().min(1, { message: 'Tenant provider ID is required.' });

export const CreateProviderFn = z.function().args(CreateProviderSchema).returns(z.promise(ProviderSchema));
export const GetProviderFn = z.function().args(ProviderIdSchema).returns(z.promise(ProviderSchema));
export const DeleteProviderFn = z.function().args(ProviderIdSchema).returns(z.promise(z.void()));
export const CreateClientFn = z.function().args(ProviderIdSchema, CreateClientSchema).returns(z.promise(ClientSchema));
export const GetClientFn = z.function().args(ProviderIdSchema, ClientIdSchema).returns(z.promise(ClientSchema));
export const DeleteClientFn = z.function().args(ProviderIdSchema, ClientIdSchema).returns(z.promise(z.void()));
export const CreateTokenFn = z
  .function()
  .args(ProviderIdSchema, ClientIdSchema, CreateTokenSchema)
  .returns(z.promise(TokenSchema));
export const CreateTenantFn = z.function().args(CreateTenantSchema).returns(z.promise(TenantSchema));
export const GetTenantFn = z.function().args(TenantIdSchema).returns(z.promise(TenantSchema));
export const DeleteTenantFn = z.function().args(TenantIdSchema).returns(z.promise(z.void()));
export const CreateTenantProviderFn = z
  .function()
  .args(TenantIdSchema, CreateTenantProviderSchema)
  .returns(z.promise(TenantProviderSchema));
export const GetTenantProviderFn = z
  .function()
  .args(TenantIdSchema, TenantProviderIdSchema)
  .returns(z.promise(TenantProviderSchema));
export const DeleteTenantProviderFn = z
  .function()
  .args(TenantIdSchema, TenantProviderIdSchema)
  .returns(z.promise(z.void()));
export const ValidateTokenFn = z
  .function()
  .args(TenantIdSchema, z.string())
  .returns(z.promise(ValidateTokenResponseSchema));
