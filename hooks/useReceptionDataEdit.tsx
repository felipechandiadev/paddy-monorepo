"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import {
  DataReceptionContextType,
  defaultReceptionData,
} from "@/types/reception";
import { TemplateType } from "@/types/discount-template";
import { editClusters as clusters, Node } from "./paramCellsEdit";

export function useReceptionDataEdit(
  initial: Partial<DataReceptionContextType> = {}
) {
  const [data, setData] = useState<DataReceptionContextType>({
    ...defaultReceptionData,
    ...initial,
  });
  const [, setVersion] = useState(0);

  const liveClusters = useMemo(() => clusters, []);

  // Función para inicializar los clusters con datos de una recepción existente
  const initializeWithReception = useCallback((reception: any) => {
    console.log('🔄 DEBUG - Inicializando clusters de edición con datos de recepción:', reception);
    console.log('🔄 DEBUG - Productor:', reception.producer);
    console.log('🔄 DEBUG - Tipo de arroz:', reception.riceType);
    
    // Inicializar pesos
    if (liveClusters.grossWeight?.node) liveClusters.grossWeight.node.value = reception.grossWeight || 0;
    if (liveClusters.tare?.node) liveClusters.tare.node.value = reception.tare || 0;
    if (liveClusters.netWeight?.node) liveClusters.netWeight.node.value = reception.netWeight || 0;

    // Inicializar parámetros
    if (liveClusters.Humedad?.percent) liveClusters.Humedad.percent.value = reception.percentHumedad || 0;
    if (liveClusters.Humedad?.tolerance) liveClusters.Humedad.tolerance.value = reception.toleranceHumedad || 0;
    
    if (liveClusters.GranosVerdes?.percent) liveClusters.GranosVerdes.percent.value = reception.percentGranosVerdes || 0;
    if (liveClusters.GranosVerdes?.tolerance) liveClusters.GranosVerdes.tolerance.value = reception.toleranceGranosVerdes || 0;
    
    if (liveClusters.Impurezas?.percent) liveClusters.Impurezas.percent.value = reception.percentImpurezas || 0;
    if (liveClusters.Impurezas?.tolerance) liveClusters.Impurezas.tolerance.value = reception.toleranceImpurezas || 0;
    
    if (liveClusters.Vano?.percent) liveClusters.Vano.percent.value = reception.percentVano || 0;
    if (liveClusters.Vano?.tolerance) liveClusters.Vano.tolerance.value = reception.toleranceVano || 0;
    
    if (liveClusters.Hualcacho?.percent) liveClusters.Hualcacho.percent.value = reception.percentHualcacho || 0;
    if (liveClusters.Hualcacho?.tolerance) liveClusters.Hualcacho.tolerance.value = reception.toleranceHualcacho || 0;
    
    if (liveClusters.GranosManchados?.percent) liveClusters.GranosManchados.percent.value = reception.percentGranosManchados || 0;
    if (liveClusters.GranosManchados?.tolerance) liveClusters.GranosManchados.tolerance.value = reception.toleranceGranosManchados || 0;
    
    if (liveClusters.GranosPelados?.percent) liveClusters.GranosPelados.percent.value = reception.percentGranosPelados || 0;
    if (liveClusters.GranosPelados?.tolerance) liveClusters.GranosPelados.tolerance.value = reception.toleranceGranosPelados || 0;
    
    if (liveClusters.GranosYesosos?.percent) liveClusters.GranosYesosos.percent.value = reception.percentGranosYesosos || 0;
    if (liveClusters.GranosYesosos?.tolerance) liveClusters.GranosYesosos.tolerance.value = reception.toleranceGranosYesosos || 0;

    // Inicializar bonificación y secado
    if (liveClusters.Bonus?.tolerance) liveClusters.Bonus.tolerance.value = reception.toleranceBonificacion || 0;
    if (liveClusters.Bonus?.penalty) liveClusters.Bonus.penalty.value = reception.bonus || 0;
    if (liveClusters.Dry?.percent) liveClusters.Dry.percent.value = reception.percentSecado || 0;

    // Inicializar totales
    if (liveClusters.totalPaddy?.node) liveClusters.totalPaddy.node.value = reception.paddyNet || 0;
    if (liveClusters.DiscountTotal?.node) liveClusters.DiscountTotal.node.value = reception.totalDiscount || 0;

    // Actualizar los datos del contexto con toda la información de la recepción
    setData(prevData => ({
      ...prevData,
      id: reception.id,
      producerId: reception.producerId || reception.producer?.id,
      riceTypeId: reception.riceTypeId || reception.riceType?.id,
      templateId: reception.templateId,
      price: reception.price || 0,
      guide: reception.guide || "",
      licensePlate: reception.licensePlate || "",
      note: reception.note || "",
      status: reception.status || "pending",
      createdAt: reception.createdAt,
      updatedAt: reception.updatedAt,
      
      // Información detallada del productor y tipo de arroz
      producer: reception.producer || prevData.producer,
      riceType: reception.riceType || prevData.riceType,
      
      // Datos de la plantilla si existe
      template: reception.template || prevData.template,
    }));
    
    console.log('🔄 DEBUG - Datos del contexto actualizados');
  }, [liveClusters, setData]);


  useEffect(() => {
    const unsubscribeFns: (() => void)[] = [];

    const nodes: Node[] = [
      liveClusters.grossWeight.node,
      liveClusters.tare.node,
      liveClusters.netWeight.node,

      liveClusters.Humedad.range,
      liveClusters.Humedad.percent,
      liveClusters.Humedad.tolerance,
      liveClusters.Humedad.penalty,

      liveClusters.GranosVerdes.range,
      liveClusters.GranosVerdes.percent,
      liveClusters.GranosVerdes.tolerance,
      liveClusters.GranosVerdes.penalty,

      liveClusters.Impurezas.range,
      liveClusters.Impurezas.percent,
      liveClusters.Impurezas.tolerance,
      liveClusters.Impurezas.penalty,

      liveClusters.Vano.range,
      liveClusters.Vano.percent,
      liveClusters.Vano.tolerance,
      liveClusters.Vano.penalty,

      liveClusters.Hualcacho.range,
      liveClusters.Hualcacho.percent,
      liveClusters.Hualcacho.tolerance,
      liveClusters.Hualcacho.penalty,

      liveClusters.GranosManchados.range,
      liveClusters.GranosManchados.percent,
      liveClusters.GranosManchados.tolerance,
      liveClusters.GranosManchados.penalty,

      liveClusters.GranosPelados.range,
      liveClusters.GranosPelados.percent,
      liveClusters.GranosPelados.tolerance,
      liveClusters.GranosPelados.penalty,

      liveClusters.GranosYesosos.range,
      liveClusters.GranosYesosos.percent,
      liveClusters.GranosYesosos.tolerance,
      liveClusters.GranosYesosos.penalty,

      liveClusters.Summary.percent,
      liveClusters.Summary.tolerance,
      liveClusters.Summary.penalty,

      liveClusters.Bonus.tolerance,
      liveClusters.Bonus.penalty,

      liveClusters.Dry.percent,
  

    ];

    nodes.forEach((node) => {
      // Store the original onChange function
      const originalOnChange = node.onChange;
      const wrappedOnChange = (value: number) => {
        setVersion((v) => v + 1);
        originalOnChange?.(value);
      };
      node.onChange = wrappedOnChange;

      unsubscribeFns.push(() => {
        node.onChange = originalOnChange;
      });

      // --- envolvemos setShow (no recibe parámetro) ---
      const originalSetShow = node.setShow;
      const wrappedSetShow = () => {
        setVersion((v) => v + 1);
        originalSetShow();
      };
      node.setShow = wrappedSetShow;
      unsubscribeFns.push(() => {
        node.setShow = originalSetShow;
      });
    });

    return () => {
      unsubscribeFns.forEach((fn) => fn());
    };
  }, [liveClusters]);

  // Sincroniza la visibilidad de los nodos con los flags availableX del template
  useEffect(() => {
    if (!data?.template) {
      // Si no hay plantilla, mostrar todos los campos
      const allParamClusters = [
        liveClusters.Humedad,
        liveClusters.GranosVerdes,
        liveClusters.Impurezas,
        liveClusters.Vano,
        liveClusters.Hualcacho,
        liveClusters.GranosManchados,
        liveClusters.GranosPelados,
        liveClusters.GranosYesosos,
      ];
      allParamClusters.forEach((cluster) => {
        cluster.range.show = true;
        cluster.percent.show = true;
        cluster.tolerance.show = true;
        cluster.penalty.show = true;
      });
      liveClusters.Bonus.tolerance.show = true;
      liveClusters.Bonus.penalty.show = true;
      liveClusters.Dry.percent.show = true;
      
      // Restaurar colores predeterminados del GroupSummary cuando no hay plantilla
      liveClusters.groupSummary.percent.backgroundColor = "inherit";
      liveClusters.groupSummary.tolerance.backgroundColor = "inherit";
      liveClusters.groupSummary.penalty.backgroundColor = "inherit";
      
      return;
    }
    
    // ParamClusters
    const paramMapping = [
      { available: data.template.availableHumedad, cluster: liveClusters.Humedad, name: 'Humedad', groupTolerance: data.template.groupToleranceHumedad, showTolerance: data.template.showToleranceHumedad },
      { available: data.template.availableGranosVerdes, cluster: liveClusters.GranosVerdes, name: 'GranosVerdes', groupTolerance: data.template.groupToleranceGranosVerdes, showTolerance: data.template.showToleranceGranosVerdes },
      { available: data.template.availableImpurezas, cluster: liveClusters.Impurezas, name: 'Impurezas', groupTolerance: data.template.groupToleranceImpurezas, showTolerance: data.template.showToleranceImpurezas },
      { available: data.template.availableVano, cluster: liveClusters.Vano, name: 'Vano', groupTolerance: data.template.groupToleranceVano, showTolerance: data.template.showToleranceVano },
      { available: data.template.availableHualcacho, cluster: liveClusters.Hualcacho, name: 'Hualcacho', groupTolerance: data.template.groupToleranceHualcacho, showTolerance: data.template.showToleranceHualcacho },
      { available: data.template.availableGranosManchados, cluster: liveClusters.GranosManchados, name: 'GranosManchados', groupTolerance: data.template.groupToleranceGranosManchados, showTolerance: data.template.showToleranceGranosManchados },
      { available: data.template.availableGranosPelados, cluster: liveClusters.GranosPelados, name: 'GranosPelados', groupTolerance: data.template.groupToleranceGranosPelados, showTolerance: data.template.showToleranceGranosPelados },
      { available: data.template.availableGranosYesosos, cluster: liveClusters.GranosYesosos, name: 'GranosYesosos', groupTolerance: data.template.groupToleranceGranosYesosos, showTolerance: data.template.showToleranceGranosYesosos },
    ];
    paramMapping.forEach(({ available, cluster, name, groupTolerance, showTolerance }) => {
      cluster.range.show = !!available;
      cluster.percent.show = !!available;
      cluster.tolerance.show = !!(available && showTolerance);
      cluster.penalty.show = !!available;
      
      // Actualizar flag de toleranceGroup en el clúster
      cluster.toleranceGroup = !!(data.template.useToleranceGroup && groupTolerance);
      cluster.available = !!available;
      
      // Establecer color de fondo para elementos que pertenecen al grupo de tolerancia
      if (data.template.useToleranceGroup && groupTolerance && available) {
        // Color morado pastel claro para elementos del grupo de tolerancia
        cluster.range.backgroundColor = "#eceff1"; // Morado pastel claro para range también
        cluster.tolerance.backgroundColor = "#eceff1"; // Morado pastel claro
        cluster.percent.backgroundColor = "#eceff1"; // Morado pastel claro
        cluster.penalty.backgroundColor = "#eceff1"; // Morado pastel claro para penalty también
      } else {
        // Restaurar color predeterminado solo si no hay error
        if (!cluster.range.error) {
          cluster.range.backgroundColor = "inherit";
        }
        if (!cluster.tolerance.error) {
          cluster.tolerance.backgroundColor = "inherit";
        }
        if (!cluster.percent.error) {
          cluster.percent.backgroundColor = "inherit";
        }
        if (!cluster.penalty.error) {
          cluster.penalty.backgroundColor = "inherit";
        }
      }
    });
    // BonusCluster
    liveClusters.Bonus.tolerance.show = !!data.template.availableBonus;
    liveClusters.Bonus.penalty.show = !!data.template.availableBonus;
    
    // GroupSummary - aplicar estilo si se usa tolerancia de grupo
    const hasGroupToleranceParams = data.template.useToleranceGroup && paramMapping.some(
      item => item.available && item.groupTolerance
    );
    
    if (data.template.useToleranceGroup && hasGroupToleranceParams) {
      liveClusters.groupSummary.toleranceGroup = true; // Marcar como parte del grupo de tolerancia
      liveClusters.groupSummary.percent.backgroundColor = "#eceff1";
      liveClusters.groupSummary.tolerance.backgroundColor = "#eceff1";
      liveClusters.groupSummary.penalty.backgroundColor = "#eceff1";
    } else {
      liveClusters.groupSummary.toleranceGroup = false; // No pertenece al grupo de tolerancia
      liveClusters.groupSummary.percent.backgroundColor = "inherit";
      liveClusters.groupSummary.tolerance.backgroundColor = "inherit";
      liveClusters.groupSummary.penalty.backgroundColor = "inherit";
    }
    
    // DryCluster
    liveClusters.Dry.percent.show = !!data.template.availableDry;
    
    // Después de actualizar todos los parámetros, forzar recálculo del porcentaje en groupSummary
    if (liveClusters.groupSummary.percent.effect) {
      liveClusters.groupSummary.percent.effect();
    }
    
    // Forzar recálculo de la tolerancia del grupo
    if (liveClusters.groupSummary.tolerance.effect) {
      liveClusters.groupSummary.tolerance.effect();
    }
    
    // Forzar recálculo de la penalización del grupo
    if (liveClusters.groupSummary.penalty.effect) {
      liveClusters.groupSummary.penalty.effect();
    }
    
    // Restablecer el comportamiento del onChange de la tolerancia del grupo
    // para asegurar que se distribuya correctamente a los parámetros individuales
    const originalToleranceOnChange = liveClusters.groupSummary.tolerance.onChange;
    liveClusters.groupSummary.tolerance.onChange = (value: number) => {
      setVersion((v) => v + 1); // Actualizar versión para forzar re-render
      originalToleranceOnChange(value);
    };
  }, [data?.template, liveClusters]);

  const setTemplateField = useCallback(
    (field: keyof TemplateType, value: any) => {
      setData((prev) => ({
        ...prev,
        template: {
          ...prev.template,
          [field]: value,
        },
      }));
    },
    []
  );

  const setField = useCallback(
    (field: keyof DataReceptionContextType, value: any) => {
      console.log('🔧 DEBUG - setField llamado:', field, '=', value, 'tipo:', typeof value);
      setData((prev) => {
        const newData = { ...prev, [field]: value };
        console.log('🔧 DEBUG - Nuevo estado después de setField:', field, '=', newData[field]);
        return newData;
      });
    },
    []
  );

  // Modifica setTemplate para aplicar correctamente la plantilla
  const setTemplate = useCallback((template: TemplateType) => {
    setData((prev) => ({
      ...prev,
      template,
    }));
  }, []);

  const updateToleranceGroupMode = useCallback(
    (useToleranceGroup: boolean) => {
      setData((prev) => ({
        ...prev,
        template: {
          ...prev.template,
          useToleranceGroup
        },
      }));
      
      // Actualizar el estado de los clusters según el nuevo modo
      const paramClusters = [
        liveClusters.Humedad,
        liveClusters.GranosVerdes,
        liveClusters.Impurezas,
        liveClusters.Vano,
        liveClusters.Hualcacho,
        liveClusters.GranosManchados,
        liveClusters.GranosPelados,
        liveClusters.GranosYesosos
      ];
      
      // Actualizar la propiedad toleranceGroup en cada cluster
      paramClusters.forEach(cluster => {
        if (cluster.available) {
          // Solo actualizamos si el cluster está disponible
          const groupToleranceField = `groupTolerance${cluster.key}` as keyof TemplateType;
          const groupTolerance = data.template[groupToleranceField];
          
          cluster.toleranceGroup = !!(useToleranceGroup && groupTolerance);
          
          // Actualizar colores de fondo según corresponda
          if (useToleranceGroup && groupTolerance) {
            cluster.range.backgroundColor = "#eceff1";
            cluster.tolerance.backgroundColor = "#eceff1";
            cluster.percent.backgroundColor = "#eceff1";
            cluster.penalty.backgroundColor = "#eceff1";
          } else {
            // Restaurar colores predeterminados si no hay error
            if (!cluster.range.error) {
              cluster.range.backgroundColor = "inherit";
            }
            if (!cluster.tolerance.error) {
              cluster.tolerance.backgroundColor = "inherit";
            }
            if (!cluster.percent.error) {
              cluster.percent.backgroundColor = "inherit";
            }
            if (!cluster.penalty.error) {
              cluster.penalty.backgroundColor = "inherit";
            }
          }
        }
      });
      
      // Actualizar el color de fondo del groupSummary
      if (useToleranceGroup && paramClusters.some(c => c.available && c.toleranceGroup)) {
        liveClusters.groupSummary.percent.backgroundColor = "#eceff1";
        liveClusters.groupSummary.tolerance.backgroundColor = "#eceff1";
        liveClusters.groupSummary.penalty.backgroundColor = "#eceff1";
      } else {
        liveClusters.groupSummary.percent.backgroundColor = "inherit";
        liveClusters.groupSummary.tolerance.backgroundColor = "inherit";
        liveClusters.groupSummary.penalty.backgroundColor = "inherit";
      }
      
      // Forzar recálculo de todos los valores relacionados con el grupo de tolerancia
      if (liveClusters.groupSummary.percent.effect) {
        liveClusters.groupSummary.percent.effect();
      }
      
      if (liveClusters.groupSummary.tolerance.effect) {
        liveClusters.groupSummary.tolerance.effect();
      }
      
      if (liveClusters.groupSummary.penalty.effect) {
        liveClusters.groupSummary.penalty.effect();
      }
    },
    [liveClusters, data.template]
  );

  const resetData = useCallback(() => {
    console.log('🔄 DEBUG - resetData llamado - reseteando todos los datos incluido price');
    // Reset data to default values but preserve the template
    setData((prevData) => ({
      ...defaultReceptionData,
      template: prevData.template, // Preserve the template using functional state update
    }));
    
    // Reset all liveClusters values
    // Weights
    if (liveClusters.grossWeight.node) liveClusters.grossWeight.node.value = 0;
    if (liveClusters.tare.node) liveClusters.tare.node.value = 0;
    if (liveClusters.netWeight.node) liveClusters.netWeight.node.value = 0;
    
    // Parameters
    const paramClusters = [
      liveClusters.Humedad,
      liveClusters.GranosVerdes,
      liveClusters.Impurezas,
      liveClusters.Vano,
      liveClusters.Hualcacho,
      liveClusters.GranosManchados,
      liveClusters.GranosPelados,
      liveClusters.GranosYesosos,
    ];
    
    // Reset percent, tolerance, penalty for all parameters
    paramClusters.forEach(cluster => {
      if (cluster.range) cluster.range.value = 0;
      if (cluster.percent) cluster.percent.value = 0;
      if (cluster.tolerance) cluster.tolerance.value = 0;
      if (cluster.penalty) cluster.penalty.value = 0;
    });
    
    // Reset bonus and dry
    if (liveClusters.Bonus.tolerance) liveClusters.Bonus.tolerance.value = 0;
    if (liveClusters.Bonus.penalty) liveClusters.Bonus.penalty.value = 0;
    if (liveClusters.Dry.percent) liveClusters.Dry.percent.value = 0;
    
    // Reset group summary
    if (liveClusters.Summary.percent) liveClusters.Summary.percent.value = 0;
    if (liveClusters.Summary.tolerance) liveClusters.Summary.tolerance.value = 0;
    if (liveClusters.Summary.penalty) liveClusters.Summary.penalty.value = 0;
    if (liveClusters.groupSummary.percent) liveClusters.groupSummary.percent.value = 0;
    if (liveClusters.groupSummary.tolerance) liveClusters.groupSummary.tolerance.value = 0;
    if (liveClusters.groupSummary.penalty) liveClusters.groupSummary.penalty.value = 0;
    
    // Reset total paddy and other calculations
    if (liveClusters.totalPaddy.node) liveClusters.totalPaddy.node.value = 0;
    if (liveClusters.DiscountTotal.node) liveClusters.DiscountTotal.node.value = 0;
    
    // Force update
    setVersion(v => v + 1);
  }, [liveClusters]);

  return {
    data,
    setField,
    setTemplateField,
    setTemplate,
    liveClusters,
    updateToleranceGroupMode,
    resetData,
    initializeWithReception,
  };
}
