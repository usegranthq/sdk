import { z } from 'zod/v4';

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

export const ConditionSchema = z.object({
  key: z
    .string('Please provide a condition key.')
    .describe('The key of the condition')
    .min(1, 'Please provide a condition key.')
    .max(10, 'Condition key must be at most 10 characters long.'),
  operator: z
    .enum(['stringEquals', 'stringLike', 'stringNotEquals', 'stringNotLike'])
    .describe('The operator of the condition'),
  value: z
    .string('Please provide a condition value.')
    .describe('The value of the condition')
    .min(1, 'Please provide a condition value.')
    .max(100, 'Condition value must be at most 100 characters long.'),
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
    .string('Please enter a domain name.')
    .regex(/^(?!:\/\/)([a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.)+[a-zA-Z]{2,}$/, 'Please enter a valid domain name.')
    .regex(/^(?!www\.)/, 'Domain name cannot start with www.')
    .min(3, 'Domain name must be at least 3 characters long.')
    .max(255, 'Domain name must be less than 255 characters long.'),
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
    .url('Please provide a valid URL.')
    .describe('The URL of the provider')
    .transform((url) => url.replace(/\/$/, '')),
  fingerprints: z
    .array(
      z
        .string('Please provide the provider fingerprint.')
        .describe('The fingerprint of the provider')
        .min(32, { message: 'Fingerprint must be at least 32 characters long.' })
        .max(64, { message: 'Fingerprint must be at most 64 characters long.' }),
    )
    .min(1, 'At least one fingerprint is required.')
    .max(5, 'At most 5 fingerprints are allowed.'),
  audience: z
    .string('Please provide the provider audience.')
    .describe('The audience of the provider')
    .min(3, 'Provider audience must be at least 3 characters long.')
    .max(100, 'Provider audience must be at most 100 characters long.')
    .trim(),
  earliestIssuanceTimeAllowed: z.coerce
    .number('Please provide the earliest issuance time allowed.')
    .describe('The earliest issuance time allowed in hours')
    .min(0, 'Earliest issuance time allowed must be at least 0.')
    .max(12, 'Earliest issuance time allowed must be at most 12.'),
});

export const CreateTenantProviderPolicySchema = z.object({
  name: z
    .string('Please provide a name for the tenant provider policy.')
    .describe('The name of the tenant provider policy')
    .min(3, 'Name must be at least 3 characters long'),
  description: z
    .string('Please provide a description for the tenant provider policy.')
    .describe('The description of the tenant provider policy')
    .min(10, 'Description must be at least 10 characters long')
    .max(100, 'Description must be less than 100 characters long'),
  audience: z
    .string('Please provide the audience for the tenant provider policy.')
    .describe('The audience of the tenant provider policy')
    .min(3, 'Audience must be at least 3 characters long.')
    .max(100, 'Audience must be at most 100 characters long.')
    .trim(),
  conditions: z
    .array(ConditionSchema)
    .describe('The conditions of the tenant provider policy')
    .min(1, 'At least one condition is required.')
    .max(5, 'At most 5 conditions are allowed.'),
});

export const ProviderSchema = z.object({
  id: z.string().describe('The ID of the provider'),
  name: z.string().describe('The name of the provider'),
  description: z.string().describe('The description of the provider'),
  createdAt: z.string().describe('The creation date of the provider'),
  updatedAt: z.string().describe('The last update date of the provider'),
});

export const ClientSchema = z.object({
  id: z.string().describe('The ID of the client'),
  name: z.string().describe('The name of the client'),
  audience: z.string().describe('The audience of the client'),
  createdAt: z.string().describe('The creation date of the client'),
  updatedAt: z.string().describe('The last update date of the client'),
});

export const DomainSchema = z.object({
  id: z.string().describe('The ID of the domain'),
  domain: z.string().describe('The domain of the domain'),
  verified: z.boolean().describe('Whether the domain is verified'),
  createdAt: z.string().describe('The creation date of the domain'),
  updatedAt: z.string().describe('The last update date of the domain'),
});

export const TenantSchema = z.object({
  id: z.string().describe('The ID of the tenant'),
  name: z.string().describe('The name of the tenant'),
  description: z.string().describe('The description of the tenant'),
  createdAt: z.string().describe('The creation date of the tenant'),
  updatedAt: z.string().describe('The last update date of the tenant'),
});

export const TenantProviderSchema = z.object({
  id: z.string().describe('The ID of the tenant provider'),
  url: z.string().describe('The URL of the tenant provider'),
  fingerprints: z.array(z.string()).describe('The fingerprints of the tenant provider'),
  audience: z.string().describe('The audience of the tenant provider'),
  earliestIssuanceTimeAllowed: z.number().describe('The earliest issuance time allowed for the tenant provider'),
  createdAt: z.string().describe('The creation date of the tenant provider'),
  updatedAt: z.string().describe('The last update date of the tenant provider'),
});

export const TokenSchema = z.object({
  accessToken: z.string().describe('The access token'),
  expiresAt: z.string().describe('The expiration date of the access token'),
  type: z.literal('Bearer').describe('The type of the token'),
});

export const ValidateTokenResponseSchema = z.object({
  exp: z.number().describe('The expiration date of the token'),
});

export const TenantProviderPolicySchema = z.object({
  id: z.string().describe('The ID of the tenant provider policy'),
  name: z.string().describe('The name of the tenant provider policy'),
  description: z.string().describe('The description of the tenant provider policy'),
  audience: z.string().describe('The audience of the tenant provider policy'),
  conditions: z.array(ConditionSchema).describe('The conditions of the tenant provider policy'),
  createdAt: z.string().describe('The creation date of the tenant provider policy'),
  updatedAt: z.string().describe('The last update date of the tenant provider policy'),
});

// used for 204 response, ky returns empty string for 204 responses
// https://github.com/sindresorhus/ky/blob/b49cd03d8673ea522a29bae4ef6b4672cf23201b/source/core/Ky.ts#L101
export const EmptyResponseSchema = z.string();

export const DomainValidationResponseSchema = z.object({
  domain: DomainSchema.describe('The domain object'),
  verified: z.boolean().describe('Whether the domain is verified'),
  message: z.string().describe('The message about the domain validation'),
});

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
export const TenantProviderPolicyIdSchema = z
  .string()
  .describe('The ID of the tenant provider policy')
  .min(1, { message: 'Tenant provider policy ID is required.' });

export const GetProvidersFn = z.function({
  output: z.promise(z.array(ProviderSchema)),
});
export const CreateProviderFn = z.function({
  input: [CreateProviderSchema],
  output: z.promise(ProviderSchema),
});
export const GetProviderFn = z.function({
  input: [ProviderIdSchema],
  output: z.promise(ProviderSchema),
});
export const DeleteProviderFn = z.function({
  input: [ProviderIdSchema],
  output: z.promise(EmptyResponseSchema),
});
export const GetClientsFn = z.function({
  input: [ProviderIdSchema],
  output: z.promise(z.array(ClientSchema)),
});
export const CreateClientFn = z.function({
  input: [ProviderIdSchema, CreateClientSchema],
  output: z.promise(ClientSchema),
});
export const GetClientFn = z.function({
  input: [ProviderIdSchema, ClientIdSchema],
  output: z.promise(ClientSchema),
});
export const DeleteClientFn = z.function({
  input: [ProviderIdSchema, ClientIdSchema],
  output: z.promise(EmptyResponseSchema),
});
export const CreateTokenFn = z.function({
  input: [ProviderIdSchema, ClientIdSchema, CreateTokenSchema],
  output: z.promise(TokenSchema),
});
export const GetTenantsFn = z.function({
  input: [],
  output: z.promise(z.array(TenantSchema)),
});

export const AddDomainFn = z.function({
  input: [ProviderIdSchema, AddDomainSchema],
  output: z.promise(DomainSchema),
});
export const DeleteDomainFn = z.function({
  input: [ProviderIdSchema, DomainIdSchema],
  output: z.promise(EmptyResponseSchema),
});
export const GetDomainFn = z.function({
  input: [ProviderIdSchema, DomainIdSchema],
  output: z.promise(DomainSchema),
});
export const GetDomainsFn = z.function({
  input: [ProviderIdSchema],
  output: z.promise(z.array(DomainSchema)),
});
export const VerifyDomainFn = z.function({
  input: [ProviderIdSchema, DomainIdSchema],
  output: z.promise(DomainValidationResponseSchema),
});

export const CreateTenantFn = z.function({
  input: [CreateTenantSchema],
  output: z.promise(TenantSchema),
});
export const GetTenantFn = z.function({
  input: [TenantIdSchema],
  output: z.promise(TenantSchema),
});
export const DeleteTenantFn = z.function({
  input: [TenantIdSchema],
  output: z.promise(EmptyResponseSchema),
});
export const GetTenantProvidersFn = z.function({
  input: [TenantIdSchema],
  output: z.promise(z.array(TenantProviderSchema)),
});
export const CreateTenantProviderFn = z.function({
  input: [TenantIdSchema, CreateTenantProviderSchema],
  output: z.promise(TenantProviderSchema),
});
export const GetTenantProviderFn = z.function({
  input: [TenantIdSchema, TenantProviderIdSchema],
  output: z.promise(TenantProviderSchema),
});
export const DeleteTenantProviderFn = z.function({
  input: [TenantIdSchema, TenantProviderIdSchema],
  output: z.promise(EmptyResponseSchema),
});

export const CreateTenantProviderPolicyFn = z.function({
  input: [TenantIdSchema, TenantProviderIdSchema, CreateTenantProviderPolicySchema],
  output: z.promise(TenantProviderPolicySchema),
});
export const GetTenantProviderPoliciesFn = z.function({
  input: [TenantIdSchema, TenantProviderIdSchema],
  output: z.promise(z.array(TenantProviderPolicySchema)),
});
export const GetTenantProviderPolicyFn = z.function({
  input: [TenantIdSchema, TenantProviderIdSchema, TenantProviderPolicyIdSchema],
  output: z.promise(TenantProviderPolicySchema),
});
export const DeleteTenantProviderPolicyFn = z.function({
  input: [TenantIdSchema, TenantProviderIdSchema, TenantProviderPolicyIdSchema],
  output: z.promise(EmptyResponseSchema),
});

export const ValidateTokenFn = z.function({
  input: [TenantIdSchema, TenantProviderPolicyIdSchema, z.string()],
  output: z.promise(ValidateTokenResponseSchema),
});
