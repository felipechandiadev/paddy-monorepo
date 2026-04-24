'use client';

interface TurnoSession {
  fecha: string;
  turnos: TurnoInfo[];
  nextTurno: number;
}

interface TurnoInfo {
  numero: number;
  truck_id: number;
  status: 'ESPERA' | 'FINISHED';
  patente: string;
}

interface SyncQueueItem {
  action: 'create' | 'update';
  data: any;
  timestamp: number;
  id?: number;
}

/**
 * Servicio para manejar localStorage y sincronización con backend
 */
export class LocalStorageService {
  private readonly TURNO_SESSION_KEY = 'turno_session';
  private readonly SYNC_QUEUE_KEY = 'truck_reception_sync_queue';
  private readonly CACHE_KEY = 'truck_receptions_cache';

  /**
   * Obtener la sesión de turnos para una fecha específica
   */
  getTurnoSession(fecha: Date): TurnoSession | null {
    const key = `${this.TURNO_SESSION_KEY}_${this.formatDate(fecha)}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Crear o actualizar la sesión de turnos para hoy
   */
  saveTurnoSession(fecha: Date, session: TurnoSession): void {
    const key = `${this.TURNO_SESSION_KEY}_${this.formatDate(fecha)}`;
    localStorage.setItem(key, JSON.stringify(session));
  }

  /**
   * Inicializar sesión de turnos si no existe
   */
  initializeTurnoSessionIfNeeded(fecha: Date): TurnoSession {
    let session = this.getTurnoSession(fecha);

    if (!session) {
      session = {
        fecha: this.formatDate(fecha),
        turnos: [],
        nextTurno: 1,
      };
      this.saveTurnoSession(fecha, session);
    }

    return session;
  }

  /**
   * Obtener el próximo número de turno para hoy
   */
  getNextTurno(fecha: Date): number {
    const session = this.getTurnoSession(fecha) || this.initializeTurnoSessionIfNeeded(fecha);
    return session.nextTurno;
  }

  /**
   * Agregar un turno a la sesión
   */
  addTurno(fecha: Date, turno: TurnoInfo): void {
    const session = this.getTurnoSession(fecha) || this.initializeTurnoSessionIfNeeded(fecha);
    session.turnos.push(turno);
    session.nextTurno = turno.numero + 1;
    this.saveTurnoSession(fecha, session);
  }

  /**
   * Actualizar turno existente
   */
  updateTurno(fecha: Date, numero: number, status: 'ESPERA' | 'FINISHED'): void {
    const session = this.getTurnoSession(fecha);
    if (!session) return;

    const turno = session.turnos.find(t => t.numero === numero);
    if (turno) {
      turno.status = status;
      this.saveTurnoSession(fecha, session);
    }
  }

  /**
   * Guardar recepción en cache local
   */
  saveTruckReception(truck: any): void {
    const cache = this.getTruckReceptionsCache();
    cache[truck.id] = truck;
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
  }

  /**
   * Obtener cache de recepciones
   */
  getTruckReceptionsCache(): Record<number, any> {
    const data = localStorage.getItem(this.CACHE_KEY);
    return data ? JSON.parse(data) : {};
  }

  /**
   * Agregar a cola de sincronización
   */
  addToSyncQueue(action: 'create' | 'update', data: any, id?: number): void {
    const queue: SyncQueueItem[] = this.getSyncQueue();
    queue.push({
      action,
      data,
      timestamp: Date.now(),
      id,
    });
    localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  /**
   * Obtener cola de sincronización
   */
  getSyncQueue(): SyncQueueItem[] {
    const data = localStorage.getItem(this.SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Limpiar cola de sincronización
   */
  clearSyncQueue(): void {
    localStorage.removeItem(this.SYNC_QUEUE_KEY);
  }

  /**
   * Remover un elemento de la cola de sincronización
   */
  removeFromSyncQueue(index: number): void {
    const queue = this.getSyncQueue();
    queue.splice(index, 1);
    localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
  }

  /**
   * Limpiar todo el cache local
   */
  clearAll(): void {
    Object.keys(localStorage)
      .filter(key => 
        key.startsWith(this.TURNO_SESSION_KEY) || 
        key === this.SYNC_QUEUE_KEY || 
        key === this.CACHE_KEY
      )
      .forEach(key => localStorage.removeItem(key));
  }

  /**
   * Formatear fecha a YYYY-MM-DD
   */
  private formatDate(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

// Exportar instancia singleton
export const localStorageService = new LocalStorageService();
