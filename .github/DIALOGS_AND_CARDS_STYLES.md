# Instrucciones de estilo para Diálogos y Cards

Este documento contiene **instrucciones claras** que debes seguir cuando crees o actualices
componentes de **diálogos (modales)** y **cards**. Aplica estas reglas para garantizar
coherencia visual y de comportamiento en toda la aplicación.

---

## 🃏 Cards

Sigue estas instrucciones cada vez que construyas una tarjeta:

- Usa este contenedor base:
  ```tsx
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-2">
    ...
  </div>
  ```
- Asegúrate de incluir:
  - `bg-white rounded-lg` para bordes y fondo neutro.
  - `shadow-sm` (la sombra es ligera; no requiere transición al hover).
  - `border border-gray-200` para separar del fondo.
  - `overflow-hidden` si añades imágenes o secciones que puedan desbordar.
- El padding del artículo debe ser `p-2` en lugar de `px-6 py-4` para mantener el diseño compacto.
- Para garantizar que el pie de la card siempre quede abajo, añade `flex flex-col justify-between` al contenedor
  y envuelve el contenido principal en un `div` con `flex-grow`.
- Si hay imagen, colócala arriba con `w-full aspect-video bg-primary/10` y usa
  `w-full h-full object-cover` en el `<img>`.
- Divide el contenido en bloques con márgenes (`mb-2`, `mb-4`) para nombre, badges,
  descripción e información adicional.
- Alinea badges a la izquierda usando `flex justify-start`.
- Crea el pie de acciones con:
  ```tsx
  <div className="flex gap-2 justify-end pt-2 border-t border-gray-200">
    {/* botones */}
  </div>
  ```
  - Cuando uses `IconButton` dentro del pie, la variante debe ser `BasicSecondary`.
    Esto garantiza contraste adecuado y consistencia entre tarjetas (usar
    `variant="BasicSecondary"`).

**Recuerda:** estas tarjetas sirven para productos, usuarios, unidades, categorías y
otras entidades similares; sigue el mismo patrón. Si necesitas un card más compacto puedes
ajustar márgenes internos, pero el contenedor base (`p-2` y `shadow-sm`) es obligatorio.

➡️ **Nota adicional**: siempre considera la estructura `flex flex-col justify-between` con
contenido encerrado en un `flex-grow` cuando el card debe tener un footer/acciones al fondo.

## 💬 Diálogos / Modales

Aplica estas reglas cada vez que implementes un modal:

- Crea el overlay con:
  ```tsx
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      {/* contenido */}
    </div>
  </div>
  ```
- Dentro del contenedor interior:
  - Usa `bg-white rounded-lg shadow-xl`.
  - Define `max-w-md w-full mx-4` y limita la altura con `max-h-[90vh]` para permitir
    scroll interno.
  - Aplica `px-6 py-4` en encabezado y formulario.
  - Añade un encabezado con `border-b border-gray-200` y un título `text-lg font-bold text-foreground`.
- Para el formulario:
  - Organiza los campos con `space-y-4`.
  - Utiliza siempre los componentes del design system (`TextField`, `Select`,
    `MultimediaUploader`, etc.).
  - Muestra errores usando un `Alert` antes de los botones de acción.
- El pie de diálogo debe contener dos botones:
  ```tsx
  <div className="flex gap-3 pt-4 justify-between">
    <Button variant="outlined">Cancelar</Button>
    <Button variant="primary">Aceptar</Button>
  </div>
  ```
  - Desactiva los botones con `disabled={isLoading}` y cambia el texto cuando hay carga.
  - **Botón de eliminación/destructivo:** cuando el diálogo pide confirmación para borrar algo (usuario, producto, etc.), el segundo botón debe usar el estilo rojo y redondeado que se emplea en los diálogos de eliminación de producto:
    ```tsx
    <Button
      variant="primary"
      className="bg-red-500 text-white hover:bg-red-600 rounded-full"
    >
      Eliminar
    </Button>
    ```
    Esto garantiza consistencia visual entre todos los modales de eliminación.

- **Limpieza de estado al cerrar:** todos los diálogos de creación o edición deben reiniciar su estado interno *después* de cerrarse, ya sea porque el usuario canceló la operación o porque se realizó la acción correctamente. Esto incluye campos, errores y banderas de carga. La lógica puede implementarse usando un efecto que observe la propiedad `open` o envolviendo la llamada a `onClose` en una función de reset. Aunque es un comportamiento más funcional que de estilo, lo mantenemos documentado aquí para que el equipo no lo olvide.

## 📝 Instrucciones generales

1. Utiliza siempre las clases y estructuras descritas en las secciones anteriores.
2. Respeta la secuencia de HTML recomendada para evitar inconsistencias: overlay →
   contenedor → encabezado/formulario → pie.
3. Coloca las alertas y mensajes de error antes de los botones de acción en todos los
   modales.
4. Evita el uso de elementos HTML nativos (`div`, `button`, etc.); usa los componentes
   del Design System.
5. Si necesitas romper alguna regla, anótalo en este mismo archivo para que el equipo
   conozca la excepción.


---

> Estas instrucciones unifican la apariencia y el comportamiento en toda la aplicación.
> Cuando el diseño cambie, actualiza este archivo en `.github` para que el equipo tenga
> la versión más reciente.
