export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  userId: string;
  createdAt: string;
  expiresAt?: string | null;
}

export interface CreateUrlRequest {
  originalUrl: string;
  alias?: string | null;
  expiresAt?: string | null;
}
