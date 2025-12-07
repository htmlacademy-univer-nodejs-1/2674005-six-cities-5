export interface AuthService {
  authenticate(email: string, password: string): Promise<string | null>;
  verify(token: string): Promise<{ email: string; id: string } | null>;
}
