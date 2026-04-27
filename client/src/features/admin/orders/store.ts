import { create } from "zustand";
import type { AdminOrder, AdminOrderStatus } from "./types";
import { extractAdminOrders, updateAdminOrderStatus } from "./api";
import { toast } from "sonner";

type AdminOrdersStore = {
  orders: AdminOrder[];
  loading: boolean;
  updatingOrderId: string;
  fetchOrders: () => Promise<void>;
  changeStatus: (
    orderId: string,
    orderStatus: AdminOrderStatus,
  ) => Promise<void>;
};

export const useAdminOrdersStore = create<AdminOrdersStore>((set) => ({
  orders: [],
  loading: true,
  updatingOrderId: "",
  fetchOrders: async () => {
    try {
      set({ loading: true });

      const response = await extractAdminOrders();
      set({
        orders: response?.items ?? [],
        loading: false,
      });
    } catch {
      set({
        orders: [],
        loading: false,
      });
    }
  },
  changeStatus: async (orderId, orderStatus) => {
    try {
      set({ updatingOrderId: orderId });

      const response = await updateAdminOrderStatus(orderId, orderStatus);

      if (!response._id) {
        set({ updatingOrderId: "" });
        toast.error("Failed to update order status");
        return;
      }

      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                orderStatus: response.orderStatus,
                deliveredAt: response.deliveredAt || order.deliveredAt || null,
                returnedAt: response.returnedAt || order.returnedAt || null,
              }
            : order,
        ),
        updatingOrderId: "",
      }));

      toast.success(`Order status updated to ${orderStatus}`);
    } catch (error) {
      console.error("[AdminOrdersStore] Error updating status:", error);
      set({ updatingOrderId: "" });
      toast.error(
        error instanceof Error ? error.message : "Failed to update order status",
      );
    }
  },
}));
