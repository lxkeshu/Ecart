import { apiGet, apiPost, apiDelete } from "@/lib/api";
import type { AdminBannersResponse } from "./types";

export async function getAdminBanners() {
  return apiGet<AdminBannersResponse>("/admin/settings/banners");
}

export async function uploadAdminBanners(formData: FormData) {
  return apiPost<AdminBannersResponse, FormData>(
    "/admin/settings/banners",
    formData,
  );
}

export async function deleteAdminBanner(id: string) {
  return apiDelete<{ success: boolean; _id: string }>(`/admin/settings/banners/${id}`);
}
