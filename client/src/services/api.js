const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function submitContactForm(formData) {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send message. Please try again.');
  }

  return data;
}
