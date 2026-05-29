import apiClient, { unwrapList, unwrapResponse } from './api-client';

function mapMessage(message) {
  if (!message) return null;
  return {
    id: message.id,
    subject: message.subject,
    body: message.body,
    readAt: message.readAt || message.read_at || null,
    createdAt: message.createdAt || message.created_at,
    sender: message.sender
      ? {
          id: message.sender.id,
          name: message.sender.name,
          role: message.sender.role,
        }
      : null,
    recipient: message.recipient
      ? {
          id: message.recipient.id,
          name: message.recipient.name,
          role: message.recipient.role,
        }
      : null,
  };
}

export async function list(params = {}) {
  const response = await apiClient.get('/messages', { params });
  const { items, meta } = unwrapList(response);
  return { items: items.map(mapMessage), meta };
}

export async function create(payload) {
  const response = await apiClient.post('/messages', payload);
  const result = unwrapResponse(response);
  return mapMessage(result.message);
}

export { mapMessage };
