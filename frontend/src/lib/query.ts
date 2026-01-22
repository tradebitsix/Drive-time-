import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, err: any) => {
        const status = err?.status;
        if (status && status >= 400 && status < 500 && status !== 429) return false;
        return count < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});
