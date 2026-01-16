import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import type { InsertOffer, Offer } from "@shared/schema";

export function useOffers(params?: { type?: string; featured?: boolean }) {
  // Construct URL with query params
  const url = new URL(api.offers.list.path, window.location.origin);
  if (params?.type) url.searchParams.append("type", params.type);
  if (params?.featured) url.searchParams.append("featured", "true");

  return useQuery({
    queryKey: [api.offers.list.path, params],
    queryFn: async () => {
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch offers");
      return api.offers.list.responses[200].parse(await res.json());
    },
  });
}

export function useOffer(id: number) {
  return useQuery({
    queryKey: [api.offers.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.offers.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch offer");
      return api.offers.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertOffer) => {
      const res = await apiRequest("POST", api.offers.create.path, data);
      return api.offers.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.offers.list.path] }),
  });
}
