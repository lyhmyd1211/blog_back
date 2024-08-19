import { request } from 'umi';

export async function getArticleTypeList(options?: Record<string, any>) {
  return request<API.ListResult<API.ArticleType>>('/api/getArticleTypeList', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getArticleTypeById(params: { id: string }, options?: Record<string, any>) {
  return request<API.commonResult>('/api/getArticleTypeById', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

export async function delArticleType(params: { id: string }, options?: Record<string, any>) {
  console.log('params', params);
  return request<Record<string, any>>('/api/delArticleType', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
export async function addArticleType(body: API.ArticleType, options?: Record<string, any>) {
  return request<API.commonResult>('/api/addArticleType', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function editArticleType(body: API.ArticleType, options?: Record<string, any>) {
  return request<API.commonResult>('/api/editArticleType', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function hasCode(
  params: { code: string; id?: string },
  options?: Record<string, any>,
) {
  return request<Record<string, any>>('/api/hasCode', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}
