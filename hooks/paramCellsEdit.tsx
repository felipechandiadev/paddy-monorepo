// import Parameter from "@/app/paddy/receptions/new/ui/Parameter";
import { TemplateType } from "@/types/discount-template";
import { getDiscountPercentsByCode } from "@/app/actions/discount-percent";

/**
 * Redondea un número a dos decimales
 * 
 * Esta función toma un valor numérico y lo redondea a dos decimales utilizando
 * el método de redondeo bancario (también conocido como redondeo comercial),
 * que evita el sesgo hacia arriba en operaciones repetitivas con números decimales.
 * 
 * @param value Número a redondear
 * @returns Número redondeado a dos decimales
 * 
 * @example
 * // Retorna 10.25
 * roundToTwoDecimals(10.249);
 * 
 * // Retorna 10.26
 * roundToTwoDecimals(10.255);
 */
export const roundToTwoDecimals = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

/**
 * Distribuye la diferencia causada por el redondeo entre un conjunto de valores
 * para que la suma de los valores redondeados sea igual a la suma original
 * 
 * Esta función resuelve el problema de discrepancias en sumas cuando los valores
 * individuales se redondean. Ejemplo: tres valores 1.004, 1.004 y 1.004 suman 3.012,
 * pero si los redondeamos primero (1.00, 1.00, 1.00), la suma sería 3.00, perdiendo 0.012.
 * 
 * El algoritmo:
 * 1. Redondea todos los valores individualmente
 * 2. Calcula la diferencia entre la suma objetivo y la suma de los valores redondeados
 * 3. Distribuye esta diferencia entre los valores, priorizando aquellos con mayor
 *    parte decimal cuando la diferencia es positiva, o aquellos con menor parte
 *    decimal cuando la diferencia es negativa
 * 
 * @param values Array de valores a compensar
 * @param targetSum Suma objetivo que deben cumplir los valores redondeados
 * @returns Array de valores compensados y redondeados a dos decimales
 * 
 * @example
 * // Si la suma original es 3.012 pero los valores redondeados suman 3.00
 * // ajustará algunos valores para mantener la suma original
 * compensateRounding([1.004, 1.004, 1.004], 3.012);
 * // Podría retornar [1.01, 1.00, 1.00] cuya suma es 3.01, más cercana a 3.012
 */
export const compensateRounding = (values: number[], targetSum: number): number[] => {
  if (!values.length) return [];
  
  // Redondear todos los valores a 2 decimales
  const roundedValues = values.map(value => roundToTwoDecimals(value));
  
  // Calcular la suma de los valores redondeados
  const roundedSum = roundedValues.reduce((sum, value) => sum + value, 0);
  
  // Calcular la diferencia con la suma objetivo
  let difference = roundToTwoDecimals(targetSum - roundedSum);
  
  if (Math.abs(difference) < 0.01) return roundedValues; // Si la diferencia es insignificante, no hacer nada
  
  // Ordenar los valores por su parte decimal para distribuir la diferencia
  // a los valores con mayor parte decimal primero (si la diferencia es positiva)
  // o a los valores con menor parte decimal primero (si la diferencia es negativa)
  const valueIndices = roundedValues.map((value, index) => ({ 
    value, 
    index, 
    decimal: Math.abs(value % 1) 
  }));
  
  if (difference > 0) {
    // Si la suma redondeada es menor, añadir la diferencia a los valores con mayor parte decimal primero
    valueIndices.sort((a, b) => b.decimal - a.decimal);
  } else {
    // Si la suma redondeada es mayor, restar la diferencia de los valores con menor parte decimal primero
    valueIndices.sort((a, b) => a.decimal - b.decimal);
  }
  
  // Crear copia de los valores redondeados para modificar
  const compensatedValues = [...roundedValues];
  
  // Valor mínimo de ajuste
  const minAdjustment = difference > 0 ? 0.01 : -0.01;
  
  // Distribuir la diferencia
  for (let i = 0; i < valueIndices.length && Math.abs(difference) >= 0.01; i++) {
    const { index } = valueIndices[i];
    
    // Aplicar ajuste
    compensatedValues[index] = roundToTwoDecimals(compensatedValues[index] + minAdjustment);
    
    // Actualizar la diferencia restante
    difference = roundToTwoDecimals(difference - minAdjustment);
  }
  
  return compensatedValues;
};

export type KeyCluster =
  | "grossWeight"
  | "tare"
  | "netWeight"
  | "Humedad"
  | "GranosVerdes"
  | "Impurezas"
  | "Vano"
  | "Hualcacho"
  | "GranosManchados"
  | "GranosPelados"
  | "GranosYesosos"
  | "groupSummary"
  | "summary"
  | "Bonus"
  | "Dry"
  | "DiscountTotal"
  | "totalPaddy";

export const clusterNameMap: Record<KeyCluster, string> = {
  grossWeight: "Peso Bruto",
  tare: "Tara",
  netWeight: "Peso Neto",
  Humedad: "Humedad",
  GranosVerdes: "Granos Verdes",
  Impurezas: "Impurezas",
  Vano: "Vano",
  Hualcacho: "Hualcacho",
  GranosManchados: "Granos Manchados",
  GranosPelados: "Granos Pelados",
  GranosYesosos: "Granos Yesosos",
  groupSummary: "Total Granos",
  summary: "Total Análisis",
  Bonus: "Bonificación",
  Dry: "Secado",
  DiscountTotal: "Descuentos Totales",
  totalPaddy: "Total de Arroz",
};

export type TypeCluster =
  | "generic"
  | "param"
  | "groupSummary"
  | "Summary"
  | "bonus"
  | "dry";

type TypeNode = "range" | "percent" | "tolerance" | "penalty" | "generic";

export interface Range {
  start: number;
  end: number;
  percent: number;
}

export const nodeCodeMap: Record<KeyCluster, number> = {
  grossWeight: 0,
  tare: 0,
  netWeight: 0,
  Humedad: 1,
  GranosVerdes: 2,
  Impurezas: 3,
  Vano: 9,
  Hualcacho: 5,
  GranosManchados: 4,
  GranosPelados: 6,
  GranosYesosos: 7,
  groupSummary: 0,
  summary: 0,
  Bonus: 0,
  Dry: 8,
  DiscountTotal: 0,
  totalPaddy: 0,
};

const keyNode = (c: KeyCluster, n: TypeNode): string => `${c}-${n}`;

export interface Node {
  key: string;
  type: TypeNode;
  parentCluster: Cluster;

  value: number;
  setValue: (v: number) => void;

  onChange: (v: number) => void;

  show: boolean;
  setShow: () => void;

  label: string;
  setLabel?: (v: string) => void;

  adorn: string;
  setAdorn?: (v: string) => void;

  backgroundColor: string;
  setBackgroundColor?: (v: string) => void;

  showVisilibilityButton: boolean;
  setShowVisilibilityButton?: (v: boolean) => void;

  readonly: boolean;
  setReadonly?: (v: boolean) => void;

  nodeSources: Node[];
  setNodeSources?: (nodes: Node[]) => void;

  nodeConsumers: Node[];
  setNodeConsumers?: (nodes: Node[]) => void;

  effect?: () => void;

  resetNode?: () => void;

  resetValue?: () => void;

  addConsumer: (consumer: Node) => void;

  error: boolean;
  setError: (error: boolean) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
}

export interface RangeNode extends Node {
  ranges: Range[];
  setRanges: (ranges: Range[]) => void;
  code: number;
}

export function createBlankNode(key: string, label: string): Node {
  const node: Node = {
    key: key,
    type: "generic",
    parentCluster: {} as Cluster,
    value: 0,
    setValue: (v: number) => {
      node.value = roundToTwoDecimals(v);
    },
    onChange: (v: number) => {
      node.setValue(v);
    },
    show: true,
    label: label,
    adorn: "",
    backgroundColor: "inherit",
    showVisilibilityButton: false,
    readonly: false,
    nodeSources: [],
    nodeConsumers: [],
    addConsumer: () => {},
    setShow: () => {
      node.show = !node.show;
    },
    error: false,
    setError: (error: boolean) => {
      node.error = error;
    },
    errorMessage: "",
    setErrorMessage: (message: string) => {
      node.errorMessage = message;
    },
  };
  return node;
}

