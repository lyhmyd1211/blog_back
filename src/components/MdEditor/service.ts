import { request } from 'umi';

export async function upload(params: any) {
  return request<API.uploadResult>('/api/upload', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
  });
}
