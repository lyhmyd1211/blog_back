import { notification } from 'antd';
import { history } from 'umi';
import { stringify } from 'querystring';
const { pathname } = history.location;
const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

interface error {
  name: string;
  data: any;
  type: string;
  response: {
    status: number;
    statusText: string;
    url: string;
  };
}

/**
 * 异常处理程序
 */
// eslint-disable-next-line consistent-return
const errorHandler = (error: error) => {
  if (error.name === 'BizError') {
    notification.error({
      message: `请求错误 ${error.data.code}`,
      description: error.data.msg,
    });
    return error.data.code;
  }
  console.log('error', error);
  const { response } = error;
  if (response) {
    const errortext = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errortext,
    });
    if (response.status === 401) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname,
        }),
      });
    }
  }
};
export default errorHandler;
