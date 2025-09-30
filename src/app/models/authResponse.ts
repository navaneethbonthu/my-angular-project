export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  message: string;
}

export interface JwtPayload {
  aud: string;
  email: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
}

// export interface User {
//   aud: string;
//   email: string;
//   exp: number;
//   iat: number;
//   iss: string;
//   sub: string;
// }
