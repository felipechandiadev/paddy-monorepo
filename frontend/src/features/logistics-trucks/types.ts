import type { LogisticsProductCode } from '@/lib/logisticsProduct';

export interface TruckReceptionProducerRef {
  id?: number;
  rut: string;
  name: string;
}

export interface TruckReception {
  id: number;
  numero_turno: number | null;
  status: 'ESPERA' | 'FINISHED';
  producer_id: number;
  product?: LogisticsProductCode;
  producer?: TruckReceptionProducerRef;
  license_plate: string;
  driver_name?: string | null;
  carrier_company?: string;
  dispatch_guide?: string;
  notes?: string | null;
  gross_weight?: number;
  tare_weight?: number;
  net_weight?: number;
  entry_at: Date;
  finished_at?: Date;
  created_by?: string;
}

export interface CreateTruckWithGrossWeightPayload {
  producer_id: number;
  license_plate: string;
  driver_name?: string;
  carrier_company?: string;
  dispatch_guide?: string;
  notes?: string;
  gross_weight: number;
  tare_weight?: number;
  product: LogisticsProductCode;
  numero_turno?: number;
  created_by?: string;
}

export interface UpdateTruckReceptionPayload {
  numero_turno?: number;
  producer_id?: number;
  license_plate?: string;
  driver_name?: string | null;
  carrier_company?: string;
  dispatch_guide?: string;
  notes?: string | null;
  gross_weight?: number;
  tare_weight?: number;
  product?: LogisticsProductCode;
}

/** Despacho de carga (misma forma operativa que recepción para ticket / API). */
export interface TruckDispatch {
  id: number;
  status: 'ESPERA' | 'FINISHED';
  producer_id: number;
  product?: LogisticsProductCode;
  producer?: TruckReceptionProducerRef;
  license_plate: string;
  driver_name?: string | null;
  carrier_company?: string;
  dispatch_guide?: string;
  notes?: string | null;
  gross_weight?: number;
  tare_weight?: number;
  net_weight?: number;
  entry_at: Date;
  finished_at?: Date;
  created_by?: string;
}

export interface TruckReceptionGridRow {
  id: number;
  status: string;
  product?: string;
  producer_id?: number;
  numero_turno: number | null;
  license_plate: string;
  driver_name: string;
  carrier_company?: string | null;
  dispatch_guide?: string | null;
  gross_weight: string | number | null;
  tare_weight: string | number | null;
  net_weight: string | number | null;
  entry_at: string;
  finished_at?: string | null;
  producer_name: string;
  producer_rut: string;
}

export interface TruckDispatchGridRow {
  id: number;
  status: string;
  product?: string;
  producer_id?: number;
  license_plate: string;
  driver_name: string;
  carrier_company?: string | null;
  dispatch_guide?: string | null;
  gross_weight: string | number | null;
  tare_weight: string | number | null;
  net_weight: string | number | null;
  entry_at: string;
  finished_at?: string | null;
  producer_name: string;
  producer_rut: string;
}
