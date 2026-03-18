import request from 'umi-request';

export async function searchVanBang(params) {
  return request('/api/van-bang/search', { params });
}

export async function getDetail(id) {
  return request(`/api/van-bang/${id}`);
}