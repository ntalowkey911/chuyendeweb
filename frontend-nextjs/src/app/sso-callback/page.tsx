import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffaf5]">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Đang xác thực...</h2>
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}
