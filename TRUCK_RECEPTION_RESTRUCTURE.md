# TruckReception Entity - Restructured Architecture

## Overview

La entidad `TruckReception` ha sido completamente reestructurada para reflejar un modelo más limpio y profesional de gestión de recepciones de camiones en el sistema Paddy TMS.

## Database Schema

```sql
CREATE TABLE truck_receptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  status ENUM('WEIGHING_GROSS', 'WEIGHING_TARE', 'FINISHED') NOT NULL DEFAULT 'WEIGHING_GROSS',
  producer_id INT NOT NULL FOREIGN KEY,
  license_plate VARCHAR(50) NOT NULL,
  driver_name VARCHAR(100) NOT NULL,
  carrier_company VARCHAR(100),
  dispatch_guide VARCHAR(100),
  gross_weight DECIMAL(10,2),
  tare_weight DECIMAL(10,2),
  net_weight DECIMAL(10,2),
  entry_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at TIMESTAMP,
  created_by VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  INDEX idx_producer_id (producer_id),
  INDEX idx_status (status),
  INDEX idx_entry_at (entry_at)
)
```

## Field Mapping

| Old Field | New Field | Type | Notes |
|-----------|-----------|------|-------|
| id (UUID) | id (INT) | INT | Auto-increment primary key |
| numero_turno | ❌ REMOVED | - | Removed - ID is sufficient |
| patente | license_plate | VARCHAR(50) | Truck license plate |
| chofer_nombre | driver_name | VARCHAR(100) | Driver full name |
| rut_chofer | ❌ REMOVED | - | Removed - can be optional |
| ❌ | carrier_company | VARCHAR(100) | NEW - Transportation company |
| guia | dispatch_guide | VARCHAR(100) | Dispatch guide number |
| peso_bruto | gross_weight | DECIMAL(10,2) | Gross weight in kg |
| peso_tara | tare_weight | DECIMAL(10,2) | Tare weight in kg |
| peso_neto | net_weight | DECIMAL(10,2) | Net weight (calculated) |
| estado | status | ENUM | New status values |
| fecha_hora_entrada | entry_at | TIMESTAMP | Truck entry time |
| ❌ | finished_at | TIMESTAMP | NEW - Completion time |
| ❌ | numero_ticket | REMOVED | - |
| ❌ | pdf_url | REMOVED | - |
| ❌ | fecha_hora_peso_bruto | REMOVED | - |
| ❌ | fecha_hora_peso_tara | REMOVED | - |
| fecha_hora_finalizacion | finished_at | TIMESTAMP | Renamed |
| created_by | created_by | VARCHAR(100) | User who created record |
| created_at | created_at | TIMESTAMP | Creation timestamp |
| updated_at | updated_at | TIMESTAMP | Last update timestamp |
| deleted_at | deleted_at | TIMESTAMP | Soft delete timestamp |

## Status Flow

```
WEIGHING_GROSS
       ↓
  (record gross weight)
       ↓
WEIGHING_TARE
       ↓
  (record tare weight + calculate net weight)
       ↓
FINISHED
```

### Status Details

| Status | Description | Allowed Actions |
|--------|-------------|-----------------|
| **WEIGHING_GROSS** | Awaiting gross weight registration | Register gross weight |
| **WEIGHING_TARE** | Awaiting tare weight registration | Register tare weight |
| **FINISHED** | Reception completed with net weight calculated | View results |

## Backend Changes

### Entity Definition
- Location: `/backend/src/modules/logistics/domain/truck-reception.entity.ts`
- ID changed from UUID to auto-increment INT
- All field names updated to English camelCase
- Status enum updated

### DTOs
- **CreateTruckDto**: Updated with new field names
- **RegisterWeighingDto**: Supports new status values and weight fields

### Service Methods
All methods in `LogisticsService` have been updated:
- `createTruckReception()`
- `registerWeighing()`
- `getTruckReceptionById(id: number)`
- `getAllTruckReceptions()`
- `getTruckReceptionsByProducerId()`
- `getTruckReceptionsByStatus()`
- `updateTruckReception()`
- `cancelTruckReception()`
- `getReceptionStats()`