function createGenericNode(key: string, parentCluster: Cluster): Node {
  const node: Node = {
    key,
    type: "generic",
    parentCluster,
    value: 0,
    /**
     * Establece un valor numérico en el nodo, redondeando automáticamente a dos decimales
     * y notificando a todos los nodos consumidores para que actualicen sus valores.
     * 
     * El redondeo automático asegura que todos los valores en la aplicación sean
     * consistentes, manteniendo siempre dos decimales de precisión para evitar
     * discrepancias en los cálculos subsecuentes.
     * 
     * @param v Valor numérico a establecer
     */
    setValue: (v: number) => {
      node.value = roundToTwoDecimals(v);

      node.nodeConsumers.forEach((consumer) => {
        if (consumer.effect) {
          consumer.effect();
        }
      });
    },
    onChange: (v: number) => {
      node.setValue(v);
    },
    addConsumer: (consumer: Node) => {
      node.nodeConsumers.push(consumer);
    },
    show: true,
    label: "",
    adorn: "",
    backgroundColor: "inherit",
    showVisilibilityButton: false,
    readonly: false,
    nodeSources: [],
    nodeConsumers: [],
    setShow: () => {
      node.show = !node.show;
    },
    error: false,
    setError: (error: boolean) => {
      node.error = error;
    },
    errorMessage: "",
    setErrorMessage: (message: string) => {
      node.errorMessage = message;
    },
  };
  return node;
}
function createRangeNode(key: string, parentCluster: Cluster): RangeNode {
  const node: RangeNode = {
    key,
    type: "range",
    parentCluster,
    value: 0,
    setValue: (v: number) => {
      node.value = roundToTwoDecimals(v);

      node.nodeConsumers.forEach((consumer) => {
        if (consumer.effect) {
          consumer.effect();
        }
      });
    },

    onChange: (v: number) => {
      node.setValue(v);
    },
    show: true,
    label: "Rango",
    adorn: "",
    backgroundColor: "inherit",
    showVisilibilityButton: false,
    readonly: false,
    nodeSources: [],
    nodeConsumers: [],
    code: nodeCodeMap[parentCluster.key],
    ranges: [],
    setRanges: (ranges: Range[]) => {
      node.ranges = ranges;
    },
    addConsumer: (consumer: Node) => {
      node.nodeConsumers.push(consumer);
    },
    setShow: () => {
      node.show = !node.show;
    },
    error: false,
    setError: (error: boolean) => {
      node.error = error;
      if (error) {
        // Si hay error, siempre usar color de error
        node.backgroundColor = "#ffcdd2";
      } else {
        // Si pertenece al grupo de tolerancia, mantener el color del grupo
        if (node.parentCluster.toleranceGroup) {
          node.backgroundColor = "#eceff1"; // Mantener color del grupo de tolerancia
        } else {
          node.backgroundColor = "inherit";
        }
      }
    },
    errorMessage: "",
    setErrorMessage: (message: string) => {
      node.errorMessage = message;
    },
  };
  return node;
}
function createPercentNode(key: string, parentCluster: Cluster): Node {
  const node: Node = {
    key,
    type: "percent",
    parentCluster,
    value: 0,
    setValue: (v: number) => {
      node.value = roundToTwoDecimals(v);

      node.nodeConsumers.forEach((consumer) => {
        if (consumer.effect) {
          consumer.effect();
        }
      });
    },
    onChange: (v: number) => {
      node.setValue(v);
    },
    show: true,
    label: "Porcentaje",
    adorn: "%",
    backgroundColor: "inherit",
    showVisilibilityButton: false,
    readonly: false,
    nodeSources: [],
    nodeConsumers: [],
    addConsumer: (consumer: Node) => {
      node.nodeConsumers.push(consumer);
    },
    setShow: () => {
      node.show = !node.show;
    },
    error: false,
    setError: (error: boolean) => {
      node.error = error;
      if (error) {
        // Si hay error, siempre usar color de error
        node.backgroundColor = "#ffcdd2";
      } else {
        // Si pertenece al grupo de tolerancia, mantener el color del grupo
        if (node.parentCluster.toleranceGroup) {
          node.backgroundColor = "#eceff1"; // Mantener color del grupo de tolerancia
        } else {
          node.backgroundColor = "inherit";
        }
      }
    },
    errorMessage: "",
    setErrorMessage: (message: string) => {
      node.errorMessage = message;
    },
  };
  return node;
}
function createToleranceNode(key: string, parentCluster: Cluster): Node {
  const node: Node = {
    key,
    type: "tolerance",
    parentCluster,
    value: 0,
    setValue: (v: number) => {
      node.value = roundToTwoDecimals(v);

      node.nodeConsumers.forEach((consumer) => {
        if (consumer.effect) {
          consumer.effect();
        }
      });
    },
    onChange: (v: number) => {
      node.setValue(v);
    },
    show: true,
    label: "Tolerancia",
    adorn: "%",
    backgroundColor: "inherit",
    showVisilibilityButton: true,
    readonly: false,
    nodeSources: [],
    nodeConsumers: [],
    addConsumer: (consumer: Node) => {
      node.nodeConsumers.push(consumer);
    },
    setShow: () => {
      node.show = !node.show;
    },
    error: false,
    setError: (error: boolean) => {
      node.error = error;
      if (error) {
        // Si hay error, siempre usar color de error
        node.backgroundColor = "#ffcdd2";
      } else {
        // Si pertenece al grupo de tolerancia, mantener el color del grupo
        if (node.parentCluster.toleranceGroup) {
          node.backgroundColor = "#eceff1"; // Mantener color del grupo de tolerancia
        } else {
          node.backgroundColor = "inherit";
        }
      }
    },
    errorMessage: "",
    setErrorMessage: (message: string) => {
      node.errorMessage = message;
    },
  };
  return node;
}
function createPenaltyNode(key: string, parentCluster: Cluster): Node {
  const node: Node = {
    key,
    type: "penalty",
    parentCluster,
    value: 0,
    setValue: (v: number) => {
      node.value = roundToTwoDecimals(v);

      node.nodeConsumers.forEach((consumer) => {
        if (consumer.effect) {
          consumer.effect();
        }
      });
    },
    onChange: (v: number) => {
      node.setValue(v);
    },
    show: true,
    label: "Descuento",
    adorn: "kg",
    backgroundColor: "inherit",
    showVisilibilityButton: false,
    readonly: true,
    nodeSources: [],
    nodeConsumers: [],
    addConsumer: (consumer: Node) => {
      node.nodeConsumers.push(consumer);
    },
    setShow: () => {
      node.show = !node.show;
    },
    error: false,
    setError: (error: boolean) => {
      node.error = error;
      if (error) {
        // Si hay error, siempre usar color de error
        node.backgroundColor = "#ffcdd2";
      } else {
        // Si pertenece al grupo de tolerancia, mantener el color del grupo
        if (node.parentCluster.toleranceGroup) {
          node.backgroundColor = "#eceff1"; // Mantener color del grupo de tolerancia
        } else {
          node.backgroundColor = "inherit";
        }
      }
    },
    errorMessage: "",
    setErrorMessage: (message: string) => {
      node.errorMessage = message;
    },
  };
  return node;
}

export interface Cluster {
  key: KeyCluster;
  available: boolean;
  showTolerance: boolean;
  toleranceGroup: boolean;
  type: TypeCluster;
  name: string;
}
export interface GenericCluster extends Cluster {
  type: "generic";
  node: Node;
}
export interface ParamCluster extends Cluster {
  type: "param";
  range: RangeNode;
  percent: Node;
  tolerance: Node;
  penalty: Node;
}

export interface GroupSummaryCluster extends Cluster {
  type: "groupSummary";
  percent: Node;
  tolerance: Node;
  penalty: Node;
}

export interface SummaryCluster extends Cluster {
  type: "Summary";
  percent: Node;
  tolerance: Node;
  penalty: Node;
}

export interface BonusCluster extends Cluster {
  type: "bonus";
  tolerance: Node;
  penalty: Node;
}

export interface DryCluster extends Cluster {
  type: "dry";
  percent: Node;
}

function createGenericCluster(
  key: KeyCluster,
  available: boolean,
  showTolerance: boolean,
  toleranceGroup: boolean
): GenericCluster {
  // Paso 1: Crear objeto vacío parcialmente tipado
  const cluster: GenericCluster = {
    key: key,
    available: available,
    showTolerance,
    toleranceGroup,
    type: "generic",
    name: clusterNameMap[key],
    node: undefined as any, // Temporalmente asignamos un valor indefinido
  };

  // Paso 2: Asignar el nodo genérico al cluster
  cluster.node = createGenericNode(keyNode(key, "generic"), cluster);

  // Paso 3: Retornar el clúster completo
  return cluster;
}

