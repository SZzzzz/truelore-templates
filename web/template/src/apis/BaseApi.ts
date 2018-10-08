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

type Tip = string | ((res: AxiosResponse) => string);
interface NoticeConfig {
  successTip?: Tip;
  failTip?: Tip;
}

interface BaseConfig extends NoticeConfig {
  url: string;
  params?: Object;
}

interface PostConfig extends BaseConfig {
  data: Object;
}

export default class BaseApi {
  protected async get<T>(config: BaseConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.GET, config, extra);
  }

  protected async post<T>(config: PostConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.POST, config, extra);
  }

  protected async delete<T>(config: BaseConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.DELETE, config, extra);
  }

  protected put<T>(config: PostConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.PUT, config, extra);
  }

  protected patch<T>(config: PostConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.PATCH, config, extra);
  }

  private async request<T>(
    method: HttpMethods,
    config: BaseConfig | PostConfig,
    extra: AxiosRequestConfig = {}
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      method: method,
      url: config.url,
      params: config.params || {},
      ...extra
    };
    if (method === HttpMethods.POST || method === HttpMethods.PUT || method === HttpMethods.PATCH) {
      requestConfig.data = (config as PostConfig).data || {};
    }

    try {
      const result = await this.agent.request<T>(requestConfig);
      if (config.successTip) {
        this.notice.successNotice(this.getTip(config.successTip, result));
      }
      return result.data as T;
    } catch (error) {
      console.error(`api request error: ${config.url}`);
      console.info(JSON.stringify(error, null, 2));
      if (config.failTip) {
        this.notice.errorNotice(this.getTip(config.failTip, error.response as AxiosResponse));
      }
      Raven.captureException(error);
      throw error;
    }
  }

  private getTip(tip: Tip, res: AxiosResponse) {
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
