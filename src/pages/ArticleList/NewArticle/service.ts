import { request } from 'umi';

export async function addArticle(params: any) {
  return request<API.commonResult>('/api/addArticle', {
    method: 'POST',
    data: params,
  });
}
export async function getArticleById(params: { id: string }, options?: Record<string, any>) {
  return request<API.commonResult>('/api/getArticleById', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
export async function editArticle(params: any) {
  return request<API.commonResult>('/api/editArticle', {
    method: 'POST',
    data: params,
  });
}
