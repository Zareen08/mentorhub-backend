export interface IErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface IErrorResponse {
  success: false;
  error: string;
  details?: IErrorDetail[];
  stack?: string;
  timestamp: string;
  path?: string;
  method?: string;
}

export interface IValidationError {
  type: string;
  value?: any;
  msg: string;
  path: string;
  location: string;
}