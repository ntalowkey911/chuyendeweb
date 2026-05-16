import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-slate-800">Đang xác thực...</h2>
        <p className="text-slate-500 mt-2">Vui lòng chờ trong giây lát.</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