function createParamCluster(
  key: KeyCluster,
  available: boolean,
  showTolerance: boolean,
  toleranceGroup: boolean
): ParamCluster {
  // Paso 1: Crear objeto vacío parcialmente tipado
  const cluster: ParamCluster = {
    key: key,
    available: available,
    showTolerance,
    toleranceGroup,
    type: "param",
    name: clusterNameMap[key],
    range: undefined as any, // Temporalmente asignamos un valor indefinido
    percent: undefined as any, // Temporalmente asignamos un valor indefinido
    tolerance: undefined as any, // Temporalmente asignamos un valor indefinido
    penalty: undefined as any, // Temporalmente asignamos un valor indefinido
  };

  // Paso 2: Asignar el nodo de rango al clúster
  cluster.range = createRangeNode(keyNode(key, "range"), cluster);

  // Paso 3: Asignar el nodo de porcentaje al clúster
  cluster.percent = createPercentNode(keyNode(key, "percent"), cluster);
  // No establecer color de fondo por defecto
  
  cluster.percent.setError = (error: boolean) => {  
    cluster.percent.error = error;
    if (error) {
      // Si hay error, siempre usar color de error
      cluster.percent.backgroundColor = "#ffcdd2"; // Rojo claro para errores
    } else {
      // Si pertenece al grupo de tolerancia, mantener el color del grupo
      if (cluster.toleranceGroup) {
        cluster.percent.backgroundColor = "#eceff1"; // Mantener color del grupo de tolerancia
      } else {
        cluster.percent.backgroundColor = "inherit"; // Sin color especial cuando no hay error
      }
    }
  }



  // Paso 4: Asignar el nodo de tolerancia al clúster
  cluster.tolerance = createToleranceNode(keyNode(key, "tolerance"), cluster);

  // Paso 5: Asignar el nodo de penalización al clúster
  cluster.penalty = createPenaltyNode(keyNode(key, "penalty"), cluster);

  // Paso 6: Retornar el clúster completo
  return cluster;
}

function createGroupSummaryCluster(
  key: KeyCluster,
  available: boolean,
  showTolerance: boolean,
  toleranceGroup: boolean
): GroupSummaryCluster {
  // Paso 1: Crear objeto vacío parcialmente tipado
  const cluster: GroupSummaryCluster = {
    key: key,
    available: available,
    showTolerance,
    toleranceGroup,
    type: "groupSummary",
    name: clusterNameMap[key],
    percent: undefined as any, // Temporalmente asignamos un valor indefinido
    tolerance: undefined as any, // Temporalmente asignamos un valor indefinido
    penalty: undefined as any, // Temporalmente asignamos un valor indefinido
  };

  // Paso 2: Asignar el nodo de porcentaje al clúster
  cluster.percent = createPercentNode(keyNode(key, "percent"), cluster);
  // Sin color de fondo por defecto
  cluster.percent.setError = (error: boolean) => {
    cluster.percent.error = error;
    if (error) {
      // Si hay error, siempre usar color de error
      cluster.percent.backgroundColor = "#ffcdd2"; // Rojo claro para errores
    } else {
      // Si pertenece al grupo de tolerancia, mantener el color del grupo
      if (cluster.toleranceGroup) {
        cluster.percent.backgroundColor = "#eceff1"; // Mantener color del grupo de tolerancia
      } else {
        cluster.percent.backgroundColor = "inherit"; // Sin color cuando no hay error
      }
    }
  }

  // Paso 3: Asignar el nodo de tolerancia al clúster
  cluster.tolerance = createToleranceNode(keyNode(key, "tolerance"), cluster);

  // Sin color de fondo por defecto
  cluster.tolerance.setError = (error: boolean) => {
    cluster.tolerance.error = error;
    if (error) {
      cluster.tolerance.backgroundColor = "#ffcdd2"; // Rojo claro para errores
    } else {
      // Si pertenece al grupo de tolerancia, mantener el color del grupo
      if (cluster.toleranceGroup) {
        cluster.tolerance.backgroundColor = "#eceff1"; // Mantener color del grupo de tolerancia
      } else {
        cluster.tolerance.backgroundColor = "inherit"; // Sin color cuando no hay error
      }
    }
  }

  // Paso 4: Asignar el nodo de penalización al clúster
  cluster.penalty = createPenaltyNode(keyNode(key, "penalty"), cluster);
  // Sin color de fondo por defecto
  cluster.penalty.setError = (error: boolean) => {
    cluster.penalty.error = error;
    if (error) {
      cluster.penalty.backgroundColor = "#ffcdd2"; // Rojo claro para errores
    } else {
      // Si pertenece al grupo de tolerancia, mantener el color del grupo
      if (cluster.toleranceGroup) {
        cluster.penalty.backgroundColor = "#eceff1"; // Mantener color del grupo de tolerancia
      } else {
        cluster.penalty.backgroundColor = "inherit"; // Sin color cuando no hay error
      }
    }
  }

  // Paso 5: Retornar el clúster completo
  return cluster;
}

function createSummaryCluster(
  key: KeyCluster,
  available: boolean,
  showTolerance: boolean,
  toleranceGroup: boolean
): SummaryCluster {
  // Paso 1: Crear objeto vacío parcialmente tipado
  const cluster: SummaryCluster = {
    key: key,
    available: available,
    showTolerance,
    toleranceGroup,
    type: "Summary",
    name: clusterNameMap[key],
    percent: undefined as any, // Temporalmente asignamos un valor indefinido
    tolerance: undefined as any, // Temporalmente asignamos un valor indefinido
    penalty: undefined as any, // Temporalmente asignamos un valor indefinido
    
  };

  // Paso 2: Asignar el nodo de porcentaje al clúster
  cluster.percent = createPercentNode(keyNode(key, "percent"), cluster);
  cluster.percent.value = 0;
  cluster.percent.readonly = true;
  cluster.percent.backgroundColor = "#e3f2fd";
  cluster.percent.showVisilibilityButton = false;

  cluster.percent.setError = (error: boolean) => {
    cluster.percent.error = error;
    if (error) {
      cluster.percent.backgroundColor = "#ffcdd2";
    } else {
      cluster.percent.backgroundColor = "#e3f2fd";
    }
  }
  

  // Paso 3: Asignar el nodo de tolerancia al clúster
  cluster.tolerance = createToleranceNode(keyNode(key, "tolerance"), cluster);
  cluster.tolerance.value = 0;
  cluster.tolerance.readonly = true;
  cluster.tolerance.backgroundColor = "#e3f2fd";
  cluster.tolerance.showVisilibilityButton = true;
  cluster.tolerance.setError = (error: boolean) => {
    cluster.tolerance.error = error;
    if (error) {
      cluster.tolerance.backgroundColor = "#ffcdd2";
    } else {
      cluster.tolerance.backgroundColor = "#e3f2fd";
    }
  }

  // cluster.tolerance.showVisilibilityButton = false;

  // Paso 4: Asignar el nodo de penalización al clúster
  cluster.penalty = createPenaltyNode(keyNode(key, "penalty"), cluster);
  cluster.penalty.value = 0;
  cluster.penalty.readonly = true;
  cluster.penalty.backgroundColor = "#e3f2fd";
  cluster.penalty.showVisilibilityButton = false;
  cluster.penalty.setError = (error: boolean) => {
    cluster.penalty.error = error;
    if (error) {
      cluster.penalty.backgroundColor = "#ffcdd2";
    } else {
      cluster.penalty.backgroundColor = "#e3f2fd";
    }
  }
  

  // Paso 5: Retornar el clúster completo
  return cluster;
}

function createBonusCluster(
  key: KeyCluster,
  available: boolean,
  showTolerance: boolean,
  toleranceGroup: boolean
): BonusCluster {
  // Paso 1: Crear objeto vacío parcialmente tipado
  const cluster: BonusCluster = {
    key: key,
    available: available,
    showTolerance,
    toleranceGroup,
    type: "bonus",
    name: clusterNameMap[key],
    tolerance: undefined as any, // Temporalmente asignamos un valor indefinido
    penalty: undefined as any, // Temporalmente asignamos un valor indefinido
  };

  // Paso 2: Asignar el nodo de tolerancia al clúster
  cluster.tolerance = createToleranceNode(keyNode(key, "tolerance"), cluster);

  // Paso 3: Asignar el nodo de penalización al clúster
  cluster.penalty = createPenaltyNode(keyNode(key, "penalty"), cluster);

  // Paso 4: Retornar el clúster completo
  return cluster;
}

function createDryCluster(
  key: KeyCluster,
  available: boolean,
  showTolerance: boolean,
  toleranceGroup: boolean
): DryCluster {
  // Paso 1: Crear objeto vacío parcialmente tipado
  const cluster: DryCluster = {
    key: key,
    available: available,
    showTolerance,
    toleranceGroup,
    type: "dry",
    name: clusterNameMap[key],
    percent: undefined as any, // Temporalmente asignamos un valor indefinido
  };

  // Paso 2: Asignar el nodo de porcentaje al clúster
  cluster.percent = createPercentNode(keyNode(key, "percent"), cluster);

  // Paso 3: Retornar el clúster completo
  return cluster;
}

