import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useContent(category?: string) {
  const url = new URL(api.content.list.path, window.location.origin);
  if (category) url.searchParams.append("category", category);

  return useQuery({
    queryKey: [api.content.list.path, category],
    queryFn: async () => {
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch content");
      return api.content.list.responses[200].parse(await res.json());
    },
  });
}
