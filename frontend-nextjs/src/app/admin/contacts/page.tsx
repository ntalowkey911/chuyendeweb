"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import ProtectedRoute from "@/components/ProtectedRoute";
import contactService from "@/services/contactService";
import type { Contact } from "@/types/contact";

function AdminContactsContent() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const loadContacts = async (p: number) => {
    try {
      const res = await contactService.getAdminContacts(p, 10);
      setContacts(res.data.content);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    void (async () => {
      setLoading(true);
      await loadContacts(page);
      setLoading(false);
    })();
  }, [page]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactService.markContactAsRead(id);
      await loadContacts(page);
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, isRead: true });
      }
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa thư liên hệ này không?")) {
      try {
        await contactService.deleteContact(id);
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
        await loadContacts(page);
      } catch (err) {
        alert("Lỗi khi xóa");
      }
    }
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 py-10">
          <Container>
            <div className="text-center text-slate-500">Đang tải...</div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 md:py-10">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900">Quản lý Liên hệ</h1>
            <p className="mt-2 text-slate-600">Xem và quản lý các tin nhắn từ khách hàng.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <section className="rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-sm h-fit">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500">
                      <th className="py-3">Trạng thái</th>
                      <th className="py-3">Khách hàng</th>
                      <th className="py-3">Tiêu đề</th>
                      <th className="py-3">Ngày gửi</th>
                      <th className="py-3">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr 
                        key={contact.id} 
                        className={`border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedContact?.id === contact.id ? 'bg-slate-50' : ''}`}
                        onClick={() => setSelectedContact(contact)}
                      >
                        <td className="py-4">
                          <span
                            className={`inline-block h-3 w-3 rounded-full ${
                              contact.isRead ? "bg-slate-300" : "bg-primary animate-pulse"
                            }`}
                          ></span>
                        </td>
                        <td className="py-4">
                          <p className={`font-bold ${!contact.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                            {contact.name}
                          </p>
                          <p className="text-xs text-slate-500">{contact.email}</p>
                        </td>
                        <td className={`py-4 ${!contact.isRead ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                          {contact.subject}
                        </td>
                        <td className="py-4 text-slate-500">
                          {new Date(contact.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(contact.id);
                            }}
                            className="font-semibold text-red-600 hover:underline"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          Chưa có tin nhắn liên hệ nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                  >
                    Trang trước
                  </button>
                  <span className="text-sm font-semibold text-slate-600">
                    Trang {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50 hover:bg-slate-50"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </section>

            <aside>
              {selectedContact ? (
                <div className="sticky top-24 rounded-[1.8rem] border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Chi tiết thư</h2>
                    {!selectedContact.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(selectedContact.id)}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-200"
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                  <div className="mb-6 space-y-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-500">Từ:</p>
                      <p className="font-bold text-slate-900">{selectedContact.name} &lt;{selectedContact.email}&gt;</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-500">Chủ đề:</p>
                      <p className="font-bold text-slate-900">{selectedContact.subject}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-500">Thời gian:</p>
                      <p className="text-slate-700">
                        {new Date(selectedContact.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-slate-500">Nội dung:</p>
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedContact.message}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sticky top-24 rounded-[1.8rem] border border-slate-100 bg-white p-8 text-center text-slate-500 shadow-sm">
                  <svg className="mx-auto mb-4 h-12 w-12 text-slate-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 8.4c.5.3.8.8.8 1.4v10.4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V9.8c0-.6.3-1.1.8-1.4l8-5.3c.7-.5 1.7-.5 2.4 0l8 5.3Z"/><path d="m22 10-8.9 7.1a2 2 0 0 1-2.2 0L2 10"/></svg>
                  Chọn một thư để xem chi tiết
                </div>
              )}
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default function AdminContactsPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContactsContent />
    </ProtectedRoute>
  );
}
