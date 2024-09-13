export interface ApiResponse {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: any; 
    errors?: any[]; 
  }