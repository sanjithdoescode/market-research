const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.details = payload?.error?.details;
    throw error;
  }

  return payload.data;
}

export function submitAnalysis(input) {
  return request('/analysis', {
    method: 'POST',
    body: JSON.stringify(input)
  });
}

export function fetchHistory(limit = 25) {
  return request(`/history?limit=${limit}`);
}

export function fetchHistoryItem(id) {
  return request(`/history/${id}`);
}

export function deleteHistoryItem(id) {
  return request(`/history/${id}`, {
    method: 'DELETE'
  });
}

export function sendChatMessage(id, messages, byokSettings = {}) {
  return request(`/analysis/${id}/chat`, {
    method: 'POST',
    body: JSON.stringify({
      messages,
      provider: byokSettings.provider,
      apiKey: byokSettings.apiKey,
      model: byokSettings.model
    })
  });
}

export function sendGeneralChatMessage(messages, byokSettings = {}) {
  return request('/analysis/chat', {
    method: 'POST',
    body: JSON.stringify({
      messages,
      provider: byokSettings.provider,
      apiKey: byokSettings.apiKey,
      model: byokSettings.model
    })
  });
}


