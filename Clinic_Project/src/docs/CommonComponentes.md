# 🧩 Documentación de Componentes Comunes

## Tabla de Contenido

- [AppButton](#appbutton)
  - [Uso básico](#uso-básico)
  - [Props](#props)
  - [Slots](#slots)
  - [Eventos](#eventos)
  - [Estilos disponibles](#estilos-disponibles)
- [AppForm](#appform)
  - [Uso básico](#uso-básico-1)
  - [Props](#props-1)
- [AppInput](#appinput)
  - [Uso básico](#uso-básico-2)
  - [Props](#props-2)
- [AppSelect](#appselect)
  - [Uso básico](#uso-básico-3)
  - [Props](#props-3)
- [AppSelectSearch](#appselectsearch)
  - [Uso básico](#uso-básico-4)
  - [Props](#props-4)
- [Header](#header)
  - [Uso básico](#uso-básico-5)
  - [Props](#props-5)
- [Modal](#modal)
  - [Uso básico](#uso-básico-6)
  - [Props](#props-6)
  - [Eventos](#eventos-1)
- [AppNotification](#appnotification)
  - [Uso básico](#uso-básico-7)
  - [Props](#props-7)
  - [Eventos](#eventos-2)

## AppButton

Botón reutilizable con variantes de estilo y soporte para estado de carga automático al enviar formularios.

### Uso básico

<AppButton type="submit" variant="green">
  Crear sede
</AppButton>

### Props

- type: string  
  Tipo de botón HTML. Valores permitidos: "button" (por defecto), "submit", "reset".

- variant: string  
  Estilo visual del botón. Valores permitidos: "primary" (por defecto), "green", "red", "orange".

- disabled: boolean  
  Deshabilita el botón. Por defecto: false.

- showLoader: boolean  
  Muestra el texto "Cargando..." cuando el formulario está en carga y el tipo es "submit". Por defecto: true.

### Slots

- default: Contenido interno del botón (texto, iconos, etc.).

### Eventos

- click: Se emite cuando se hace clic en el botón, solo si el tipo no es "submit".

### Estilos disponibles

- primary: azul profesional (#1565c0)

- green: verde confianza (#43a047)

- red: rojo controlado (#ef5350)

- orange: naranja (#ff9800)

# AppForm

Componente contenedor que maneja envío de formularios con estado de carga (loading) accesible para los botones hijos.

### Uso básico

<AppForm :onSubmit="handleSubmit">
  <!-- tus inputs y botones aquí -->
</AppForm>

### Props

- onSubmit (Function) — Requerido  
  Función que se ejecuta cuando se envía el formulario.

### Comportamiento automático

- Provee el estado de carga (formLoading) a los hijos mediante provide().

- Si hay un AppButton dentro con type="submit", este mostrará "Cargando..." automáticamente durante el envío.

- Si onSubmit lanza un error, lo captura en consola y termina el loading.

### Ejemplo completo

```vue
<AppForm :onSubmit="guardarDatos">
  <AppInput v-model="form.nombre" label="Nombre" required />
  <AppButton type="submit" variant="green">Guardar</AppButton>
</AppForm>

<script setup>
const guardarDatos = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  alert("Guardado con éxito ✅");
};
</script>
```

# AppInput

Componente de input con soporte para label, validación visual y binding reactivo mediante v-model.

### Uso básico

```js
<AppInput
  v-model="form.nombre"
  label="Nombre"
  placeholder="Introduce tu nombre"
  required:disabled="false"
  id="nombre-input"
  error="Este campo es obligatorio"
/>
```

### Props

- modelValue: String  
  Valor ligado reactivo con v-model.

- label: String  
  Texto para la etiqueta del input. Opcional.

- error: String  
  Mensaje de error que se muestra debajo del input. Opcional.

- type: String  
  Tipo HTML del input. Por defecto: "text".

- placeholder: String  
  Texto de ayuda que aparece dentro del input.

- disabled: Boolean  
  Deshabilita el input.

- id: String  
  Identificador para el input y label.

- required: Boolean  
  Indica que el input es obligatorio.

# AppSelect

Componente select con soporte para label, placeholder, error y binding reactivo mediante v-model.

### Uso básico

```js
<AppSelect
  v-model="form.categoria"
  label="Categoría"
  :options="[
    { label: 'Opción 1', value: 'op1' },
    { label: 'Opción 2', value: 'op2' },
    { label: 'Opción 3', value: 'op3' }
  ]"
  placeholder="Selecciona una opción"
  :disabled="false"
  id="categoria-select"
  error="Campo requerido"
/>
```

### Props

- modelValue: String | Number  
  Valor ligado reactivo con v-model.

- label: String  
  Texto para la etiqueta del select. Opcional.

- placeholder: String  
  Texto que aparece como opción deshabilitada para indicar que selecciones algo. Opcional.

- error: String  
  Mensaje de error que se muestra debajo del select. Opcional.

- disabled: Boolean  
  Deshabilita el select.

- id: String  
  Identificador para el select y label.

- options: Array (Requerido)  
  Lista de opciones para el select. Cada opción debe ser un objeto con propiedades label y value.

# AppSelectSearch

Select con búsqueda integrada, limpieza de selección y soporte para etiquetas extra en opciones.

### Uso básico

```js
<AppSelectSearch
  v-model="form.producto"
  :options="[
    { label: 'Manzana', value: 'manzana', extra: 'Fruta' },
    { label: 'Lechuga', value: 'lechuga', extra: 'Verdura' },
    { label: 'Pan', value: 'pan' }
  ]"
  label="Producto"
  placeholder="Busca y selecciona"
  id="producto-select-search"
  error="Campo requerido"
/>
```

### Props

- modelValue: String | Number  
  Valor ligado reactivo con v-model.

- options: Array (Requerido)  
  Lista de opciones, cada una con label y value. Opcionalmente puede incluir extra para información adicional.

- label: String  
  Etiqueta del input. Opcional.

- placeholder: String  
  Texto que aparece en el input cuando está vacío. Opcional.

- error: String  
  Mensaje de error mostrado debajo del input. Opcional.

- id: String  
  Identificador para el input y label.

# Header

Componente de encabezado fijo con nombre de clínica, menú lateral y modal de autenticación.

### Uso básico

```html
<header :menuItems="menuItems" />
```

### Props

- menuItems: Array  
  Lista de objetos para el menú lateral, con esta estructura:

```js
[
  { label: "Sedes", path: "#" },
  { label: "Trabajadores", path: "#" },
  { label: "Ajustes", path: "#" },
];
```

# Modal

Componente modal con backdrop oscuro, animaciones, título y botón de cierre.

### Uso básico

```js
<Modal v-if="showModal" title="Título del Modal" @close="showModal = false">
  <p>Contenido del modal aquí.</p>
</Modal>
```

### Props

- title: String  
  Texto que aparece como título en el modal.

### Eventos

- close  
  Se emite cuando el usuario cierra el modal (clic en botón × o fuera del modal).

### Descripción

- El modal aparece centrado sobre un fondo semitransparente.
- El botón × cierra el modal.
- Al hacer clic en el fondo fuera del modal también se cierra.
- El contenido dentro del modal se pasa usando un slot.

# AppNotification

Componente de notificación flotante con animación, cierre automático y estilos personalizados por tipo.

### Uso básico

```js
<Notification
  message="Guardado correctamente"
  type="success"
  :duration="3000"
  @hidden="handleOcultar"
/>
```

### Props

- message: String (obligatorio)  
  Texto a mostrar en la notificación.

- type: String (opcional)  
  Define el estilo visual. Valores posibles: "success" (por defecto), "error", "warning", "info".

- duration: Number (opcional)  
  Tiempo en milisegundos antes de ocultarse automáticamente. Si es 0, no se oculta automáticamente. Valor por defecto: 3000.

### Eventos

- hidden:  
  Se emite cuando la notificación se oculta, ya sea automáticamente o al hacer clic en el botón de cierre.

### Descripción

La notificación aparece en la parte inferior derecha con animación slide-fade. Puede tener distintos colores dependiendo del tipo (success, error, warning, info) y se puede cerrar manualmente o automáticamente pasado un tiempo.