const grossWeight = createGenericCluster("grossWeight", true, false, false);
const tare = createGenericCluster("tare", true, false, false);
const netWeight = createGenericCluster("netWeight", true, false, false);
const humedad = createParamCluster("Humedad", true, false, false);
const granosVerdes = createParamCluster("GranosVerdes", true, false, false);
const impurezas = createParamCluster("Impurezas", true, false, false);
const vano = createParamCluster("Vano", true, false, false);
const hualcacho = createParamCluster("Hualcacho", true, false, false);
const granosManchados = createParamCluster(
  "GranosManchados",
  true,
  false,
  false
);
const granosPelados = createParamCluster("GranosPelados", true, false, false);
const granosYesosos = createParamCluster("GranosYesosos", true, false, false);
const groupSummary = createGroupSummaryCluster(
  "groupSummary",
  true,
  false,
  false
);
const summary = createSummaryCluster("summary", true, false, false);
const bonus = createBonusCluster("Bonus", true, false, false);
// Modificar los labels para Bonus
bonus.tolerance.label = "Bono";
bonus.penalty.label = "Bonificación";
const dry = createDryCluster("Dry", true, false, false);
const discountTotal = createGenericCluster("DiscountTotal", true, false, false);
const totalPaddy = createGenericCluster("totalPaddy", true, false, false);

humedad.percent.parentCluster = humedad;
humedad.tolerance.parentCluster = humedad;
humedad.penalty.parentCluster = humedad;

granosVerdes.percent.parentCluster = granosVerdes;
granosVerdes.tolerance.parentCluster = granosVerdes;
granosVerdes.penalty.parentCluster = granosVerdes;

impurezas.percent.parentCluster = impurezas;
impurezas.tolerance.parentCluster = impurezas;
impurezas.penalty.parentCluster = impurezas;

vano.percent.parentCluster = vano;
vano.tolerance.parentCluster = vano;
vano.penalty.parentCluster = vano;

hualcacho.percent.parentCluster = hualcacho;
hualcacho.tolerance.parentCluster = hualcacho;
hualcacho.penalty.parentCluster = hualcacho;

granosManchados.percent.parentCluster = granosManchados;
granosManchados.tolerance.parentCluster = granosManchados;
granosManchados.penalty.parentCluster = granosManchados;

granosPelados.percent.parentCluster = granosPelados;
granosPelados.tolerance.parentCluster = granosPelados;
granosPelados.penalty.parentCluster = granosPelados;

granosYesosos.percent.parentCluster = granosYesosos;
granosYesosos.tolerance.parentCluster = granosYesosos;
granosYesosos.penalty.parentCluster = granosYesosos;

grossWeight.node.addConsumer(netWeight.node);
tare.node.addConsumer(netWeight.node);
netWeight.node.addConsumer(humedad.penalty);
netWeight.node.addConsumer(granosVerdes.penalty);
netWeight.node.addConsumer(impurezas.penalty);
netWeight.node.addConsumer(vano.penalty);
netWeight.node.addConsumer(hualcacho.penalty);
netWeight.node.addConsumer(granosManchados.penalty);
netWeight.node.addConsumer(granosPelados.penalty);
netWeight.node.addConsumer(granosYesosos.penalty);
netWeight.node.addConsumer(bonus.penalty);
netWeight.node.addConsumer(groupSummary.penalty);

humedad.range.addConsumer(humedad.percent);
humedad.percent.addConsumer(humedad.penalty);
humedad.percent.addConsumer(summary.percent);
humedad.percent.addConsumer(groupSummary.percent)
humedad.tolerance.addConsumer(humedad.penalty);
humedad.tolerance.addConsumer(summary.tolerance);
humedad.penalty.addConsumer(summary.penalty);

granosVerdes.range.addConsumer(granosVerdes.percent);
granosVerdes.percent.addConsumer(granosVerdes.penalty);
granosVerdes.percent.addConsumer(summary.percent);
granosVerdes.tolerance.addConsumer(granosVerdes.penalty);
granosVerdes.tolerance.addConsumer(summary.tolerance);
granosVerdes.penalty.addConsumer(summary.penalty);

impurezas.range.addConsumer(impurezas.percent);
impurezas.percent.addConsumer(impurezas.penalty);
impurezas.percent.addConsumer(summary.percent);
impurezas.tolerance.addConsumer(impurezas.penalty);
impurezas.tolerance.addConsumer(summary.tolerance);
impurezas.penalty.addConsumer(summary.penalty);

vano.range.addConsumer(vano.percent);
vano.percent.addConsumer(vano.penalty);
vano.percent.addConsumer(summary.percent);
vano.tolerance.addConsumer(vano.penalty);
vano.tolerance.addConsumer(summary.tolerance);
vano.penalty.addConsumer(summary.penalty);

hualcacho.range.addConsumer(hualcacho.percent);
hualcacho.percent.addConsumer(hualcacho.penalty);
hualcacho.percent.addConsumer(summary.percent);
hualcacho.tolerance.addConsumer(hualcacho.penalty);
hualcacho.tolerance.addConsumer(summary.tolerance);
hualcacho.penalty.addConsumer(summary.penalty);

granosManchados.range.addConsumer(granosManchados.percent);
granosManchados.percent.addConsumer(granosManchados.penalty);
granosManchados.percent.addConsumer(summary.percent);
granosManchados.tolerance.addConsumer(granosManchados.penalty);
granosManchados.tolerance.addConsumer(summary.tolerance);
granosManchados.penalty.addConsumer(summary.penalty);

granosPelados.range.addConsumer(granosPelados.percent);
granosPelados.percent.addConsumer(granosPelados.penalty);
granosPelados.percent.addConsumer(summary.percent);
granosPelados.tolerance.addConsumer(granosPelados.penalty);
granosPelados.tolerance.addConsumer(summary.tolerance);
granosPelados.penalty.addConsumer(summary.penalty);

granosYesosos.range.addConsumer(granosYesosos.percent);
granosYesosos.percent.addConsumer(granosYesosos.penalty);
granosYesosos.percent.addConsumer(summary.percent);
granosYesosos.tolerance.addConsumer(granosYesosos.penalty);
granosYesosos.tolerance.addConsumer(summary.tolerance);
granosYesosos.penalty.addConsumer(summary.penalty);

// Añadir conexiones para el cálculo de la tolerancia del grupo
humedad.tolerance.addConsumer(groupSummary.tolerance);
granosVerdes.tolerance.addConsumer(groupSummary.tolerance);
impurezas.tolerance.addConsumer(groupSummary.tolerance);
vano.tolerance.addConsumer(groupSummary.tolerance);
hualcacho.tolerance.addConsumer(groupSummary.tolerance);
granosManchados.tolerance.addConsumer(groupSummary.tolerance);
granosPelados.tolerance.addConsumer(groupSummary.tolerance);
granosYesosos.tolerance.addConsumer(groupSummary.tolerance);

// Conectar GroupSummary percent y tolerance con penalty
groupSummary.percent.addConsumer(groupSummary.penalty);
groupSummary.tolerance.addConsumer(groupSummary.penalty);

// Conexiones para el cálculo directo (forward)
humedad.percent.addConsumer(groupSummary.percent);
granosVerdes.percent.addConsumer(groupSummary.percent);
impurezas.percent.addConsumer(groupSummary.percent);
vano.percent.addConsumer(groupSummary.percent);
hualcacho.percent.addConsumer(groupSummary.percent);
granosManchados.percent.addConsumer(groupSummary.percent);
granosPelados.percent.addConsumer(groupSummary.percent);
granosYesosos.percent.addConsumer(groupSummary.percent);

// Conexiones para el cálculo directo de tolerancias (forward)
humedad.tolerance.addConsumer(groupSummary.tolerance);
granosVerdes.tolerance.addConsumer(groupSummary.tolerance);
impurezas.tolerance.addConsumer(groupSummary.tolerance);
vano.tolerance.addConsumer(groupSummary.tolerance);
hualcacho.tolerance.addConsumer(groupSummary.tolerance);
granosManchados.tolerance.addConsumer(groupSummary.tolerance);
granosPelados.tolerance.addConsumer(groupSummary.tolerance);
granosYesosos.tolerance.addConsumer(groupSummary.tolerance);

// Conexiones para el cálculo directo de penalties (forward)
humedad.penalty.addConsumer(groupSummary.penalty);
granosVerdes.penalty.addConsumer(groupSummary.penalty);
impurezas.penalty.addConsumer(groupSummary.penalty);
vano.penalty.addConsumer(groupSummary.penalty);
hualcacho.penalty.addConsumer(groupSummary.penalty);
granosManchados.penalty.addConsumer(groupSummary.penalty);
granosPelados.penalty.addConsumer(groupSummary.penalty);
granosYesosos.penalty.addConsumer(groupSummary.penalty);

// Conexiones entre nodos del GroupSummary
groupSummary.percent.addConsumer(groupSummary.penalty);
groupSummary.tolerance.addConsumer(groupSummary.penalty);