### Controller
- Location: `/backend/src/modules/logistics/presentation/logistics.controller.ts`
- All endpoints updated to use new field names
- ID parsing updated to handle INT instead of UUID

### Migrations
- **1724000000001**: CreateTruckReceptionsTable (initial)
- **1724000000002**: RemoveWeightTimestampFields (cleanup)
- **1724000000003**: RestructureTruckReceptionsTable (complete restructure)

## Frontend Changes

### WeighingPage Component
- Location: `/paddy-tms/src/app/weighing/page.tsx`
- Updated interface `TruckReceptionUI` with new fields
- Updated state management to reflect new status values
- Updated form fields to use new names
- Updated display logic for new status workflow

### New Features in UI
- Added "Carrier Company" field
- Added "Dispatch Guide" field
- Improved status visualization
- Simplified truck list organization

## API Endpoints

All endpoints remain the same but with updated field names in request/response bodies:

```
POST   /api/v1/logistics/truck-receptions           # Create truck reception
POST   /api/v1/logistics/weighings                  # Register weighing
GET    /api/v1/logistics/truck-receptions           # List all receptions
GET    /api/v1/logistics/truck-receptions/:id       # Get by ID (now INT)
GET    /api/v1/logistics/producers/:producerId/truck-receptions
GET    /api/v1/logistics/truck-receptions/status/:status
PUT    /api/v1/logistics/truck-receptions/:id       # Update reception
DELETE /api/v1/logistics/truck-receptions/:id       # Cancel reception
GET    /api/v1/logistics/stats/overview             # Statistics
```

## Example Request/Response

### Create Truck Reception
```json
// Request
POST /api/v1/logistics/truck-receptions
{
  "producer_id": 1,
  "license_plate": "XYZ-88",
  "driver_name": "Juan Pérez",
  "carrier_company": "Transportes Rápido",
  "dispatch_guide": "DG-001",
  "created_by": "operator@paddy.cl"
}

// Response
{
  "success": true,
  "message": "Camión registrado exitosamente",
  "data": {
    "id": 1,
    "status": "WEIGHING_GROSS",
    "producer_id": 1,
    "license_plate": "XYZ-88",
    "driver_name": "Juan Pérez",
    "carrier_company": "Transportes Rápido",
    "dispatch_guide": "DG-001",
    "entry_at": "2026-04-21T22:30:00Z",
    "created_by": "operator@paddy.cl",
    "created_at": "2026-04-21T22:30:00Z",
    "updated_at": "2026-04-21T22:30:00Z"
  }
}
```

### Register Weighing
```json
// Request
POST /api/v1/logistics/weighings
{
  "truck_reception_id": 1,
  "status": "WEIGHING_GROSS",
  "gross_weight": 2500
}

// Response
{
  "success": true,
  "message": "Pesaje registrado exitosamente",
  "data": {
    "id": 1,
    "status": "WEIGHING_GROSS",
    "gross_weight": 2500,
    "entry_at": "2026-04-21T22:30:00Z",
    ...
  }
}
```

## Database Migrations

To apply all changes, run:
```bash
npm run db:migrate
```

This will execute all pending migrations in order:
1. CreateTruckReceptionsTable (if not already run)
2. RemoveWeightTimestampFields
3. RestructureTruckReceptionsTable

## Breaking Changes

⚠️ **Important**: This is a breaking change from the previous structure:

- **ID format**: UUID → INT (auto-increment)
- **Field names**: Spanish → English (camelCase)
- **Status values**: Changed entirely
- **Removed fields**: numero_turno, rut_chofer, numero_ticket, pdf_url, fecha_hora_peso_bruto, fecha_hora_peso_tara
- **API response format**: All field names changed

## Migration Notes

- All existing truck receptions in the database will be lost during migration
- The table is completely recreated with the new schema
- Consider backing up the database before migration if needed
- No data migration path is provided as this is a restructuring, not an update

## Next Steps

1. ✅ Backend entity and DTOs updated
2. ✅ Database migrations created and applied
3. ✅ Service layer updated
4. ✅ Controller endpoints updated
5. ✅ Frontend component updated
6. 🔲 Integration testing with real data
7. 🔲 WebSocket real-time synchronization
8. 🔲 Ticket PDF generation
9. 🔲 Export reports functionality

