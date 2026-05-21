import apiClient, { unwrapList, unwrapResponse } from './api-client';

function mapContract(contract, acceptance) {
  if (!contract) return null;
  const signed = acceptance || contract.acceptance;
  return {
    id: contract.id,
    title: contract.title || contract.name,
    version: contract.version,
    status: signed ? 'accepted' : 'pending',
    signedAt: signed?.acceptedAt || signed?.signedAt || null,
  };
}

export async function list(params = {}) {
  const response = await apiClient.get('/contracts', { params });
  const { items, meta } = unwrapList(response);
  return { items: items.map((item) => mapContract(item)), meta };
}

export async function accept(id) {
  const response = await apiClient.post(`/contracts/${id}/accept`);
  return unwrapResponse(response);
}

export async function myAcceptances() {
  const response = await apiClient.get('/contracts/acceptances/me');
  const { items } = unwrapList(response);
  return items;
}

export async function listWithAcceptanceStatus() {
  const [contractsRes, acceptances] = await Promise.all([list(), myAcceptances()]);
  const map = new Map(acceptances.map((a) => [a.contractId || a.contract?.id, a]));
  return contractsRes.items.map((c) => mapContract(c, map.get(c.id)));
}
