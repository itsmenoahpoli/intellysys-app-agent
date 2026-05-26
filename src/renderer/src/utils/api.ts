import { getEnv } from '@renderer/utils/env';

interface RequestOptions {
  headers?: Record<string, string>;
  body?: any;
  customBaseUrl?: string;
}

class ApiClient {
  private getBaseUrl(customBaseUrl?: string): string {
    if (customBaseUrl) return customBaseUrl;
    return getEnv('API_URL', 'https://app.wapintellysys.com/api/v1');
  }

  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    const token = localStorage.getItem('wap_auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(method: string, endpoint: string, options: RequestOptions = {}): Promise<T> {
    const baseUrl = this.getBaseUrl(options.customBaseUrl);
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${baseUrl}${cleanEndpoint}`;

    const config: RequestInit = {
      method,
      headers: this.getHeaders(options.headers),
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
        }
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error(`API Error [${method}] to ${url}:`, error);
      throw error;
    }
  }

  public get<T>(endpoint: string, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('GET', endpoint, options);
  }

  public post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('POST', endpoint, { ...options, body });
  }

  public put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('PUT', endpoint, { ...options, body });
  }

  public delete<T>(endpoint: string, options?: Omit<RequestOptions, 'body'>): Promise<T> {
    return this.request<T>('DELETE', endpoint, options);
  }
}

export const api = new ApiClient();
