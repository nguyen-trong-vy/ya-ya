import { fetchClient } from './fetchClient';

/** feat/dang-ky(01)
 * API Đăng ký tài khoản khách hàng mới
 * @param {Object} formData { full_name, email, password, phone }
 * @returns {Promise<Object>} { success, message, user }
 */
export async function registerUser(formData) {
  return await fetchClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
}