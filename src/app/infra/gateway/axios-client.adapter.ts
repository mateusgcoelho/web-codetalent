import { Injectable } from '@angular/core';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { environment } from '../../../environments/environment';
import ApiError from '../errors/api.error';
import NetworkError from '../errors/network.error';
import {
  IHttpClient,
  IHttpClientConfig,
} from './interfaces/http-client.interface';

@Injectable()
export class AxiosClientAdapter implements IHttpClient {
  client: AxiosInstance = axios.create({
    baseURL: environment.apiUrl,
  });

  async delete(url: string, config?: IHttpClientConfig): Promise<any> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        headers: config?.headers,
        params: config?.params,
      };

      const response = await this.client.delete(url, axiosConfig);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.code == 'ERR_NETWORK') {
        throw new NetworkError();
      }
      if (error instanceof AxiosError && error.response?.data.message) {
        throw new ApiError(error.response.data.message);
      }
      throw error;
    }
  }

  async post(url: string, data: any, config?: IHttpClientConfig): Promise<any> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        headers: config?.headers,
        params: config?.params,
      };

      const response = await this.client.post(url, data, axiosConfig);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.code == 'ERR_NETWORK') {
        throw new NetworkError();
      }
      if (error instanceof AxiosError && error.response?.data.message) {
        throw new ApiError(error.response.data.message);
      }
      throw error;
    }
  }

  async put(url: string, data: any, config?: IHttpClientConfig): Promise<any> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        headers: config?.headers,
        params: config?.params,
      };

      const response = await this.client.put(url, data, axiosConfig);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.code == 'ERR_NETWORK') {
        throw new NetworkError();
      }
      if (error instanceof AxiosError && error.response?.data.message) {
        throw new ApiError(error.response.data.message);
      }
      throw error;
    }
  }

  async get(url: string, config?: IHttpClientConfig): Promise<any> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        headers: config?.headers,
        params: config?.params,
      };

      const response = await this.client.get(url, axiosConfig);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.code == 'ERR_NETWORK') {
        throw new NetworkError();
      }
      if (error instanceof AxiosError && error.response?.data.message) {
        throw new ApiError(error.response.data.message);
      }
      throw error;
    }
  }
}
