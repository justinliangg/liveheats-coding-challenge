import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

interface PageErrorProps {
  title?: string;
  message?: string;
}

export function PageError({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
}: PageErrorProps) {
  const router = useRouter();

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="rounded-full bg-red-100 p-4 mx-auto mb-6 w-fit">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => router.replace("/")} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
