'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/logistics/hooks/useAuth';
import { useLogistics } from '@/features/logistics/hooks/useLogistics';
import { logout } from '@/features/logistics/services/authService';
import { Button } from '@/shared/components/ui/Button/Button';
import { TextField } from '@/shared/components/ui/TextField/TextField';
import { Select } from '@/shared/components/ui/Select/Select';
import { Badge } from '@/shared/components/ui/Badge/Badge';
import Alert from '@/shared/components/ui/Alert/Alert';

interface TruckReceptionUI {
  id: string;
  numero_turno: number;
  patente: string;
  productor: string;
  chofer_nombre: string;
  rut_chofer?: string;
  estado: 'ESPERA' | 'PESANDO_BRUTO' | 'EN_DESCARGA' | 'PESANDO_TARA' | 'FINALIZADO';
  peso_bruto?: number;
  peso_tara?: number;
  fecha_entrada: Date;
  tiempoDescarga?: number;
}

export default function WeighingPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { setError } = useLogistics();
  
  // Estado de UI
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [showNewReceptionForm, setShowNewReceptionForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'ESPERA' | 'PESANDO_BRUTO' | 'EN_DESCARGA' | 'PESANDO_TARA' | 'FINALIZADO'>('ESPERA');
  
  // Datos de ejemplo (en producción vendría del backend)
  const [trucks, setTrucks] = useState<TruckReceptionUI[]>([
    {
      id: '1',
      numero_turno: 2,
      patente: 'XYZ-88',
      productor: 'Campo Verde S.A.',
      chofer_nombre: 'Juan Pérez',
      rut_chofer: '12.345.678-9',
      estado: 'ESPERA',
      fecha_entrada: new Date(),
    },
    {
      id: '2',
      numero_turno: 3,
      patente: 'ABC-34',
      productor: 'Agrícola del Centro',
      chofer_nombre: 'Carlos García',
      rut_chofer: '15.678.901-2',
      estado: 'PESANDO_BRUTO',
      peso_bruto: 2500,
      fecha_entrada: new Date(Date.now() - 1800000),
    },
    {
      id: '3',
      numero_turno: 5,
      patente: 'DEF-67',
      productor: 'La Huerta',
      chofer_nombre: 'Maria López',
      rut_chofer: '18.901.234-5',
      estado: 'EN_DESCARGA',
      peso_bruto: 3200,
      tiempoDescarga: 1132,
      fecha_entrada: new Date(Date.now() - 3600000),
    },
    {
      id: '4',
      numero_turno: 1,
      patente: 'JKL-91',
      productor: 'Campos Dorados',
      chofer_nombre: 'Roberto Silva',
      rut_chofer: '19.234.567-8',
      estado: 'PESANDO_TARA',
      peso_bruto: 2150,
      fecha_entrada: new Date(Date.now() - 5400000),
    },
  ]);

  const [newReception, setNewReception] = useState({
    productor: '',
    patente: '',
    guia: '',
    chofer: '',
    rut: '',
  });

  const [weighingForm, setWeighingForm] = useState({
    pesoBruto: '',
    pesoTara: '',
  });

  // Redireccionar si no está autenticado
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleCreateReception = () => {
    if (!newReception.productor || !newReception.patente || !newReception.chofer) {
      setError('Completa todos los campos requeridos');
      return;
    }

    const nuevoCamion: TruckReceptionUI = {
      id: Date.now().toString(),
      numero_turno: trucks.length + 1,
      patente: newReception.patente,
      productor: newReception.productor,
      chofer_nombre: newReception.chofer,
      rut_chofer: newReception.rut,
      estado: 'ESPERA',
      fecha_entrada: new Date(),
    };

    setTrucks([...trucks, nuevoCamion]);
    setNewReception({ productor: '', patente: '', guia: '', chofer: '', rut: '' });
    setShowNewReceptionForm(false);
  };

  const handleConfirmBruto = () => {
    if (!weighingForm.pesoBruto) {
      setError('Ingresa el peso bruto');
      return;
    }

    setTrucks(trucks.map(t => 
      t.id === selectedTruckId 
        ? { 
            ...t, 
            peso_bruto: parseFloat(weighingForm.pesoBruto),
            estado: 'EN_DESCARGA',
            tiempoDescarga: 0,
          }
        : t
    ));
    setWeighingForm({ pesoBruto: '', pesoTara: '' });
  };

  const handleConfirmTara = () => {
    if (!weighingForm.pesoTara) {
      setError('Ingresa el peso tara');
      return;
    }

    const pesoNeto = (trucks.find(t => t.id === selectedTruckId)?.peso_bruto || 0) - parseFloat(weighingForm.pesoTara);
    
    if (pesoNeto <= 0) {
      setError('El peso neto debe ser mayor a 0');
      return;
    }

    setTrucks(trucks.map(t => 
      t.id === selectedTruckId 
        ? { 
            ...t, 
            peso_tara: parseFloat(weighingForm.pesoTara),
            estado: 'FINALIZADO',
          }
        : t
    ));
    setWeighingForm({ pesoBruto: '', pesoTara: '' });
    setSelectedTruckId(null);
  };

  const selectedTruck = trucks.find(t => t.id === selectedTruckId);

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

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ESPERA': return '#2563a8';
      case 'PESANDO_BRUTO': return '#4CAF50';
      case 'EN_DESCARGA': return '#FFC107';
      case 'PESANDO_TARA': return '#FF9800';
      case 'FINALIZADO': return '#4CAF50';
      default: return '#6b7280';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'ESPERA': return 'En Espera';
      case 'PESANDO_BRUTO': return 'Pesaje Bruto';
      case 'EN_DESCARGA': return 'En Descarga';
      case 'PESANDO_TARA': return 'Pesaje Tara';
      case 'FINALIZADO': return 'Finalizado';
      default: return estado;
    }
  };

  const trucksByEstado = {
    ESPERA: trucks.filter(t => t.estado === 'ESPERA'),
    PESANDO_BRUTO: trucks.filter(t => t.estado === 'PESANDO_BRUTO'),
    EN_DESCARGA: trucks.filter(t => t.estado === 'EN_DESCARGA'),
    PESANDO_TARA: trucks.filter(t => t.estado === 'PESANDO_TARA'),
    FINALIZADO: trucks.filter(t => t.estado === 'FINALIZADO'),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">Panel de Pesaje</h1>
              <p className="text-sm text-foreground mt-1">
                Operador: {user?.name || 'Unknown'}
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
                  value={newReception.productor}
                  onChange={(e) => setNewReception({ ...newReception, productor: e.target.value })}
                  options={[
                    { value: 'Campo Verde S.A.', label: 'Campo Verde S.A.' },
                    { value: 'Agrícola del Centro', label: 'Agrícola del Centro' },
                    { value: 'La Huerta', label: 'La Huerta' },
                  ]}
                />
                <TextField
                  label="Patente"
                  value={newReception.patente}
                  onChange={(e) => setNewReception({ ...newReception, patente: e.target.value })}
                  placeholder="ABC-1234"
                />
                <TextField
                  label="Guía"
                  value={newReception.guia}
                  onChange={(e) => setNewReception({ ...newReception, guia: e.target.value })}
                  placeholder="Número guía"
                />
                <TextField
                  label="Chofer"
                  value={newReception.chofer}
                  onChange={(e) => setNewReception({ ...newReception, chofer: e.target.value })}
                  placeholder="Nombre"
                />
                <TextField
                  label="RUT"
                  value={newReception.rut}
                  onChange={(e) => setNewReception({ ...newReception, rut: e.target.value })}
                  placeholder="Opcional"
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

            {/* Estados */}
            <div className="space-y-3">
              {Object.entries(trucksByEstado).map(([estado, trucks]) => (
                <div key={estado}>
                  <div className="text-xs font-semibold text-muted uppercase mb-2 flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getEstadoColor(estado) }}
                    />
                    {getEstadoLabel(estado)}
                  </div>
                  <div className="space-y-1 ml-2">
                    {trucks.map(truck => (
                      <button
                        key={truck.id}
                        onClick={() => setSelectedTruckId(truck.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedTruckId === truck.id
                            ? 'bg-primary text-white font-semibold'
                            : 'bg-neutral text-foreground hover:bg-border'
                        }`}
                      >
                        <div className="font-mono font-bold">{truck.patente}</div>
                        <div className="text-xs opacity-75">Turno #{truck.numero_turno}</div>
                      </button>
                    ))}
                    {trucks.length === 0 && (
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
          {selectedTruck ? (
            <div className="max-w-2xl space-y-6">
              {/* Tarjeta del Camión Seleccionado */}
              <div className="bg-white rounded-lg shadow-lg border-l-4 p-6" style={{ borderLeftColor: getEstadoColor(selectedTruck.estado) }}>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-foreground">{selectedTruck.patente}</h2>
                      <Badge variant="primary">
                        Turno #{selectedTruck.numero_turno}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted">{getEstadoLabel(selectedTruck.estado)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted">Entrada:</div>
                    <div className="text-sm font-mono">
                      {selectedTruck.fecha_entrada.toLocaleTimeString('es-CL')}
                    </div>
                  </div>
                </div>

                {/* Información del Camión */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                  <div>
                    <p className="text-xs text-muted">Productor</p>
                    <p className="font-semibold text-foreground">{selectedTruck.productor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Chofer</p>
                    <p className="font-semibold text-foreground">{selectedTruck.chofer_nombre}</p>
                  </div>
                  {selectedTruck.rut_chofer && (
                    <div>
                      <p className="text-xs text-muted">RUT</p>
                      <p className="font-semibold text-foreground">{selectedTruck.rut_chofer}</p>
                    </div>
                  )}
                </div>

                {/* Contenido según Estado */}
                {selectedTruck.estado === 'ESPERA' && (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      setTrucks(trucks.map(t => 
                        t.id === selectedTruck.id 
                          ? { ...t, estado: 'PESANDO_BRUTO' }
                          : t
                      ));
                    }}
                  >
                    Ir a Pesaje Bruto
                  </Button>
                )}

                {selectedTruck.estado === 'PESANDO_BRUTO' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-info/10 border border-info rounded-lg">
                      <p className="text-sm text-info font-medium">
                        Ingresa el peso bruto del camión
                      </p>
                    </div>
                    <TextField
                      label="Peso Bruto (kg)"
                      type="number"
                      value={weighingForm.pesoBruto}
                      onChange={(e) => setWeighingForm({ ...weighingForm, pesoBruto: e.target.value })}
                      placeholder="Ej: 2500"
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={handleConfirmBruto}
                      >
                        Confirmar Peso Bruto
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

                {selectedTruck.estado === 'EN_DESCARGA' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-warning/10 border border-warning rounded-lg">
                      <p className="text-sm text-foreground font-medium">
                        Peso Bruto: <span className="font-bold">{selectedTruck.peso_bruto} kg</span>
                      </p>
                      <p className="text-xs text-muted mt-2">
                        Tiempo descargando: {Math.floor((selectedTruck.tiempoDescarga || 0) / 60)}:{String((selectedTruck.tiempoDescarga || 0) % 60).padStart(2, '0')}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => {
                        setTrucks(trucks.map(t => 
                          t.id === selectedTruck.id 
                            ? { ...t, estado: 'PESANDO_TARA' }
                            : t
                        ));
                      }}
                    >
                      Listo para Pesaje Tara
                    </Button>
                  </div>
                )}

                {selectedTruck.estado === 'PESANDO_TARA' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 p-4 bg-neutral rounded-lg">
                      <div>
                        <p className="text-xs text-muted">Peso Bruto</p>
                        <p className="font-bold text-lg text-foreground">{selectedTruck.peso_bruto} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Peso Tara</p>
                        <p className="font-bold text-lg text-foreground">{weighingForm.pesoTara || '0'} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Peso Neto</p>
                        <p className="font-bold text-lg text-success">
                          {weighingForm.pesoTara 
                            ? (selectedTruck.peso_bruto! - parseFloat(weighingForm.pesoTara)).toFixed(0) 
                            : '0'} kg
                        </p>
                      </div>
                    </div>
                    <TextField
                      label="Peso Tara (kg)"
                      type="number"
                      value={weighingForm.pesoTara}
                      onChange={(e) => setWeighingForm({ ...weighingForm, pesoTara: e.target.value })}
                      placeholder="Ej: 400"
                    />
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={handleConfirmTara}
                      >
                        Finalizar
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

                {selectedTruck.estado === 'FINALIZADO' && (
                  <div className="space-y-4">
                    <Alert variant="success">
                      ✓ Recepción completada exitosamente
                    </Alert>
                    <div className="grid grid-cols-3 gap-4 p-4 bg-success/10 border border-success rounded-lg">
                      <div>
                        <p className="text-xs text-muted">Peso Bruto</p>
                        <p className="font-bold text-foreground">{selectedTruck.peso_bruto} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Peso Tara</p>
                        <p className="font-bold text-foreground">{selectedTruck.peso_tara} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Peso Neto</p>
                        <p className="font-bold text-foreground">
                          {(selectedTruck.peso_bruto! - (selectedTruck.peso_tara || 0)).toFixed(0)} kg
                        </p>
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
