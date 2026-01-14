export interface SocialLoginRequest {
  provider: "GOOGLE" | "APPLE";
  firebaseIdToken: string;
  clientType: "WEB" | "IOS" | "ANDROID";
  userName: string | null;
  deviceToken?: string;
  deviceType?: "iOS" | "Android";
}

export interface SocialLoginResponse {
  userId: number;
  accessToken: string;
  refreshToken: string;
  user: {
    userId: number;
    email: string;
    userName: string;
    provider: "GOOGLE" | "APPLE";
    providerId: string;
    createdAt: string;
    updatedAt: string;
  };
  newUser: boolean;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
}
