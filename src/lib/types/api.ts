export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from?: number;
    to?: number;
  };
}

export interface ApiItemResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiSettingsResponse<T> extends ApiItemResponse<T> {
  grouped?: Record<string, any>;
}