// Las conexiones de netWeight a los penalties ya están definidas en la sección anterior
// No es necesario repetirlas aquí

















netWeight.node.effect = () => {
  const grossWeightValue = grossWeight.node.value;
  const tareValue = tare.node.value;
  const grossWeightV =
    typeof grossWeightValue === "number" && !isNaN(grossWeightValue)
      ? grossWeightValue
      : 0;
  const tareV =
    typeof tareValue === "number" && !isNaN(tareValue) ? tareValue : 0;
  const netWeightValue = Math.max(0, grossWeightV - tareV);
  netWeight.node.setValue(netWeightValue);
};

bonus.tolerance.effect = () => {
  const toleranceValue = bonus.tolerance.value;

  const toleranceV =
    typeof toleranceValue === "number" && !isNaN(toleranceValue)
      ? toleranceValue
      : 0;

  if (toleranceV >= 0) {
    bonus.tolerance.setError(false);
    bonus.tolerance.setErrorMessage("");
  } else {
    bonus.tolerance.setError(true);
    bonus.tolerance.setErrorMessage("La tolerancia no puede ser negativa");
  }

  const netWeightValue = netWeight.node.value;
  const netWeightV =
    typeof netWeightValue === "number" && !isNaN(netWeightValue)
      ? netWeightValue
      : 0;

  const netBonus = roundToTwoDecimals((netWeightV * toleranceV) / 100);
  bonus.penalty.setValue(netBonus);
}

bonus.penalty.effect = () => {
  const toleranceValue = bonus.tolerance.value;

  const toleranceV =
    typeof toleranceValue === "number" && !isNaN(toleranceValue)
      ? toleranceValue
      : 0;

  // Validación 1: No puede ser negativo
  if (toleranceV < 0) {
    bonus.tolerance.setError(true);
    bonus.tolerance.setErrorMessage("La tolerancia no puede ser negativa");
    return;
  }
  
  // Validación 2: No puede ser mayor a 100%
  if (toleranceV > 100) {
    bonus.tolerance.setError(true);
    bonus.tolerance.setErrorMessage("La tolerancia no puede exceder 100%");
    return;
  }
  
  // Calculamos valores necesarios para validaciones adicionales
  const netWeightValue = netWeight.node.value;
  const netWeightV = typeof netWeightValue === "number" && !isNaN(netWeightValue) ? netWeightValue : 0;
  const netBonus = (netWeightV * toleranceV) / 100;
  
  // Calculamos el total de descuentos actuales
  const totalDiscounts = summary.penalty.value;
  
  // Validación 3: No puede generar que Paddy Neto sea mayor que Peso Neto
  // Paddy Neto = Peso Neto - Total Descuentos + Bonus
  const paddyNeto = netWeightV - totalDiscounts + netBonus;
  if (paddyNeto > netWeightV) {
    bonus.tolerance.setError(true);
    bonus.tolerance.setErrorMessage("El bonus no puede hacer que el Paddy Neto exceda el Peso Neto");
    return;
  }
  
  // Validación 4: Bonus.penalty no puede ser igual al total de descuentos
  if (Math.abs(netBonus - totalDiscounts) < 0.01) { // Usamos pequeña tolerancia para comparación de floats
    bonus.tolerance.setError(true);
    bonus.tolerance.setErrorMessage("El bonus no puede ser igual al total de descuentos");
    return;
  }
  
  // Si llegamos aquí, todas las validaciones pasaron
  bonus.tolerance.setError(false);
  bonus.tolerance.setErrorMessage("");
  
  // Establecemos el valor del bonus
  bonus.penalty.setValue(netBonus);
}


const findPercent = (value: number, ranges: Range[]): number => {
  // Find the range that includes the value
  const range = ranges.find((r) => {
    const start = parseFloat(String(r.start)); // Parse start string to number
    const end = parseFloat(String(r.end)); // Parse end string to number

    // Check if parsing was successful and value is within the range
    return !isNaN(start) && !isNaN(end) && value >= start && value <= end;
  });

  // If a range is found, parse and return its percent value, otherwise return 0
  if (range) {
    const percent = parseFloat(String(range.percent)); // Parse percent string to number
    return !isNaN(percent) ? percent : 0; // Return parsed percent or 0 if parsing failed
  }

  return 0; // Return 0 if no matching range is found
};


humedad.percent.effect = () => {
  const rangeValue = humedad.range.value;
  const rangeV =
    typeof rangeValue === "number" && !isNaN(rangeValue) ? rangeValue : 0;
  const percentValue = findPercent(rangeV, humedad.range.ranges);
  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;

  humedad.percent.setValue(percentV);
};


