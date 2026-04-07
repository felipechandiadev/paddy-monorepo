# 🎛️ Frontend Patterns and Layouts - Patrones y Composiciones

**Propósito**: Patrones de layout y composición reutilizables en el frontend  
**Versión**: 1.0  
**Última actualización**: Marzo 2026  
**Status**: ✅ Production-Ready

---

## Tabla de Contenidos

1. [Layouts Base](#-layouts-base)
2. [Grid Responsivos](#-grid-responsivos)
3. [Patterns de Listas](#-patterns-de-listas)
4. [Patterns de Formularios](#-patterns-de-formularios)
5. [Patterns de Páginas](#-patterns-de-páginas)
6. [Composición General](#-composición-general)

---

## 🏗️ Layouts Base

### Layout de Página Estándar

El layout más común en la aplicación:

```tsx
export default function PageLayout({ 
  title, 
  subtitle,
  children,
  className = '' 
}) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {/* Header de página */}
      <div className="max-w-4xl mx-auto px-4 py-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-primary mb-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-neutral-600">
            {subtitle}
          </p>
        )}
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}
```

**Estructura:**
- `min-h-screen` - Al menos altura de pantalla
- `max-w-4xl mx-auto` - Contenedor centrado con máx width
- `px-4` - Padding horizontal responsive (mobile-safe)
- `py-6` - Padding vertical

**Uso:**
```tsx
<PageLayout 
  title="Productores"
  subtitle="Gestión de productores de arroz"
>
  {/* Contenido */}
</PageLayout>
```

### Layout de Dos Columnas

Sidebars, paneles complementarios:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
  {/* Columna principal 2/3 */}
  <div className="lg:col-span-2">
    {/* Contenido principal */}
  </div>

  {/* Sidebar 1/3 */}
  <div className="lg:col-span-1">
    {/* Sidebar */}
  </div>
</div>
```

**Responsividad:**
- Mobile: 1 columna (stackeado)
- Desktop (lg): 2 columnas (2/3 + 1/3)
- Gap: 24px

### Layout Ancho (Full Width)

Para contenido que necesita más espacio:

```tsx
<div className="min-h-screen bg-white">
  <div className="max-w-6xl mx-auto px-4 py-6">
    {/* Contenido ancho */}
  </div>
</div>
```

**Diferencias:**
- `max-w-4xl` (896px) - Layout estándar
- `max-w-6xl` (1152px) - Layout ancho
- `max-w-full` - Sin límite de ancho

---

## 📊 Grid Responsivos

### Grid 2 Columnas (Formularios)

Patrón para formularios de dos columnas:

```tsx
<form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
  <div>
    <label className="text-sm font-medium text-neutral-700 block mb-2">
      Campo Izquierdo
    </label>
    <input className="w-full border border-gray-200 rounded-lg px-3 py-2" />
  </div>

  <div>
    <label className="text-sm font-medium text-neutral-700 block mb-2">
      Campo Derecho
    </label>
    <input className="w-full border border-gray-200 rounded-lg px-3 py-2" />
  </div>

  {/* Campo full-width */}
  <div className="md:col-span-2">
    <label className="text-sm font-medium text-neutral-700 block mb-2">
      Campo Completo
    </label>
    <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={4} />
  </div>

  {/* Botones full-width */}
  <div className="md:col-span-2 flex gap-2 justify-end">
    <button className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-50">
      Cancelar
    </button>
    <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80">
      Guardar
    </button>
  </div>
</form>
```

**Breakpoints:**
- `grid-cols-1` - Mobile (1 columna)
- `md:grid-cols-2` - Tablet+ (2 columnas)
- `md:col-span-2` - Campo full-width en grid 2 cols

### Grid 3 Columnas (Cards)

Para mostrar cards en grid:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Card content */}
    </div>
  ))}
</div>
```

**Breakpoints:**
- `grid-cols-1` - Mobile (1 columna)
- `sm:grid-cols-2` - Tablet (2 columnas, 640px+)
- `lg:grid-cols-3` - Desktop (3 columnas, 1024px+)

### Grid Asimétrico

Card grande + varios pequeños:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Item grande - ocupa 2 columnas */}
  <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    {/* Grande */}
  </div>

  {/* Item pequeño */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    {/* Pequeño */}
  </div>

  {/* Item pequeño */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    {/* Pequeño */}
  </div>
</div>
```

---

## 📋 Patterns de Listas

### Patrón: Lista con Header de Búsqueda

```tsx
function ListWithSearch({ items, onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="space-y-4">
      {/* Header con search y botón crear */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 max-w-sm border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button className="bg-primary text-white rounded px-4 py-2 text-sm font-medium hover:bg-primary/80 flex items-center gap-2">
          + Crear Nuevo
        </button>
      </div>

      {/* Lista de items */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-600">No hay resultados</p>
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-neutral-600">{item.description}</p>
              </div>
              <button className="text-neutral-600 hover:text-foreground ml-4">
                Editar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

**Estructura:**
1. Spacing: `space-y-4` (16px entre secciones)
2. Header: Search + botón crear con `justify-between`
3. Lista: `space-y-2` (8px entre items)
4. Item: Flex con contenido + acciones a la derecha
5. Empty state: Centrado con mensaje

### Patrón: Tabla con Paginación

```tsx
function TableWithPagination({ items, currentPage, onPageChange }) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-neutral border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Nombre</th>
              <th className="px-4 py-2 text-left font-semibold">Email</th>
              <th className="px-4 py-2 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map(item => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-neutral">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.email}</td>
                <td className="px-4 py-2 text-right">
                  <button className="text-primary hover:text-primary/80">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, items.length)} de {items.length}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded text-sm ${
                page === currentPage
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 Patterns de Formularios

### Patrón: Formulario Modal

```tsx
function FormDialog({ isOpen, onClose, onSubmit, title }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ name: '', email: '', message: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-600 hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-2">
              Mensaje
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end border-t border-gray-200 pt-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded text-sm font-medium hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-primary/80"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### Patrón: Formulario Inline (Row)

```tsx
function InlineForm({ onSubmit }) {
  const [name, setName] = useState('');

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nuevo item..."
        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/80"
      >
        Agregar
      </button>
    </form>
  );
}
```

---

## 📄 Patterns de Páginas

### Patrón: Página CRUD (Lista + Acciones)

```tsx
function CRUDPage() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-primary">Gestión de Items</h1>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search + Create */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-sm border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary text-white rounded px-4 py-2 font-medium hover:bg-primary/80"
          >
            + Crear
          </button>
        </div>

        {/* Lista */}
        <div className="space-y-2">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-neutral-600">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-primary hover:text-primary/80 text-sm">
                  Editar
                </button>
                <button className="text-error hover:text-error/80 text-sm">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dialog */}
        <FormDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={async (data) => {
            // Add logic
          }}
          title="Crear Nuevo Item"
        />
      </div>
    </div>
  );
}
```

---

## 🎨 Composición General

### Principios de Composición

1. **Espaciado Consistente**
   ```
   Gap entre secciones: 16px (gap-4, space-y-4)
   Gap entre items: 8px (gap-2, space-y-2)
   Padding de contenedores: 8px o 16px (p-2, p-4)
   ```

2. **Jerarquía Visual**
   ```
   Títulos: text-3xl (h1), text-2xl (h2), text-lg (h3)
   Body: text-base
   Secundario: text-sm
   Auxiliar: text-xs
   ```

3. **Colores Semánticos**
   ```
   Acciones: primary (azul)
   Éxito: success (verde)
   Error: error (rojo)
   Advertencia: warning (amarillo)
   ```

4. **Responsividad Móvil-First**
   ```
   Base: Mobile
   sm: 640px+
   md: 768px+
   lg: 1024px+
   ```

### Checklist de Buena Composición

- [ ] Espaciado consistente (gaps de 2, 4, 6 o 8)
- [ ] Máximo nesting de 4 niveles
- [ ] Extracto componentes reutilizables si se repite >2 veces
- [ ] Responsive: probado en mobile, tablet, desktop
- [ ] Accesibilidad: labels, aria attributes, keyboard navigation
- [ ] Performance: memo para componentes costosos
- [ ] Consistencia: colores, tipografía, espaciado matches

---

**Referencias**:
- [FRONTEND_STYLES_GUIDE.md](./FRONTEND_STYLES_GUIDE.md)
- [FRONTEND_COMPONENTS_STYLES.md](./FRONTEND_COMPONENTS_STYLES.md)

**Próximo Documento**: [FRONTEND_RESPONSIVE_DESIGN.md](./FRONTEND_RESPONSIVE_DESIGN.md)

