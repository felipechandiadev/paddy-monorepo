/**
 * Roles available en el sistema
 * Admin: Acceso total
 */
export enum RoleEnum {
  ADMIN = 'ADMIN',
  CONSULTANT = 'CONSULTANT',
}

/**
 * Estados de una Recepción
 */
export enum ReceptionStatusEnum {
  CANCELLED = 'cancelled',        // Recepción cancelada
  ANALYZED = 'analyzed',          // Análisis completado
  SETTLED = 'settled',            // Liquidado (pagado)
}

/**
 * Estados de una Liquidación
 */
export enum SettlementStatusEnum {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/**
 * Estados de un Anticipo
 */
export enum AdvanceStatusEnum {
  PAID = 'paid',                  // Pagado (pendiente de liquidar)
  SETTLED = 'settled',            // Descontado
  CANCELLED = 'cancelled',        // Anulado
}

/**
 * Tipo de Transacción (Movimientos de dinero)
 */
export enum TransactionTypeEnum {
  ADVANCE = 'advance',            // Anticipo pre-cosecha
  PAYMENT = 'payment',            // Pago por recepción
  DEDUCTION = 'deduction',        // Descuento (secado, impurezas, etc.)
  INTEREST = 'interest',          // Interés por financiamiento
  REFUND = 'refund',              // Devolución
  SETTLEMENT = 'settlement',      // Liquidación final
}

/**
 * Tipo de Cuenta Bancaria
 */
export enum BankAccountTypeEnum {
  CORRIENTE = 'corriente',        // Cuenta corriente
  VISTA = 'vista',                // Cuenta vista
  AHORRO = 'ahorro',              // Cuenta de ahorro
  RUT = 'rut',                    // Cuenta RUT
}

/**
 * Nombre de Banco
 */
export enum BankNameEnum {
  BANCO_CHILE = 'Banco de Chile',
  BANCO_ESTADO = 'Banco del Estado de Chile',
  BANCO_SANTANDER = 'Banco Santander Chile',
  BANCO_BCI = 'Banco de Crédito e Inversiones',
  BANCO_FALABELLA = 'Banco Falabella',
  BANCO_SECURITY = 'Banco Security',
  BANCO_CREDICHILE = 'Banco CrediChile',
  BANCO_ITAU = 'Banco Itaú Corpbanca',
  BANCO_SCOTIABANK = 'Scotiabank Chile',
  BANCO_CONSORCIO = 'Banco Consorcio',
  BANCO_RIPLEY = 'Banco Ripley',
  BANCO_INTERNACIONAL = 'Banco Internacional',
  BANCO_BICE = 'Banco BICE',
  BANCO_PARIS = 'Banco Paris',
  BANCO_MERCADO_PAGO = 'Banco Mercado Pago',
  OTRO = 'Otro',
}

/**
 * Catálogo de permisos granulares del sistema.
 * El valor string (e.g. 'users.create') es lo que se persiste en BD como permission_key.
 */
export enum PermissionEnum {
  // Usuarios
  USERS_VIEW                   = 'users.view',
  USERS_CREATE                 = 'users.create',
  USERS_UPDATE                 = 'users.update',
  USERS_DELETE                 = 'users.delete',
  USERS_MANAGE_PERMISSIONS     = 'users.manage_permissions',

  // Productores
  PRODUCERS_VIEW               = 'producers.view',
  PRODUCERS_CREATE             = 'producers.create',
  PRODUCERS_UPDATE             = 'producers.update',
  PRODUCERS_DELETE             = 'producers.delete',

  // Tipos de Arroz
  RICE_TYPES_VIEW              = 'rice_types.view',
  RICE_TYPES_CREATE            = 'rice_types.create',
  RICE_TYPES_UPDATE            = 'rice_types.update',
  RICE_TYPES_DELETE            = 'rice_types.delete',

  // Temporadas
  SEASONS_VIEW                 = 'seasons.view',
  SEASONS_CREATE               = 'seasons.create',
  SEASONS_UPDATE               = 'seasons.update',
  SEASONS_DELETE               = 'seasons.delete',

  // Plantillas
  TEMPLATES_VIEW               = 'templates.view',
  TEMPLATES_CREATE             = 'templates.create',
  TEMPLATES_UPDATE             = 'templates.update',
  TEMPLATES_DELETE             = 'templates.delete',

  // Parámetros de Análisis
  ANALYSIS_PARAMS_VIEW         = 'analysis_params.view',
  ANALYSIS_PARAMS_CREATE       = 'analysis_params.create',
  ANALYSIS_PARAMS_UPDATE       = 'analysis_params.update',
  ANALYSIS_PARAMS_DELETE       = 'analysis_params.delete',

  // Recepciones
  RECEPTIONS_VIEW              = 'receptions.view',
  RECEPTIONS_CREATE            = 'receptions.create',
  RECEPTIONS_UPDATE            = 'receptions.update',
  RECEPTIONS_CANCEL            = 'receptions.cancel',

  // Registros de Análisis
  ANALYSIS_RECORDS_VIEW        = 'analysis_records.view',
  ANALYSIS_RECORDS_CREATE      = 'analysis_records.create',
  ANALYSIS_RECORDS_UPDATE      = 'analysis_records.update',

  // Anticipos
  ADVANCES_VIEW                = 'advances.view',
  ADVANCES_CREATE              = 'advances.create',
  ADVANCES_UPDATE              = 'advances.update',
  ADVANCES_CANCEL              = 'advances.cancel',
  ADVANCES_CHANGE_INTEREST     = 'advances.change_interest',

  // Transacciones
  TRANSACTIONS_VIEW            = 'transactions.view',

  // Liquidaciones
  SETTLEMENTS_VIEW             = 'settlements.view',
  SETTLEMENTS_CREATE           = 'settlements.create',
  SETTLEMENTS_SAVE             = 'settlements.save',
  SETTLEMENTS_COMPLETE         = 'settlements.complete',
  SETTLEMENTS_CANCEL           = 'settlements.cancel',

  // Servicios de Liquidación
  SETTLEMENT_SERVICES_VIEW     = 'settlement_services.view',
  SETTLEMENT_SERVICES_CREATE   = 'settlement_services.create',
  SETTLEMENT_SERVICES_UPDATE   = 'settlement_services.update',
  SETTLEMENT_SERVICES_DELETE   = 'settlement_services.delete',

  // Analíticas / Reportes
  ANALYTICS_VIEW               = 'analytics.view',
}

/**
 * Efecto de un override de permiso por usuario.
 * GRANT: concede explícitamente el permiso (aunque el rol no lo tenga por defecto).
 * REVOKE: revoca el permiso (aunque el rol lo tenga por defecto).
 */
export enum PermissionOverrideEffectEnum {
  GRANT  = 'GRANT',
  REVOKE = 'REVOKE',
}

/**
 * Método de Pago
 */
export enum PaymentMethodEnum {
  TRANSFER = 'transfer',          // Transferencia bancaria
  CHECK = 'check',                // Cheque
  CASH = 'cash',                  // Efectivo
}
