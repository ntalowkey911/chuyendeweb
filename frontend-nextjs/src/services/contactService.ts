import api from "./api";
import type { Contact, ContactRequest } from "@/types/contact";

interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const contactService = {
  // Public APIs
  submitContact: (data: ContactRequest) => {
    return api.post<Contact>("/contacts", data);
  },

  // Admin APIs
  getAdminContacts: (page = 0, size = 10) => {
    return api.get<PageResponse<Contact>>(`/admin/contacts?page=${page}&size=${size}`);
  },

  markContactAsRead: (id: string) => {
    return api.put<Contact>(`/admin/contacts/${id}/read`);
  },

  deleteContact: (id: string) => {
    return api.delete(`/admin/contacts/${id}`);
  },
};

export default contactService;
