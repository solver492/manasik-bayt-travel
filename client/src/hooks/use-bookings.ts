import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import type { InsertBooking } from "@shared/schema";

export function useMyBookings() {
  return useQuery({
    queryKey: [api.bookings.listMyBookings.path],
    queryFn: async () => {
      const res = await fetch(api.bookings.listMyBookings.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return api.bookings.listMyBookings.responses[200].parse(await res.json());
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertBooking) => {
      const res = await apiRequest("POST", api.bookings.create.path, data);
      return api.bookings.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.bookings.listMyBookings.path] }),
  });
}
