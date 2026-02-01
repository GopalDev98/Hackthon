// User Types
export interface User {
  id: string;
  email: string;
  role: 'applicant' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

// Application Types
export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  panCard: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface EmploymentInfo {
  employmentType: 'salaried' | 'self-employed' | 'business';
  annualIncome: number;
  companyName: string;
  designation: string;
}

export interface CreditInfo {
  creditScore: number;
  creditLimit: number;
  retrievedAt: string;
}

export interface StatusHistoryItem {
  status: ApplicationStatus;
  timestamp: string;
  remarks?: string;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  _id: string;
  applicationNumber: string;
  userId: string;
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  creditInfo?: CreditInfo;
  status: ApplicationStatus;
  statusHistory: StatusHistoryItem[];
  submittedAt: string;
  processedAt?: string;
  dispatchedAt?: string;
}

export interface ApplicationFormData {
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: {
    applicationNumber: string;
    status: ApplicationStatus;
    creditInfo?: CreditInfo;
    submittedAt: string;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

// Form validation error type
export interface FormError {
  field: string;
  message: string;
}
