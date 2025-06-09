import React, { PropsWithChildren } from "react";

export const Page: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">🏃‍♂️ Liveheats Race Manager</h1>
        {children}
      </div>
    </div>
  );
};