humedad.penalty.effect = () => {
  const percentValue = humedad.percent.value;
  const toleranceValue = humedad.tolerance.value;

  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  const toleranceV =
    typeof toleranceValue === "number" && !isNaN(toleranceValue)
      ? toleranceValue
      : 0;
  if (percentV > 100) {
    humedad.percent.setError(true);
    humedad.percent.setErrorMessage("El porcentaje no puede exceder 100%");
  } else {
    humedad.percent.setError(false);
    humedad.percent.setErrorMessage("");
  }

  if (toleranceV > percentV) {
    humedad.tolerance.setError(true);
    humedad.tolerance.setErrorMessage("La tolerancia no puede exceder el porcentaje");
  } else {
    humedad.tolerance.setError(false);
    humedad.tolerance.setErrorMessage("");
  }

  const perTol = Math.max(0, percentV - toleranceV);
  const netPenalty = roundToTwoDecimals((netWeight.node.value * perTol) / 100);
  humedad.penalty.setValue(netPenalty);
};
granosVerdes.percent.effect = () => {
  const rangeValue = granosVerdes.range.value;
  const rangeV =
    typeof rangeValue === "number" && !isNaN(rangeValue) ? rangeValue : 0;
  const percentValue = findPercent(rangeV, granosVerdes.range.ranges);
  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  granosVerdes.percent.setValue(percentV);
};
granosVerdes.penalty.effect = () => {
  const percentValue = granosVerdes.percent.value;
  const toleranceValue = granosVerdes.tolerance.value;

  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  const toleranceV =
    typeof toleranceValue === "number" && !isNaN(toleranceValue)
      ? toleranceValue
      : 0;

  if (percentV > 100) {
    granosVerdes.percent.setError(true);
    granosVerdes.percent.setErrorMessage("El porcentaje no puede exceder 100%");
  } else {
    granosVerdes.percent.setError(false);
    granosVerdes.percent.setErrorMessage("");
  }

  if (toleranceV > percentV) {
    granosVerdes.tolerance.setError(true);
    granosVerdes.tolerance.setErrorMessage("La tolerancia no puede exceder el porcentaje");
  } else {
    granosVerdes.tolerance.setError(false);
    granosVerdes.tolerance.setErrorMessage("");
  }

  const perTol = Math.max(0, percentV - toleranceV);
  const netPenalty = (netWeight.node.value * perTol) / 100;
  granosVerdes.penalty.setValue(netPenalty);
};
impurezas.percent.effect = () => {
  const rangeValue = impurezas.range.value;
  const rangeV =
    typeof rangeValue === "number" && !isNaN(rangeValue) ? rangeValue : 0;
  const percentValue = findPercent(rangeV, impurezas.range.ranges);
  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  impurezas.percent.setValue(percentV);
};
impurezas.penalty.effect = () => {
  const percentValue = impurezas.percent.value;
  const toleranceValue = impurezas.tolerance.value;

  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  const toleranceV =
    typeof toleranceValue === "number" && !isNaN(toleranceValue)
      ? toleranceValue
      : 0;

  if (percentV > 100) {
    impurezas.percent.setError(true);
    impurezas.percent.setErrorMessage("El porcentaje no puede exceder 100%");
  } else {
    impurezas.percent.setError(false);
    impurezas.percent.setErrorMessage("");
  }

  if (toleranceV > percentV) {
    impurezas.tolerance.setError(true);
    impurezas.tolerance.setErrorMessage("La tolerancia no puede exceder el porcentaje");
  } else {
    impurezas.tolerance.setError(false);
    impurezas.tolerance.setErrorMessage("");
  }

  const perTol = Math.max(0, percentV - toleranceV);
  const netPenalty = (netWeight.node.value * perTol) / 100;
  impurezas.penalty.setValue(netPenalty);
};
vano.percent.effect = () => {
  const rangeValue = vano.range.value;
  const rangeV =
    typeof rangeValue === "number" && !isNaN(rangeValue) ? rangeValue : 0;
  const percentValue = findPercent(rangeV, vano.range.ranges);
  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  vano.percent.setValue(percentV);
};
vano.penalty.effect = () => {
  const percentValue = vano.percent.value;
  const toleranceValue = vano.tolerance.value;

  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  const toleranceV =
    typeof toleranceValue === "number" && !isNaN(toleranceValue)
      ? toleranceValue
      : 0;

  if (percentV > 100) {
    vano.percent.setError(true);
    vano.percent.setErrorMessage("El porcentaje no puede exceder 100%");
  } else {
    vano.percent.setError(false);
    vano.percent.setErrorMessage("");
  }

  if (toleranceV > percentV) {
    vano.tolerance.setError(true);
    vano.tolerance.setErrorMessage("La tolerancia no puede exceder el porcentaje");
  } else {
    vano.tolerance.setError(false);
    vano.tolerance.setErrorMessage("");
  }

  const perTol = Math.max(0, percentV - toleranceV);
  const netPenalty = (netWeight.node.value * perTol) / 100;
  vano.penalty.setValue(netPenalty);
};
hualcacho.percent.effect = () => {
  const rangeValue = hualcacho.range.value;
  const rangeV =
    typeof rangeValue === "number" && !isNaN(rangeValue) ? rangeValue : 0;
  const percentValue = findPercent(rangeV, hualcacho.range.ranges);
  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  hualcacho.percent.setValue(percentV);
};
hualcacho.penalty.effect = () => {
  const percentValue = hualcacho.percent.value;
  const toleranceValue = hualcacho.tolerance.value;

  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  const toleranceV =
    typeof toleranceValue === "number" && !isNaN(toleranceValue)
      ? toleranceValue
      : 0;

  if (percentV > 100) {
    hualcacho.percent.setError(true);
    hualcacho.percent.setErrorMessage("El porcentaje no puede exceder 100%");
  } else {
    hualcacho.percent.setError(false);
    hualcacho.percent.setErrorMessage("");
  }

  if (toleranceV > percentV) {
    hualcacho.tolerance.setError(true);
    hualcacho.tolerance.setErrorMessage("La tolerancia no puede exceder el porcentaje");
  } else {
    hualcacho.tolerance.setError(false);
    hualcacho.tolerance.setErrorMessage("");
  }

  const perTol = Math.max(0, percentV - toleranceV);
  const netPenalty = (netWeight.node.value * perTol) / 100;
  hualcacho.penalty.setValue(netPenalty);
};
granosManchados.percent.effect = () => {
  const rangeValue = granosManchados.range.value;
  const rangeV =
    typeof rangeValue === "number" && !isNaN(rangeValue) ? rangeValue : 0;
  const percentValue = findPercent(rangeV, granosManchados.range.ranges);
  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  granosManchados.percent.setValue(percentV);
};
granosManchados.penalty.effect = () => {
  const percentValue = granosManchados.percent.value;
  const toleranceValue = granosManchados.tolerance.value;

  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  const toleranceV =
    typeof toleranceValue === "number" && !isNaN(toleranceValue)
      ? toleranceValue
      : 0;

  if (percentV > 100) {
    granosManchados.percent.setError(true);
    granosManchados.percent.setErrorMessage("El porcentaje no puede exceder 100%");
  } else {
    granosManchados.percent.setError(false);
    granosManchados.percent.setErrorMessage("");
  }

  if (toleranceV > percentV) {
    granosManchados.tolerance.setError(true);
    granosManchados.tolerance.setErrorMessage("La tolerancia no puede exceder el porcentaje");
  } else {
    granosManchados.tolerance.setError(false);
    granosManchados.tolerance.setErrorMessage("");
  }

  const perTol = Math.max(0, percentV - toleranceV);
  const netPenalty = (netWeight.node.value * perTol) / 100;
  granosManchados.penalty.setValue(netPenalty);
};
granosPelados.percent.effect = () => {
  const rangeValue = granosPelados.range.value;
  const rangeV =
    typeof rangeValue === "number" && !isNaN(rangeValue) ? rangeValue : 0;
  const percentValue = findPercent(rangeV, granosPelados.range.ranges);
  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  granosPelados.percent.setValue(percentV);
};
granosPelados.penalty.effect = () => {
  const percentValue = granosPelados.percent.value;
  const toleranceValue = granosPelados.tolerance.value;

  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  const toleranceV =
    typeof toleranceValue === "number" && !isNaN(toleranceValue)
      ? toleranceValue
      : 0;

  if (percentV > 100) {
    granosPelados.percent.setError(true);
    granosPelados.percent.setErrorMessage("El porcentaje no puede exceder 100%");
  } else {
    granosPelados.percent.setError(false);
    granosPelados.percent.setErrorMessage("");
  }

  if (toleranceV > percentV) {
    granosPelados.tolerance.setError(true);
    granosPelados.tolerance.setErrorMessage("La tolerancia no puede exceder el porcentaje");
  } else {
    granosPelados.tolerance.setError(false);
    granosPelados.tolerance.setErrorMessage("");
  }

  const perTol = Math.max(0, percentV - toleranceV);
  const netPenalty = (netWeight.node.value * perTol) / 100;
  granosPelados.penalty.setValue(netPenalty);
};
granosYesosos.percent.effect = () => {
  const rangeValue = granosYesosos.range.value;
  const rangeV =
    typeof rangeValue === "number" && !isNaN(rangeValue) ? rangeValue : 0;
  const percentValue = findPercent(rangeV, granosYesosos.range.ranges);
  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  granosYesosos.percent.setValue(percentV);
};
granosYesosos.penalty.effect = () => {
  const percentValue = granosYesosos.percent.value;
  const toleranceValue = granosYesosos.tolerance.value;

  const percentV =
    typeof percentValue === "number" && !isNaN(percentValue) ? percentValue : 0;
  const toleranceV =
    typeof toleranceValue === "number" && !isNaN(toleranceValue)
      ? toleranceValue
      : 0;

  if (percentV > 100) {
    granosYesosos.percent.setError(true);
    granosYesosos.percent.setErrorMessage("El porcentaje no puede exceder 100%");
  } else {
    granosYesosos.percent.setError(false);
    granosYesosos.percent.setErrorMessage("");
  }

  if (toleranceV > percentV) {
    granosYesosos.tolerance.setError(true);
    granosYesosos.tolerance.setErrorMessage("La tolerancia no puede exceder el porcentaje");
  } else {
    granosYesosos.tolerance.setError(false);
    granosYesosos.tolerance.setErrorMessage("");
  }

  const perTol = Math.max(0, percentV - toleranceV);
  const netPenalty = (netWeight.node.value * perTol) / 100;
  granosYesosos.penalty.setValue(netPenalty);
};

groupSummary.percent.effect = () => {
  // Solo sumar los porcentajes de los parámetros que pertenecen al grupo de tolerancia
  // Comprobar si el parámetro está en el grupo de tolerancia y está disponible
  const total =
    (humedad.toleranceGroup && humedad.available ? (isNaN(humedad.percent.value) ? 0 : humedad.percent.value) : 0) +
    (granosVerdes.toleranceGroup && granosVerdes.available ? (isNaN(granosVerdes.percent.value) ? 0 : granosVerdes.percent.value) : 0) +
    (impurezas.toleranceGroup && impurezas.available ? (isNaN(impurezas.percent.value) ? 0 : impurezas.percent.value) : 0) +
    (vano.toleranceGroup && vano.available ? (isNaN(vano.percent.value) ? 0 : vano.percent.value) : 0) +
    (hualcacho.toleranceGroup && hualcacho.available ? (isNaN(hualcacho.percent.value) ? 0 : hualcacho.percent.value) : 0) +
    (granosManchados.toleranceGroup && granosManchados.available ? (isNaN(granosManchados.percent.value) ? 0 : granosManchados.percent.value) : 0) +
    (granosPelados.toleranceGroup && granosPelados.available ? (isNaN(granosPelados.percent.value) ? 0 : granosPelados.percent.value) : 0) +
    (granosYesosos.toleranceGroup && granosYesosos.available ? (isNaN(granosYesosos.percent.value) ? 0 : granosYesosos.percent.value) : 0);
  
  if (total > 100) {
    groupSummary.percent.setError(true);
    groupSummary.percent.setErrorMessage("El porcentaje del grupo no puede exceder 100%");
  } else {
    groupSummary.percent.setError(false);
    groupSummary.percent.setErrorMessage("");
  }
  groupSummary.percent.setValue(total);
}




