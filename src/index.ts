import ky, { KyInstance, HTTPError } from 'ky';
import * as Types from './types';
import * as schema from './schema';

const API_URL = 'https://sdk.usegrant.dev';

export { HTTPError as UseGrantError };
export * from './types';

class UseGrant {
  #api: KyInstance;

  constructor(apiKey: string, options: Partial<Types.UseGrantOptions> = {}) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    this.#api = ky.create({
      signal: options.signal,
      prefixUrl: options.baseUrl ?? API_URL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      retry: options.retry,
    });
  }

  listProviders = schema.GetProvidersFn.implementAsync(() => {
    return this.#api.get<Types.Provider[]>('v1/providers').json();
  });

  createProvider = schema.CreateProviderFn.implementAsync((req) => {
    return this.#api.post<Types.Provider>('v1/providers', { json: req }).json();
  });

  getProvider = schema.GetProviderFn.implementAsync((id) => {
    return this.#api.get<Types.Provider>(`v1/providers/${id}`).json();
  });

  deleteProvider = schema.DeleteProviderFn.implementAsync((id) => {
    return this.#api.delete(`v1/providers/${id}`).json();
  });

  listClients = schema.GetClientsFn.implementAsync((providerId) => {
    return this.#api.get<Types.Client[]>(`v1/providers/${providerId}/clients`).json();
  });

  createClient = schema.CreateClientFn.implementAsync((providerId, req) => {
    return this.#api.post<Types.Client>(`v1/providers/${providerId}/clients`, { json: req }).json();
  });

  getClient = schema.GetClientFn.implementAsync((providerId, clientId) => {
    return this.#api.get<Types.Client>(`v1/providers/${providerId}/clients/${clientId}`).json();
  });

  deleteClient = schema.DeleteClientFn.implementAsync((providerId, clientId) => {
    return this.#api.delete<Types.EmptyResponse>(`v1/providers/${providerId}/clients/${clientId}`).json();
  });

  createToken = schema.CreateTokenFn.implementAsync((providerId, clientId, req) => {
    return this.#api.post<Types.Token>(`v1/providers/${providerId}/clients/${clientId}/tokens`, { json: req }).json();
  });

  listDomains = schema.GetDomainsFn.implementAsync((providerId) => {
    return this.#api.get<Types.Domain[]>(`v1/providers/${providerId}/domains`).json();
  });

  addDomain = schema.AddDomainFn.implementAsync((providerId, req) => {
    return this.#api.post<Types.Domain>(`v1/providers/${providerId}/domains`, { json: req }).json();
  });

  deleteDomain = schema.DeleteDomainFn.implementAsync((providerId, domainId) => {
    return this.#api.delete<Types.EmptyResponse>(`v1/providers/${providerId}/domains/${domainId}`).json();
  });

  getDomain = schema.GetDomainFn.implementAsync((providerId, domainId) => {
    return this.#api.get<Types.Domain>(`v1/providers/${providerId}/domains/${domainId}`).json();
  });

  verifyDomain = schema.VerifyDomainFn.implementAsync((providerId, domainId) => {
    return this.#api
      .post<Types.DomainValidationResponse>(`v1/providers/${providerId}/domains/${domainId}/verify`)
      .json();
  });

  listTenants = schema.GetTenantsFn.implementAsync(() => {
    return this.#api.get<Types.Tenant[]>(`v1/tenants`).json();
  });

  createTenant = schema.CreateTenantFn.implementAsync((req) => {
    return this.#api.post<Types.Tenant>('v1/tenants', { json: req }).json();
  });

  getTenant = schema.GetTenantFn.implementAsync((tenantId) => {
    return this.#api.get<Types.Tenant>(`v1/tenants/${tenantId}`).json();
  });

  deleteTenant = schema.DeleteTenantFn.implementAsync((tenantId) => {
    return this.#api.delete<Types.EmptyResponse>(`v1/tenants/${tenantId}`).json();
  });

  listTenantProviders = schema.GetTenantProvidersFn.implementAsync((tenantId) => {
    return this.#api.get<Types.TenantProvider[]>(`v1/tenants/${tenantId}/providers`).json();
  });

  createTenantProvider = schema.CreateTenantProviderFn.implementAsync((tenantId, req) => {
    return this.#api.post<Types.TenantProvider>(`v1/tenants/${tenantId}/providers`, { json: req }).json();
  });

  getTenantProvider = schema.GetTenantProviderFn.implementAsync((tenantId, providerId) => {
    return this.#api.get<Types.TenantProvider>(`v1/tenants/${tenantId}/providers/${providerId}`).json();
  });

  deleteTenantProvider = schema.DeleteTenantProviderFn.implementAsync((tenantId, providerId) => {
    return this.#api.delete<Types.EmptyResponse>(`v1/tenants/${tenantId}/providers/${providerId}`).json();
  });

  listTenantProviderPolicies = schema.GetTenantProviderPoliciesFn.implementAsync((tenantId, providerId) => {
    return this.#api
      .get<Types.TenantProviderPolicy[]>(`v1/tenants/${tenantId}/providers/${providerId}/policies`)
      .json();
  });

  createTenantProviderPolicy = schema.CreateTenantProviderPolicyFn.implementAsync((tenantId, providerId, req) => {
    return this.#api
      .post<Types.TenantProviderPolicy>(`v1/tenants/${tenantId}/providers/${providerId}/policies`, { json: req })
      .json();
  });

  getTenantProviderPolicy = schema.GetTenantProviderPolicyFn.implementAsync((tenantId, providerId, policyId) => {
    return this.#api
      .get<Types.TenantProviderPolicy>(`v1/tenants/${tenantId}/providers/${providerId}/policies/${policyId}`)
      .json();
  });

  deleteTenantProviderPolicy = schema.DeleteTenantProviderPolicyFn.implementAsync((tenantId, providerId, policyId) => {
    return this.#api
      .delete<Types.EmptyResponse>(`v1/tenants/${tenantId}/providers/${providerId}/policies/${policyId}`)
      .json();
  });

  validateToken = schema.ValidateTokenFn.implementAsync((tenantId, policyId, token) => {
    return this.#api
      .post<Types.ValidateTokenResponse>(`v1/tenants/${tenantId}/validate`, {
        json: {
          tenantProviderPolicyId: policyId,
          token,
        },
      })
      .json();
  });
}

export default UseGrant;
