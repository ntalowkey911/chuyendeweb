import { useMemo } from "react";
import type { OrderStatus } from "@/types/order";

interface OrderTrackingBarProps {
  status: OrderStatus;
}

const STEPS = [
  { id: "PENDING", label: "Đã đặt hàng" },
  { id: "CONFIRMED", label: "Đã xác nhận" },
  { id: "SHIPPING", label: "Đang giao" },
  { id: "COMPLETED", label: "Hoàn thành" },
];

export function OrderTrackingBar({ status }: OrderTrackingBarProps) {
  const currentStepIndex = useMemo(() => {
    return STEPS.findIndex((s) => s.id === status);
  }, [status]);

  if (status === "CANCELLED") {
    return (
      <div className="flex w-full items-center rounded-2xl bg-red-50 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </div>
        <div className="ml-4">
          <h4 className="text-sm font-black text-red-900">Đơn hàng đã hủy</h4>
          <p className="text-xs text-red-700/80 mt-0.5">Bạn đã hủy đơn hàng này hoặc đơn hàng bị từ chối.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-4 md:py-6 overflow-hidden">
      <div className="relative mx-auto flex w-full max-w-2xl justify-between">
        {/* Background Line */}
        <div className="absolute left-[10%] right-[10%] top-4 h-[3px] -translate-y-1/2 bg-slate-100 md:left-[12%] md:right-[12%]" />
        
        {/* Active Line */}
        <div
          className="absolute left-[10%] top-4 h-[3px] -translate-y-1/2 bg-emerald-500 transition-all duration-700 ease-in-out md:left-[12%]"
          style={{
            width: `${currentStepIndex >= 0 ? (currentStepIndex / (STEPS.length - 1)) * 80 : 0}%`,
          }}
        />

        {/* Steps */}
        {STEPS.map((step, index) => {
          const isActive = currentStepIndex >= index;
          const isCurrent = currentStepIndex === index;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-[3px] transition-all duration-500 md:h-10 md:w-10 ${
                  isActive
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-100 bg-white text-slate-300"
                } ${isCurrent ? "ring-4 ring-emerald-50" : ""}`}
              >
                {isActive ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="md:h-5 md:w-5"><path d="M20 6 9 17l-5-5"/></svg>
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300 md:h-2 md:w-2" />
                )}
              </div>
              <p
                className={`mt-2 text-center text-[10px] font-bold transition-colors md:mt-3 md:text-xs ${
                  isActive ? "text-emerald-700" : "text-slate-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