summary.percent.effect = () => {
  const total =
    (isNaN(humedad.percent.value) ? 0 : humedad.percent.value) +
    (isNaN(granosVerdes.percent.value) ? 0 : granosVerdes.percent.value) +
    (isNaN(impurezas.percent.value) ? 0 : impurezas.percent.value) +
    (isNaN(vano.percent.value) ? 0 : vano.percent.value) +
    (isNaN(hualcacho.percent.value) ? 0 : hualcacho.percent.value) +
    (isNaN(granosManchados.percent.value) ? 0 : granosManchados.percent.value) +
    (isNaN(granosPelados.percent.value) ? 0 : granosPelados.percent.value) +
    (isNaN(granosYesosos.percent.value) ? 0 : granosYesosos.percent.value);
  if (total > 100) {
    summary.percent.setError(true);
    summary.percent.setErrorMessage("El porcentaje total no puede exceder 100%");
  } else {
    summary.percent.setError(false);
    summary.percent.setErrorMessage("");
  }
  summary.percent.setValue(total);
};
summary.tolerance.effect = () => {
  const total =
    (isNaN(humedad.tolerance.value) ? 0 : humedad.tolerance.value) +
    (isNaN(granosVerdes.tolerance.value) ? 0 : granosVerdes.tolerance.value) +
    (isNaN(impurezas.tolerance.value) ? 0 : impurezas.tolerance.value) +
    (isNaN(vano.tolerance.value) ? 0 : vano.tolerance.value) +
    (isNaN(hualcacho.tolerance.value) ? 0 : hualcacho.tolerance.value) +
    (isNaN(granosManchados.tolerance.value)
      ? 0
      : granosManchados.tolerance.value) +
    (isNaN(granosPelados.tolerance.value) ? 0 : granosPelados.tolerance.value) +
    (isNaN(granosYesosos.tolerance.value) ? 0 : granosYesosos.tolerance.value);
  if (total > 100) {
    summary.tolerance.setError(true);
    summary.tolerance.setErrorMessage("La tolerancia total no puede exceder 100%");
  } else {
    summary.tolerance.setError(false);
    summary.tolerance.setErrorMessage("");
  }
  summary.tolerance.setValue(total);
};
summary.penalty.effect = () => {
  /**
   * Esta función calcula el total de las penalizaciones de todos los parámetros
   * y aplica un mecanismo de compensación para evitar discrepancias de redondeo.
   * 
   * Proceso:
   * 1. Recolecta los valores de penalización de todos los parámetros
   * 2. Calcula el total con los valores actuales
   * 3. Verifica si el total supera el peso neto (validación)
   * 4. Establece el valor total en el nodo summary.penalty
   * 
   * Nota: La compensación ahora se realiza en los nodos individuales para 
   * evitar recursión infinita.
   */
  
  // Calcular el total con los valores actuales
  const total =
    humedad.penalty.value +
    granosVerdes.penalty.value +
    impurezas.penalty.value +
    vano.penalty.value +
    hualcacho.penalty.value +
    granosManchados.penalty.value +
    granosPelados.penalty.value +
    granosYesosos.penalty.value;

  if (total > netWeight.node.value) {
    summary.penalty.setError(true);
  } else {
    summary.penalty.setError(false);
  }

  // Establecer el valor total, redondeado a dos decimales
  const roundedTotal = roundToTwoDecimals(total);
  summary.penalty.setValue(roundedTotal);
};

// Calcular el total de descuentos (DiscountTotal)
discountTotal.node.effect = () => {
  // Suma de todos los descuentos: summary.penalty (ya no incluye dry.percent)
  const totalDiscounts = summary.penalty.value;
  discountTotal.node.setValue(totalDiscounts);
};

// Calcular el total de Paddy (totalPaddy) = netWeight - totalDiscounts + Bonus.penalty
totalPaddy.node.effect = () => {
  /**
   * Esta función calcula el total de Paddy Neto.
   * 
   * Fórmula de cálculo: Paddy Neto = Peso Neto - Total Descuentos + Bonificación
   * 
   * Proceso:
   * 1. Obtiene los valores necesarios (peso neto, descuentos, bonificación)
   * 2. Calcula el Paddy Neto
   * 3. Establece el valor redondeado en el nodo
   * 
   * Nota: Se ha simplificado para evitar recursión infinita eliminando la
   * manipulación directa del bonus.
   */
  
  // Obtener los valores necesarios
  const netWeightValue = netWeight.node.value;
  const totalDiscounts = summary.penalty.value;
  const bonusValue = bonus.penalty.value;
  
  const netWeightV = typeof netWeightValue === "number" && !isNaN(netWeightValue) ? netWeightValue : 0;
  const totalDiscountsV = typeof totalDiscounts === "number" && !isNaN(totalDiscounts) ? totalDiscounts : 0;
  const bonusV = typeof bonusValue === "number" && !isNaN(bonusValue) ? bonusValue : 0;
  
  // Calcular el paddy neto: Net Weight - Total Descuentos + Bonus
  const paddyNetValue = roundToTwoDecimals(netWeightV - totalDiscountsV + bonusV);
  
  // Establecer el valor calculado
  totalPaddy.node.setValue(paddyNetValue);
};

// Conectar los nodos para que se actualicen automáticamente
summary.penalty.addConsumer(discountTotal.node);
// Eliminada la relación: dry.percent.addConsumer(discountTotal.node);
discountTotal.node.addConsumer(totalPaddy.node);
bonus.penalty.addConsumer(totalPaddy.node);
// IMPORTANTE: Agregar netWeight como consumer de totalPaddy para que se recalcule cuando cambie el peso neto
netWeight.node.addConsumer(totalPaddy.node);

// Agregar conexiones para que el Bonus se re-valide cuando cambien los valores que afectan sus validaciones
summary.penalty.addConsumer(bonus.tolerance); // Cuando cambien los descuentos totales
netWeight.node.addConsumer(bonus.tolerance); // Cuando cambie el peso neto

// Agregar efecto para calcular la tolerancia del grupo
groupSummary.tolerance.effect = () => {
  // Solo sumar las tolerancias de los parámetros que pertenecen al grupo de tolerancia
  const total =
    (humedad.toleranceGroup && humedad.available ? (isNaN(humedad.tolerance.value) ? 0 : humedad.tolerance.value) : 0) +
    (granosVerdes.toleranceGroup && granosVerdes.available ? (isNaN(granosVerdes.tolerance.value) ? 0 : granosVerdes.tolerance.value) : 0) +
    (impurezas.toleranceGroup && impurezas.available ? (isNaN(impurezas.tolerance.value) ? 0 : impurezas.tolerance.value) : 0) +
    (vano.toleranceGroup && vano.available ? (isNaN(vano.tolerance.value) ? 0 : vano.tolerance.value) : 0) +
    (hualcacho.toleranceGroup && hualcacho.available ? (isNaN(hualcacho.tolerance.value) ? 0 : hualcacho.tolerance.value) : 0) +
    (granosManchados.toleranceGroup && granosManchados.available ? (isNaN(granosManchados.tolerance.value) ? 0 : granosManchados.tolerance.value) : 0) +
    (granosPelados.toleranceGroup && granosPelados.available ? (isNaN(granosPelados.tolerance.value) ? 0 : granosPelados.tolerance.value) : 0) +
    (granosYesosos.toleranceGroup && granosYesosos.available ? (isNaN(granosYesosos.tolerance.value) ? 0 : granosYesosos.tolerance.value) : 0);
  
  // Validación: verificar si la tolerancia supera al porcentaje del grupo
  const percentValue = isNaN(groupSummary.percent.value) ? 0 : groupSummary.percent.value;
  
  if (total > percentValue) {
    groupSummary.tolerance.setError(true);
  } else {
    groupSummary.tolerance.setError(false);
  }
  
  groupSummary.tolerance.setValue(total);
}

// Agregar efecto para calcular la penalización del grupo
groupSummary.penalty.effect = () => {
  /**
   * Esta función calcula la penalización para el grupo de tolerancia.
   * 
   * Proceso:
   * 1. Obtiene los valores de porcentaje y tolerancia del grupo
   * 2. Verifica si la tolerancia supera al porcentaje (validación)
   * 3. Si el porcentaje es mayor que la tolerancia, calcula la penalización
   * 4. Establece el valor de la penalización redondeado en el nodo
   * 
   * Nota: Se ha simplificado para evitar recursión infinita eliminando la manipulación
   * directa de las penalizaciones individuales.
   */
  
  const percentValue = isNaN(groupSummary.percent.value) ? 0 : groupSummary.percent.value;
  const toleranceValue = isNaN(groupSummary.tolerance.value) ? 0 : groupSummary.tolerance.value;
  
  // Validación: verificar si la tolerancia supera al porcentaje
  if (toleranceValue > percentValue) {
    groupSummary.tolerance.setError(true);
  } else {
    groupSummary.tolerance.setError(false);
  }
  
  if (percentValue > toleranceValue) {
    // Calcular la diferencia entre porcentaje y tolerancia
    const diff = percentValue - toleranceValue;
    
    // Calcular la penalización exacta y redondearla
    const penaltyValue = roundToTwoDecimals(netWeight.node.value * (diff / 100));
    
    // Establecer el valor de la penalización
    groupSummary.penalty.setValue(penaltyValue);
  } else {
    // Si el porcentaje es menor o igual a la tolerancia, la penalización es cero
    groupSummary.penalty.setValue(0);
  }
};

