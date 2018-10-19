import { defaultAgent } from './agent';
import { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import Raven from 'raven-js';
import globalNotice, { Notice } from 'utils/globalNotice';

enum HttpMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch'
}

type Tip<T> = string | ((res: AxiosResponse<T>) => string);
type CommonErrorResponse = {message: string};
interface NoticeConfig<T> {
  successTip?: Tip<T>;
  failTip?: Tip<CommonErrorResponse>;
}

interface BaseConfig<T> extends NoticeConfig<T>{
  url: string;
  params?: Object;
}

interface PostConfig<T> extends BaseConfig<T> {
  data: object;
}

export default class BaseApi {
  protected async get<T>(config: BaseConfig<T>, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.GET, config, extra);
  }

  protected async post<T>(config: PostConfig<T>, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.POST, config, extra);
  }

  protected async delete<T>(config: BaseConfig<T>, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.DELETE, config, extra);
  }

  protected put<T>(config: PostConfig<T>, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.PUT, config, extra);
  }

  protected patch<T>(config: PostConfig<T>, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.PATCH, config, extra);
  }

  private async request<T>(
    method: HttpMethods,
    config: BaseConfig<T> | PostConfig<T>,
    extra: AxiosRequestConfig = {}
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      method: method,
      url: config.url,
      params: config.params || {},
      ...extra
    };
    if (method === HttpMethods.POST || method === HttpMethods.PUT || method === HttpMethods.PATCH) {
      requestConfig.data = (config as PostConfig<T>).data || {};
    }

    try {
      const result = await this.agent.request<T>(requestConfig);
      if (config.successTip) {
        this.notice.successNotice(this.getTip<T>(config.successTip, result));
      }
      return result.data;
    } catch (error) {
      console.error(`api request error: ${config.url}`);
      console.info(JSON.stringify(error, null, 2));
      if (config.failTip) {
        this.notice.errorNotice(this.getTip<CommonErrorResponse>(config.failTip, error.response as AxiosResponse<{message: string}>));
      }
      Raven.captureException(error);
      throw error;
    }
  }

  private getTip<T>(tip: Tip<T>, res: AxiosResponse<T>) {
    if (typeof tip === 'string') {
      return tip;
    } else {
      return tip(res);
    }
  }

  constructor(
    public agent: AxiosInstance = defaultAgent,
    public notice: Notice = globalNotice
  ) {}
}
