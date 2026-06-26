const getApiBaseUrl = () => {
  const envVal = import.meta.env.VITE_API_BASE_URL;

  // If the env variable is set to a full URL (not a relative path like '/api'), use it
  if (envVal && envVal.startsWith('http')) {
    return envVal;
  }

  // Runtime check for local development hostnames
  const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.') ||
    window.location.hostname.startsWith('172.') ||
    window.location.hostname.endsWith('.local')
  );

  return isLocal ? '/api' : 'https://market-research-server-iokbyzkr4-sanjithdoescodes-projects.vercel.app/api';
};

const API_BASE_URL = getApiBaseUrl();
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

export function fetchConfig() {
  return request('/config');
}

export function getNicheSuggestions(businessType, location) {
  return request('/analysis/niche-suggestions', {
    method: 'POST',
    body: JSON.stringify({
      businessType,
      location: location || undefined
    })
  });
}

export function fetchAnalysisStatus(id) {
  return request(`/analysis/status/${id}`);
}


