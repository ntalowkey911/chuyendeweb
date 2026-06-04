export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}
