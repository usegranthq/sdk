import { z } from 'zod';

const FOURTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

export const CreateProviderSchema = z.object({
  name: z
    .string()
    .describe('The name of the provider')
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be less than 50 characters long'),
  description: z
    .string()
    .describe('The description of the provider')
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 100 characters long'),
});

export const CreateClientSchema = z.object({
  name: z
    .string()
    .describe('The name of the client')
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be less than 50 characters long'),
  audience: z
    .string()
    .describe('The audience of the client')
    .min(3, 'Audience must be at least 3 characters long')
    .max(100, 'Audience must be less than 100 characters long'),
});

export const AddDomainSchema = z.object({
  domain: z
    .string({
      required_error: 'Please enter a domain name.',
    })
    .regex(/^(?!:\/\/)([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.)+[a-zA-Z]{2,}$/, {
      message: 'Please enter a valid domain name.',
    })
    .regex(/^(?!www\.)/, { message: 'Domain name cannot start with www.' })
    .min(3, { message: 'Domain name must be at least 3 characters long.' })
    .max(255, { message: 'Domain name must be less than 255 characters.' }),
});

export const CreateTokenSchema = z.object({
  expiresIn: z
    .number()
    .describe('The number of seconds the token will be valid for')
    .max(FOURTY_EIGHT_HOURS, 'Expires in must be less than 48 hours')
    .optional(),
  useJwtType: z.boolean().describe('Whether to use at+jwt token type in the header').optional(),
  audienceAsArray: z.boolean().describe('Whether to use an array of audiences').optional(),
  forceDefaultDomain: z.boolean().describe('Whether to force the default domain').optional(),
});

export const CreateTenantSchema = z.object({
  name: z.string().describe('The name of the tenant').min(3, 'Name must be at least 3 characters long'),
  description: z
    .string()
    .describe('The description of the tenant')
    .min(1, 'Description is required')
    .max(100, 'Description must be less than 200 characters long'),
});

export const CreateTenantProviderSchema = z.object({
  url: z
    .string({ required_error: 'Please provide a provider URL.' })
    .describe('The URL of the provider')
    .trim()
    .url({ message: 'Please provide a valid URL.' })
    .transform((url) => url.replace(/\/$/, '')),
  fingerprints: z
    .array(
      z
        .string({ required_error: 'Please provide the provider fingerprint.' })
        .describe('The fingerprint of the provider')
        .min(32, { message: 'Fingerprint must be at least 32 characters long.' })
        .max(64, { message: 'Fingerprint must be at most 64 characters long.' }),
    )
    .min(1, { message: 'At least one fingerprint is required.' })
    .max(5, { message: 'At most 5 fingerprints are allowed.' }),
  audience: z
    .string({ required_error: 'Please provide the provider audience.' })
    .describe('The audience of the provider')
    .min(3, { message: 'Provider audience must be at least 3 characters long.' })
    .max(100, { message: 'Provider audience must be at most 100 characters long.' })
    .trim(),
  earliestIssuanceTimeAllowed: z
    .number({ required_error: 'Please provide the earliest issuance time allowed.', coerce: true })
    .describe('The earliest issuance time allowed in hours')
    .min(0, { message: 'Earliest issuance time allowed must be at least 0.' })
    .max(12, { message: 'Earliest issuance time allowed must be at most 12.' }),
});

export const ProviderSchema = z.object({
  id: z.string().describe('The ID of the provider'),
  name: z.string().describe('The name of the provider'),
  description: z.string().describe('The description of the provider'),
});

export const ClientSchema = z.object({
  id: z.string().describe('The ID of the client'),
  name: z.string().describe('The name of the client'),
  audience: z.string().describe('The audience of the client'),
});

export const DomainSchema = z.object({
  id: z.string().describe('The ID of the domain'),
  domain: z.string().describe('The domain of the domain'),
  verified: z.boolean().describe('Whether the domain is verified'),
});

export const TenantSchema = z.object({
  id: z.string().describe('The ID of the tenant'),
  name: z.string().describe('The name of the tenant'),
  description: z.string().describe('The description of the tenant'),
});

export const TenantProviderSchema = z.object({
  id: z.string().describe('The ID of the tenant provider'),
  url: z.string().describe('The URL of the tenant provider'),
  fingerprints: z.array(z.string()).describe('The fingerprints of the tenant provider'),
  audience: z.string().describe('The audience of the tenant provider'),
  earliestIssuanceTimeAllowed: z.number().describe('The earliest issuance time allowed for the tenant provider'),
});

export const TokenSchema = z.object({
  accessToken: z.string().describe('The access token'),
  expiresAt: z.string().describe('The expiration date of the access token'),
  type: z.literal('Bearer').describe('The type of the token'),
});

export const ValidateTokenResponseSchema = z.object({
  exp: z.number().describe('The expiration date of the token'),
});

export const EmptyResponseSchema = z.object({});

export const ProviderIdSchema = z
  .string()
  .describe('The ID of the provider')
  .min(1, { message: 'Provider ID is required.' });
export const ClientIdSchema = z.string().describe('The ID of the client').min(1, { message: 'Client ID is required.' });
export const DomainIdSchema = z.string().describe('The ID of the domain').min(1, { message: 'Domain ID is required.' });
export const TenantIdSchema = z.string().describe('The ID of the tenant').min(1, { message: 'Tenant ID is required.' });
export const TenantProviderIdSchema = z
  .string()
  .describe('The ID of the tenant provider')
  .min(1, { message: 'Tenant provider ID is required.' });

export const GetProvidersFn = z
  .function()
  .args()
  .returns(z.promise(z.array(ProviderSchema)));
export const CreateProviderFn = z.function().args(CreateProviderSchema).returns(z.promise(ProviderSchema));
export const GetProviderFn = z.function().args(ProviderIdSchema).returns(z.promise(ProviderSchema));
export const DeleteProviderFn = z.function().args(ProviderIdSchema).returns(z.promise(EmptyResponseSchema));
export const GetClientsFn = z
  .function()
  .args(ProviderIdSchema)
  .returns(z.promise(z.array(ClientSchema)));
export const CreateClientFn = z.function().args(ProviderIdSchema, CreateClientSchema).returns(z.promise(ClientSchema));
export const GetClientFn = z.function().args(ProviderIdSchema, ClientIdSchema).returns(z.promise(ClientSchema));
export const DeleteClientFn = z
  .function()
  .args(ProviderIdSchema, ClientIdSchema)
  .returns(z.promise(EmptyResponseSchema));
export const CreateTokenFn = z
  .function()
  .args(ProviderIdSchema, ClientIdSchema, CreateTokenSchema)
  .returns(z.promise(TokenSchema));
export const GetTenantsFn = z
  .function()
  .args()
  .returns(z.promise(z.array(TenantSchema)));

export const AddDomainFn = z.function().args(ProviderIdSchema, AddDomainSchema).returns(z.promise(DomainSchema));
export const DeleteDomainFn = z
  .function()
  .args(ProviderIdSchema, DomainIdSchema)
  .returns(z.promise(EmptyResponseSchema));
export const GetDomainFn = z.function().args(ProviderIdSchema, DomainIdSchema).returns(z.promise(DomainSchema));
export const GetDomainsFn = z
  .function()
  .args(ProviderIdSchema)
  .returns(z.promise(z.array(DomainSchema)));
export const VerifyDomainFn = z.function().args(ProviderIdSchema, DomainIdSchema).returns(z.promise(DomainSchema));

export const CreateTenantFn = z.function().args(CreateTenantSchema).returns(z.promise(TenantSchema));
export const GetTenantFn = z.function().args(TenantIdSchema).returns(z.promise(TenantSchema));
export const DeleteTenantFn = z.function().args(TenantIdSchema).returns(z.promise(EmptyResponseSchema));
export const GetTenantProvidersFn = z
  .function()
  .args(TenantIdSchema)
  .returns(z.promise(z.array(TenantProviderSchema)));
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
  .returns(z.promise(EmptyResponseSchema));
export const ValidateTokenFn = z
  .function()
  .args(TenantIdSchema, z.string())
  .returns(z.promise(ValidateTokenResponseSchema));