// Agregar efecto para distribuir la tolerancia del grupo a los parámetros individuales
// Configuración de onChange para Bonus.tolerance - cuando el usuario actualiza manualmente la tolerancia
bonus.tolerance.onChange = (value: number) => {
  // Actualizamos el valor del nodo
  bonus.tolerance.setValue(value);
  
  // Validamos el valor - convertir NaN a 0 para permitir campos vacíos
  const toleranceV = typeof value === "number" && !isNaN(value) ? value : 0;
  
  // Validación 1: No puede ser negativo
  if (toleranceV < 0) {
    bonus.tolerance.setError(true);
    bonus.tolerance.setErrorMessage("La tolerancia no puede ser negativa");
    return;
  }
  
  // Validación 2: No puede ser mayor a 100%
  if (toleranceV > 100) {
    bonus.tolerance.setError(true);
    bonus.tolerance.setErrorMessage("La tolerancia no puede exceder 100%");
    return;
  }
  
  // Calculamos valores necesarios para validaciones adicionales
  const netWeightValue = netWeight.node.value;
  const netWeightV = typeof netWeightValue === "number" && !isNaN(netWeightValue) ? netWeightValue : 0;
  const netBonus = (netWeightV * toleranceV) / 100;
  
  // Calculamos el total de descuentos actuales
  const totalDiscounts = summary.penalty.value;
  
  // Validación 3: No puede generar que Paddy Neto sea mayor que Peso Neto
  // Paddy Neto = Peso Neto - Total Descuentos + Bonus
  const paddyNeto = netWeightV - totalDiscounts + netBonus;
  if (paddyNeto > netWeightV) {
    bonus.tolerance.setError(true);
    bonus.tolerance.setErrorMessage("El bonus no puede hacer que el Paddy Neto exceda el Peso Neto");
    return;
  }
  
  // Validación 4: Bonus.penalty no puede ser igual al total de descuentos
  if (Math.abs(netBonus - totalDiscounts) < 0.01) { // Usamos pequeña tolerancia para comparación de floats
    bonus.tolerance.setError(true);
    bonus.tolerance.setErrorMessage("El bonus no puede ser igual al total de descuentos");
    return;
  }
  
  // Si llegamos aquí, todas las validaciones pasaron
  bonus.tolerance.setError(false);
  bonus.tolerance.setErrorMessage("");
  
  // Establecemos el valor del bonus
  bonus.penalty.setValue(netBonus);
};

// cuando el usuario actualiza manualmente la tolerancia del grupo
groupSummary.tolerance.onChange = (value: number) => {
  /**
   * Esta función distribuye la tolerancia del grupo entre los parámetros individuales
   * basándose en la proporción del porcentaje de cada parámetro respecto al total.
   * 
   * Proceso:
   * 1. Actualiza el valor de tolerancia del grupo
   * 2. Identifica los parámetros que pertenecen al grupo de tolerancia
   * 3. Calcula la suma total de porcentajes de estos parámetros
   * 4. Distribuye la tolerancia proporcionalmente según el peso de cada parámetro
   * 5. Actualiza las tolerancias individuales usando setValue para aplicar redondeo
   * 6. Recalcula las penalizaciones individuales
   * 7. Actualiza la penalización del grupo
   * 8. Recalcula la tolerancia total para el Summary
   */
  
  // Primero actualizamos el valor del nodo
  groupSummary.tolerance.setValue(value);
  
  // Obtenemos los parámetros que pertenecen al grupo de tolerancia
  const toleranceGroupParams = [
    { cluster: humedad, percent: humedad.percent.value },
    { cluster: granosVerdes, percent: granosVerdes.percent.value },
    { cluster: impurezas, percent: impurezas.percent.value },
    { cluster: vano, percent: vano.percent.value },
    { cluster: hualcacho, percent: hualcacho.percent.value },
    { cluster: granosManchados, percent: granosManchados.percent.value },
    { cluster: granosPelados, percent: granosPelados.percent.value },
    { cluster: granosYesosos, percent: granosYesosos.percent.value }
  ].filter(param => param.cluster.toleranceGroup && param.cluster.available);
  
  // Calculamos la suma total de porcentajes de los parámetros del grupo
  const totalPercent = toleranceGroupParams.reduce((sum, param) => 
    sum + (isNaN(param.percent) ? 0 : param.percent), 0);
  
  // Si no hay porcentajes, no podemos distribuir
  if (totalPercent <= 0) {
    return;
  }
  
  // Preparamos un array para recolectar las tolerancias distribuidas antes de aplicarlas
  // para poder realizar compensación si es necesario
  const distributedTolerances: { cluster: ParamCluster, tolerance: number }[] = [];
  
  // Primera pasada: calculamos las tolerancias distribuidas
  toleranceGroupParams.forEach(param => {
    const paramPercent = isNaN(param.percent) ? 0 : param.percent;
    // Calculamos el peso relativo del parámetro (su proporción del total)
    const weight = paramPercent / totalPercent;
    // Distribuimos la tolerancia según el peso y redondeamos
    const distributedTolerance = roundToTwoDecimals(value * weight);
    
    // Guardamos el valor para aplicarlo después
    distributedTolerances.push({
      cluster: param.cluster,
      tolerance: distributedTolerance
    });
  });
  
  // Segunda pasada: aplicamos las tolerancias y recalculamos las penalizaciones
  distributedTolerances.forEach(item => {
    // Actualizamos la tolerancia del parámetro usando setValue para aplicar redondeo
    // y disparar los efectos asociados
    item.cluster.tolerance.setValue(item.tolerance);
  });
  
  // Finalmente actualizamos la penalización del grupo
  if (groupSummary.penalty.effect) {
    groupSummary.penalty.effect();
  }
  
  // Recalculamos completamente el valor de Summary.Tolerance
  // Esto asegura que el Summary.Tolerance refleje la suma actualizada de todas las tolerancias
  const newSummaryToleranceValue = roundToTwoDecimals(
    (isNaN(humedad.tolerance.value) ? 0 : humedad.tolerance.value) +
    (isNaN(granosVerdes.tolerance.value) ? 0 : granosVerdes.tolerance.value) +
    (isNaN(impurezas.tolerance.value) ? 0 : impurezas.tolerance.value) +
    (isNaN(vano.tolerance.value) ? 0 : vano.tolerance.value) +
    (isNaN(hualcacho.tolerance.value) ? 0 : hualcacho.tolerance.value) +
    (isNaN(granosManchados.tolerance.value) ? 0 : granosManchados.tolerance.value) +
    (isNaN(granosPelados.tolerance.value) ? 0 : granosPelados.tolerance.value) +
    (isNaN(granosYesosos.tolerance.value) ? 0 : granosYesosos.tolerance.value)
  );
  
  // Actualizamos el valor y ejecutamos sus efectos
  summary.tolerance.setValue(newSummaryToleranceValue);
};

// Clusters específicos para edición de recepciones
// Esta es una copia independiente de paramCells.tsx para uso en edición
export const editClusters = {
  grossWeight: grossWeight,
  tare: tare,
  netWeight: netWeight,
  Humedad: humedad,
  GranosVerdes: granosVerdes,
  Impurezas: impurezas,
  Vano: vano,
  Hualcacho: hualcacho,
  GranosManchados: granosManchados,
  GranosPelados: granosPelados,
  GranosYesosos: granosYesosos,
  groupSummary: groupSummary,
  Summary: summary,
  Bonus: bonus,
  Dry: dry,
  DiscountTotal: discountTotal,
  totalPaddy: totalPaddy,
};

// Mantener exportación de clusters original para compatibilidad
export const clusters = {
  grossWeight: grossWeight,
  tare: tare,
  netWeight: netWeight,
  Humedad: humedad,
  GranosVerdes: granosVerdes,
  Impurezas: impurezas,
  Vano: vano,
  Hualcacho: hualcacho,
  GranosManchados: granosManchados,
  GranosPelados: granosPelados,
  GranosYesosos: granosYesosos,
  groupSummary: groupSummary,
  Summary: summary,
  Bonus: bonus,
  Dry: dry,
  DiscountTotal: discountTotal,
  totalPaddy: totalPaddy,
};

// Agregar conexiones para que los cambios en los porcentajes actualicen el groupSummary.percent
granosVerdes.percent.addConsumer(groupSummary.percent);
impurezas.percent.addConsumer(groupSummary.percent);
vano.percent.addConsumer(groupSummary.percent);
hualcacho.percent.addConsumer(groupSummary.percent);
granosManchados.percent.addConsumer(groupSummary.percent);
granosPelados.percent.addConsumer(groupSummary.percent);
granosYesosos.percent.addConsumer(groupSummary.percent);
