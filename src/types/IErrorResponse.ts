export interface ErrorResponse {
  success: boolean;
  error: {
    code: number;
    message: string;
  };
}