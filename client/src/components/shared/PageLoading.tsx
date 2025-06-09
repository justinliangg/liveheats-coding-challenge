import { Loader2Icon } from "lucide-react";

export function PageLoading() {
  return (
    <div className="flex items-center justify-center p-8 h-svh">
      <div className="flex w-full justify-center">
        <Loader2Icon aria-label="Loading" className="animate-spin h-10 w-10 text-gray-500 " />
      </div>
    </div>
  );
}
