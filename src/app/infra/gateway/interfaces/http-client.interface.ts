export type IHttpClientHeaders = {
  [key: string]: any;
};

export type IHttpClientParams = {
  [key: string]: any;
};

export interface IHttpClientConfig {
  headers?: IHttpClientHeaders;
  params?: IHttpClientParams;
}

export interface IHttpClient {
  get(url: string, config?: IHttpClientConfig): Promise<any>;
  post(url: string, data: any, config?: IHttpClientConfig): Promise<any>;
  put(url: string, data: any, config?: IHttpClientConfig): Promise<any>;
  delete(url: string, config?: IHttpClientConfig): Promise<any>;
}
