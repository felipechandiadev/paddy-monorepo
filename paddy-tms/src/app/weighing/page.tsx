'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/logistics/hooks/useAuth';
import { useLogistics } from '@/features/logistics/hooks/useLogistics';
import { logout } from '@/features/logistics/services/authService';
import { truckReceptionService, TruckReception } from '@/services/truckReceptionService';
import { localStorageService } from '@/services/localStorage.service';
import { useSerialPort } from '@/hooks/useSerialPort';
import { Button } from '@/shared/components/ui/Button/Button';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import Select from '@/shared/components/ui/Select/Select';
import Badge from '@/shared/components/ui/Badge/Badge';
import Alert from '@/shared/components/ui/Alert/Alert';

export default function WeighingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { setError } = useLogistics();

  // Serial Port Hook
  const { isConnected: serialConnected, lastWeight } = useSerialPort(true);

  // Estado de UI
  const [selectedTruckId, setSelectedTruckId] = useState<number | null>(null);
  const [showNewReceptionForm, setShowNewReceptionForm] = useState(false);
  const [trucks, setTrucks] = useState<TruckReception[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Formularios
  const [newReceptionForm, setNewReceptionForm] = useState({
    producer_id: '',
    license_plate: '',
    driver_name: '',
    carrier_company: '',
    dispatch_guide: '',
    gross_weight: '',
  });

  const [tareWeightForm, setTareWeightForm] = useState({
    tare_weight: '',
  });

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cargar turnos de hoy al iniciar
  useEffect(() => {
    if (isAuthenticated) {
      loadTurnosToday();
      // Sincronizar cola cada 30 segundos
      const syncInterval = setInterval(() => {
        truckReceptionService.syncPendingQueue();
      }, 30000);

      return () => clearInterval(syncInterval);
    }
  }, [isAuthenticated]);

  // Cargar turnos del día
  const loadTurnosToday = async () => {
    setIsLoading(true);
    try {
      const turnos = await truckReceptionService.getTurnosToday();
      setTrucks(turnos);
    } catch (error) {
      console.error('Error cargando turnos:', error);
      setError('Error cargando turnos del día');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleCreateReception = async () => {
    try {
      if (!newReceptionForm.producer_id || !newReceptionForm.license_plate || !newReceptionForm.driver_name || !newReceptionForm.gross_weight) {
        setError('Completa todos los campos requeridos');
        return;
      }

      const gross_weight = parseFloat(newReceptionForm.gross_weight);
      if (gross_weight <= 0) {
        setError('El peso bruto debe ser mayor a 0');
        return;
      }

      const newTruck = await truckReceptionService.createWithGrossWeight({
        producer_id: parseInt(newReceptionForm.producer_id),
        license_plate: newReceptionForm.license_plate,
        driver_name: newReceptionForm.driver_name,
        carrier_company: newReceptionForm.carrier_company,
        dispatch_guide: newReceptionForm.dispatch_guide,
        gross_weight: gross_weight,
        created_by: user?.email,
      });

      setTrucks([...trucks, newTruck]);
      setNewReceptionForm({
        producer_id: '',
        license_plate: '',
        driver_name: '',
        carrier_company: '',
        dispatch_guide: '',
        gross_weight: '',
      });
      setShowNewReceptionForm(false);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error creando recepción: ${msg}`);
    }
  };

  const handleRecordTareWeight = async () => {
    if (!selectedTruckId) {
      setError('No hay camión seleccionado');
      return;
    }

    try {
      if (!tareWeightForm.tare_weight) {
        setError('Ingresa el peso tara');
        return;
      }

      const tare_weight = parseFloat(tareWeightForm.tare_weight);
      if (tare_weight <= 0) {
        setError('El peso tara debe ser mayor a 0');
        return;
      }

      const selectedTruck = trucks.find(t => t.id === selectedTruckId);
      if (!selectedTruck || !selectedTruck.gross_weight) {
        setError('No hay peso bruto registrado');
        return;
      }

      const net_weight = selectedTruck.gross_weight - tare_weight;
      if (net_weight <= 0) {
        setError('El peso neto debe ser mayor a 0');
        return;
      }

      const finishedTruck = await truckReceptionService.recordTareWeight({
        truck_reception_id: selectedTruckId,
        tare_weight: tare_weight,
        created_by: user?.email,
      });

      setTrucks(trucks.map(t => (t.id === selectedTruckId ? finishedTruck : t)));
      setSelectedTruckId(null);
      setTareWeightForm({ tare_weight: '' });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      setError(`Error registrando tara: ${msg}`);
    }
  };

  const selectedTruck = trucks.find(t => t.id === selectedTruckId);
  const trucksByStatus = {
    ESPERA: trucks.filter(t => t.status === 'ESPERA'),
    FINISHED: trucks.filter(t => t.status === 'FINISHED'),
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">Panel de Pesaje</h1>
              <p className="text-sm text-foreground mt-1">
                Operador: {user?.name || 'Unknown'} {serialConnected && '• Balanza: Conectada'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-error text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white shadow-lg border-r border-border overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Nueva Recepción */}
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setShowNewReceptionForm(!showNewReceptionForm)}
            >
              + Nueva Recepción
            </Button>

            {showNewReceptionForm && (
              <div className="p-3 bg-neutral rounded-lg border border-border space-y-2">
                <Select
                  label="Productor"
                  value={newReceptionForm.producer_id}
                  onChange={(value) =>
                    setNewReceptionForm({ ...newReceptionForm, producer_id: value?.toString() || '' })
                  }
                  options={[
                    { id: '1', label: 'Campo Verde S.A.' },
                    { id: '2', label: 'Agrícola del Centro' },
                    { id: '3', label: 'La Huerta' },
                  ]}
                />
                <TextField
                  label="Patente"
                  value={newReceptionForm.license_plate}
                  onChange={(e) =>
                    setNewReceptionForm({ ...newReceptionForm, license_plate: e.target.value })
                  }
                  placeholder="ABC-1234"
                />
                <TextField
                  label="Chofer"
                  value={newReceptionForm.driver_name}
                  onChange={(e) =>
                    setNewReceptionForm({ ...newReceptionForm, driver_name: e.target.value })
                  }
                  placeholder="Nombre"
                />
                <TextField
                  label="Empresa de Transporte"
                  value={newReceptionForm.carrier_company}
                  onChange={(e) =>
                    setNewReceptionForm({ ...newReceptionForm, carrier_company: e.target.value })
                  }
                  placeholder="Opcional"
                />
                <TextField
                  label="Guía de Despacho"
                  value={newReceptionForm.dispatch_guide}
                  onChange={(e) =>
                    setNewReceptionForm({ ...newReceptionForm, dispatch_guide: e.target.value })
                  }
                  placeholder="Opcional"
                />
                <TextField
                  label="Peso Bruto (kg)"
                  type="number"
                  value={newReceptionForm.gross_weight || (lastWeight ? lastWeight.toString() : '')}
                  onChange={(e) =>
                    setNewReceptionForm({ ...newReceptionForm, gross_weight: e.target.value })
                  }
                  placeholder={serialConnected ? `Desde balanza: ${lastWeight || '—'} kg` : 'Ingresa manualmente'}
                />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    className="flex-1 text-sm"
                    onClick={handleCreateReception}
                  >
                    Crear
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 text-sm"
                    onClick={() => setShowNewReceptionForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Turnos por Estado */}
            <div className="space-y-3">
              {['ESPERA', 'FINISHED'].map((estado) => (
                <div key={estado}>
                  <div className="text-xs font-semibold text-muted uppercase mb-2">
                    {estado === 'ESPERA' ? 'En Espera' : 'Finalizados'}
                    <span className="ml-2 font-bold text-primary">({trucksByStatus[estado as keyof typeof trucksByStatus].length})</span>
                  </div>
                  <div className="space-y-1 ml-2">
                    {trucksByStatus[estado as keyof typeof trucksByStatus].map((truck) => (
                      <button
                        key={truck.id}
                        onClick={() => setSelectedTruckId(truck.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedTruckId === truck.id
                            ? 'bg-primary text-white font-semibold'
                            : 'bg-neutral text-foreground hover:bg-border'
                        }`}
                      >
                        <div className="font-mono font-bold">
                          {truck.license_plate}
                          {truck.numero_turno && (
                            <span className="ml-2 text-xs">#{truck.numero_turno}</span>
                          )}
                        </div>
                        <div className="text-xs opacity-75">{truck.driver_name}</div>
                      </button>
                    ))}
                    {trucksByStatus[estado as keyof typeof trucksByStatus].length === 0 && (
                      <p className="text-xs text-muted italic">Sin camiones</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-foreground mt-4">Cargando turnos del día...</p>
              </div>
            </div>
          ) : selectedTruck ? (
            <div className="max-w-2xl space-y-6">
              {/* Tarjeta del Camión */}
              <div className="bg-white rounded-lg shadow-lg border-l-4 border-primary p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-foreground">{selectedTruck.license_plate}</h2>
                      <Badge variant="primary">Turno #{selectedTruck.numero_turno}</Badge>
                    </div>
                    <p className="text-sm text-muted">
                      Estado: {selectedTruck.status === 'ESPERA' ? 'En Espera' : 'Finalizado'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted">Entrada:</div>
                    <div className="text-sm font-mono">
                      {new Date(selectedTruck.entry_at).toLocaleTimeString('es-CL')}
                    </div>
                  </div>
                </div>

                {/* Información del Camión */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                  <div>
                    <p className="text-xs text-muted">Chofer</p>
                    <p className="font-semibold text-foreground">{selectedTruck.driver_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Empresa de Transporte</p>
                    <p className="font-semibold text-foreground">{selectedTruck.carrier_company || '-'}</p>
                  </div>
                  {selectedTruck.dispatch_guide && (
                    <div>
                      <p className="text-xs text-muted">Guía de Despacho</p>
                      <p className="font-semibold text-foreground">{selectedTruck.dispatch_guide}</p>
                    </div>
                  )}
                </div>

                {/* Contenido según Estado */}
                {selectedTruck.status === 'ESPERA' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-neutral rounded-lg">
                      <div>
                        <p className="text-xs text-muted">Peso Bruto</p>
                        <p className="font-bold text-lg text-foreground">
                          {selectedTruck.gross_weight || '—'} kg
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Peso Tara</p>
                        <p className="font-bold text-lg text-foreground">
                          {tareWeightForm.tare_weight || '0'} kg
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-info/10 border border-info rounded-lg">
                      <p className="text-sm text-info font-medium">
                        El camión está descargando. Ingresa el peso tara cuando haya terminado.
                      </p>
                    </div>

                    <TextField
                      label="Peso Tara (kg)"
                      type="number"
                      value={tareWeightForm.tare_weight || (lastWeight ? lastWeight.toString() : '')}
                      onChange={(e) => setTareWeightForm({ tare_weight: e.target.value })}
                      placeholder={serialConnected ? `Desde balanza: ${lastWeight || '—'} kg` : 'Ingresa manualmente'}
                    />

                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={handleRecordTareWeight}
                      >
                        Finalizar Recepción
                      </Button>
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setSelectedTruckId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {selectedTruck.status === 'FINISHED' && (
                  <div className="space-y-4">
                    <Alert variant="success">✓ Recepción completada exitosamente</Alert>

                    <div className="grid grid-cols-3 gap-4 p-4 bg-success/10 border border-success rounded-lg">
                      <div>
                        <p className="text-xs text-muted">Peso Bruto</p>
                        <p className="font-bold text-foreground">{selectedTruck.gross_weight} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Peso Tara</p>
                        <p className="font-bold text-foreground">{selectedTruck.tare_weight} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Peso Neto</p>
                        <p className="font-bold text-foreground">{selectedTruck.net_weight} kg</p>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => setSelectedTruckId(null)}
                    >
                      Volver al Panel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl text-foreground font-semibold mb-2">Selecciona un camión</p>
                <p className="text-muted">Haz click en un camión de la barra lateral para comenzar</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
