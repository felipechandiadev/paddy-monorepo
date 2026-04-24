export type TruckStatus = 'pending' | 'weighing' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'operator' | 'viewer';

export interface Truck {
  id: string;
  plate: string;
  driverName: string;
  driverDocument: string;
  receptionId: string;
  status: TruckStatus;
  weight?: number;
  entryTime: Date;
  exitTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TruckReception {
  id: string;
  truckId: string;
  weight: number;
  moistureLevel?: number;
  quality?: string;
  notes?: string;
  recordedAt: Date;
  recordedBy: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export interface LogisticsState {
  trucks: Truck[];
  currentTruck: Truck | null;
  receptions: TruckReception[];
  loading: boolean;
  error: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export interface LogisticsAction {
  type: string;
  payload?: any;
}

export interface WeighingData {
  truckId: string;
  weight: number;
  moistureLevel?: number;
  quality?: string;
  notes?: string;
}

export interface MonitorDisplayProps {
  refreshInterval?: number;
}

export interface TruckCardProps {
  truck: Truck;
  onClick?: () => void;
  isSelected?: boolean;
}

export interface WeighingFormProps {
  truckId: string;
  onSubmit?: (data: WeighingData) => void;
  onCancel?: () => void;
}
