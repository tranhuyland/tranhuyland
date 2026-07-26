"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
      <h1 className="text-xl font-bold text-red-600 mb-2">Hệ thống đang quá tải dữ liệu</h1>
      <p className="text-slate-500 mb-6 max-w-md text-sm">
        Máy chủ đang tạm thời quá tải. Vui lòng bấm nút bên dưới để tải lại trang hoặc quay lại sau ít phút.
      </p>
      <button onClick={reset} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
        TẢI LẠI TRANG
      </button>
    </div>
  );
}
