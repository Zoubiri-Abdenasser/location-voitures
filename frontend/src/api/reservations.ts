import { apiClient } from "./client";
import type { Reservation, Extra, ReservationStatus } from "../types";

export interface CreateReservationPayload {
  car_id: string;
  customer_name: string;
  customer_phone: string;
  driver_license_number: string;
  pickup_date: string;
  return_date: string;
  pickup_location?: string;
  extras?: Extra[];
}

export async function createReservation(payload: CreateReservationPayload) {
  const { data } = await apiClient.post("/reservations", payload);
  return data.reservation as Reservation;
}

export async function fetchReservations(): Promise<Reservation[]> {
  const { data } = await apiClient.get<{ reservations: Reservation[] }>(
    "/reservations"
  );
  return data.reservations;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
) {
  const { data } = await apiClient.patch(`/reservations/${id}/status`, {
    status,
  });
  return data.reservation as Reservation;
}