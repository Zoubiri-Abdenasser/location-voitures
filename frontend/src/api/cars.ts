import { apiClient } from "./client";
import type { Car, CarFilters } from "../types";

export async function fetchCars(filters?: CarFilters): Promise<Car[]> {
  const { data } = await apiClient.get<{ cars: Car[] }>("/cars", {
    params: filters,
  });
  return data.cars;
}

export async function fetchCarById(id: string): Promise<Car> {
  const { data } = await apiClient.get<{ car: Car }>(`/cars/${id}`);
  return data.car;
}

export async function fetchCarAvailability(
  id: string
): Promise<{ pickup_date: string; return_date: string }[]> {
  const { data } = await apiClient.get<{
    booked_ranges: { pickup_date: string; return_date: string }[];
  }>(`/cars/${id}/availability`);
  return data.booked_ranges;
}

export async function createCar(payload: Partial<Car>) {
  const { data } = await apiClient.post("/cars", payload);
  return data.car as Car;
}

export async function updateCar(id: string, payload: Partial<Car>) {
  const { data } = await apiClient.put(`/cars/${id}`, payload);
  return data.car as Car;
}

export async function deleteCar(id: string) {
  await apiClient.delete(`/cars/${id}`);
}