import { apiClient } from "./client";
import type { Admin } from "../types";

export async function loginAdmin(email: string, password: string) {
  const { data } = await apiClient.post<{ token: string; admin: Admin }>(
    "/auth/login",
    { email, password }
  );
  localStorage.setItem("admin_token", data.token);
  localStorage.setItem("admin_info", JSON.stringify(data.admin));
  return data.admin;
}

export function logoutAdmin() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_info");
}

export function getStoredAdmin(): Admin | null {
  const raw = localStorage.getItem("admin_info");
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("admin_token");
}

export function isManager(): boolean {
  return getStoredAdmin()?.role === "manager";
}

export async function fetchEmployees(): Promise<Admin[]> {
  const { data } = await apiClient.get<{ admins: Admin[] }>("/auth/employees");
  return data.admins;
}

export async function createEmployee(payload: {
  email: string;
  password: string;
  full_name?: string;
}) {
  const { data } = await apiClient.post("/auth/employees", payload);
  return data.admin as Admin;
}

export async function deleteEmployee(id: string) {
  await apiClient.delete(`/auth/employees/${id}`);
}