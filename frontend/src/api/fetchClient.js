//feat/cau-hinh-nen-tang(00)

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function fetchClient(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${formattedEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMessage = response.statusText || 'Đã xảy ra lỗi khi gọi máy chủ';
      if (data) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail
            .map((d) => {
              const loc = d.loc ? d.loc.filter((x) => x !== 'body').join('.') : '';
              return loc ? `${loc}: ${d.msg}` : d.msg;
            })
            .join('; ');
        } else if (data.message) {
          errorMessage = data.message;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  } catch (error) {
    console.error(`[fetchClient ERROR] ${formattedEndpoint}:`, error);
    throw error;
  }
}
export default fetchClient;
