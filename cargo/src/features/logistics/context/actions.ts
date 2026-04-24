import { LogisticsState, LogisticsAction, Truck, TruckReception, AuthUser } from '../types/logistics.types';

export const ACTION_TYPES = {
  // Trucks
  SET_TRUCKS: 'SET_TRUCKS',
  ADD_TRUCK: 'ADD_TRUCK',
  UPDATE_TRUCK: 'UPDATE_TRUCK',
  REMOVE_TRUCK: 'REMOVE_TRUCK',
  SET_CURRENT_TRUCK: 'SET_CURRENT_TRUCK',
  
  // Receptions
  ADD_RECEPTION: 'ADD_RECEPTION',
  SET_RECEPTIONS: 'SET_RECEPTIONS',
  
  // Loading & Errors
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Auth
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  LOGOUT: 'LOGOUT',
} as const;

export const logisticsReducer = (state: LogisticsState, action: LogisticsAction): LogisticsState => {
  switch (action.type) {
    case ACTION_TYPES.SET_TRUCKS:
      return { ...state, trucks: action.payload };
      
    case ACTION_TYPES.ADD_TRUCK:
      return { ...state, trucks: [...state.trucks, action.payload] };
      
    case ACTION_TYPES.UPDATE_TRUCK:
      return {
        ...state,
        trucks: state.trucks.map(t => t.id === action.payload.id ? action.payload : t),
        currentTruck: state.currentTruck?.id === action.payload.id ? action.payload : state.currentTruck,
      };
      
    case ACTION_TYPES.REMOVE_TRUCK:
      return {
        ...state,
        trucks: state.trucks.filter(t => t.id !== action.payload),
      };
      
    case ACTION_TYPES.SET_CURRENT_TRUCK:
      return { ...state, currentTruck: action.payload };
      
    case ACTION_TYPES.ADD_RECEPTION:
      return { ...state, receptions: [...state.receptions, action.payload] };
      
    case ACTION_TYPES.SET_RECEPTIONS:
      return { ...state, receptions: action.payload };
      
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload };
      
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
      
    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
      
    case ACTION_TYPES.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
      
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        trucks: [],
        currentTruck: null,
        receptions: [],
      };
      
    default:
      return state;
  }
};
