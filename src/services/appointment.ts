import { request } from 'umi';

export async function getAppointments() {
  return request('/api/appointments'); // Thay bằng endpoint thực tế của bạn
}

export async function createAppointment(data: any) {
  return request('/api/appointments', {
    method: 'POST',
    data,
  });
}

export async function updateStatus(id: string, status: string) {
  return request(`/api/appointments/${id}`, {
    method: 'PUT',
    data: { status },
  });
}