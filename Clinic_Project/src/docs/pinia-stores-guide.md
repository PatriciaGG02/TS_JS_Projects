// Ver datos bbdd ejemplo cliente:

<script setup>
// Importamos el store de clientes
import { useClientStore } from "@/stores/useClientStore";

// Inicializamos el store
const clientStore = useClientStore();

// Cargamos los clientes si el array está vacío
if (!clientStore.clients.length) {
  console.log("📥 Cargando clientes desde store...");
  clientStore.loadClients();
}
</script>

<template>
  <div class="p-4 max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Lista de Clientes</h2>

    <!-- Tabla de clientes -->
    <table class="min-w-full border border-gray-300 text-sm">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="px-4 py-2 border-b">Nombre completo</th>
          <th class="px-4 py-2 border-b">DNI</th>
          <th class="px-4 py-2 border-b">Email</th>
          <th class="px-4 py-2 border-b">Teléfono</th>
          <th class="px-4 py-2 border-b">Dirección</th>
          <th class="px-4 py-2 border-b">Sede</th>
        </tr>
      </thead>
      <tbody>
        <!-- Mostramos cada cliente -->
        <tr
          v-for="client in clientStore.clients"
          :key="client.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ client.full_name }}</td>
          <td class="px-4 py-2 border-b">{{ client.DNI }}</td>
          <td class="px-4 py-2 border-b">{{ client.email }}</td>
          <td class="px-4 py-2 border-b">{{ client.phone }}</td>
          <td class="px-4 py-2 border-b">{{ client.address }}</td>
          <td class="px-4 py-2 border-b">{{ client.headquarters_name }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

// Añadir a la bbdd con ejemplo de cliente:

<script setup>
// Importamos herramientas de Vue y los stores necesarios
import { ref } from "vue"
import { useClientStore } from "@/stores/useClientStore" // Store de clientes (CRUD)
import { useHeadquartersStore } from "@/stores/useHeadquartersStore" // Store de sedes

// Mensaje de control en consola al montar el componente
console.log("🧪 Componente Test.vue montado")

// Inicializamos los stores
const clientStore = useClientStore()
const headquartersStore = useHeadquartersStore()

// Mostramos los stores en consola para depuración
console.log("📦 clientStore cargado:", clientStore)
console.log("🏢 headquartersStore cargado:", headquartersStore)

// Si aún no se han cargado las sedes, se hace la llamada
if (!headquartersStore.headquarters.length) {
  console.log("📥 Cargando sedes desde store...")
  headquartersStore.loadHeadquarters()
}

// ------------------------------
// Definimos los campos del formulario como variables reactivas
// ------------------------------
const name = ref("")
const firstSurname = ref("")
const secondSurname = ref("")
const dni = ref("")
const email = ref("")
const phone = ref("")
const address = ref("")
const headquartersId = ref("")

// Variables para mostrar mensajes de éxito o error
const errorMessage = ref("")
const successMessage = ref("")

// ------------------------------
// Función para enviar el formulario
// ------------------------------
const handleSubmit = async () => {
  console.log("📨 Enviando formulario...")

  // Validación: campos obligatorios
  if (
    !name.value ||
    !firstSurname.value ||
    !dni.value ||
    !email.value ||
    !headquartersId.value
  ) {
    console.warn("⚠️ Formulario incompleto")
    errorMessage.value = "Faltan campos obligatorios"
    successMessage.value = ""
    return
  }

  // Construimos el objeto a enviar a la base de datos
  const clientData = {
    name: name.value,
    first_surname: firstSurname.value,
    second_surname: secondSurname.value,
    DNI: dni.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    id_headquarters: headquartersId.value
  }

  console.log("📦 Datos a enviar:", clientData)

  // Llamamos al método del store para crear el cliente
  const error = await clientStore.createClient(clientData)

  console.log("✅ Resultado de createClient:", error)

  // Mostramos mensaje según resultado
  if (error) {
    errorMessage.value = "Error al crear cliente"
    successMessage.value = ""
    console.error("❌ Error:", error)
  } else {
    successMessage.value = "Cliente creado correctamente"
    errorMessage.value = ""
    console.log("🎉 Cliente creado")

    // Limpiamos el formulario tras creación exitosa
    name.value = ""
    firstSurname.value = ""
    secondSurname.value = ""
    dni.value = ""
    email.value = ""
    phone.value = ""
    address.value = ""
    headquartersId.value = ""
  }
}
</script>
<template>
  <form
    @submit.prevent="handleSubmit"
    class="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded shadow"
  >
    <h2 class="text-xl font-bold">Crear nuevo cliente</h2>

    <input
      v-model="name"
      type="text"
      placeholder="Nombre"
      class="border p-2 rounded"
    />
    <input
      v-model="firstSurname"
      type="text"
      placeholder="Primer apellido"
      class="border p-2 rounded"
    />
    <input
      v-model="secondSurname"
      type="text"
      placeholder="Segundo apellido"
      class="border p-2 rounded"
    />
    <input
      v-model="dni"
      type="text"
      placeholder="DNI"
      class="border p-2 rounded"
    />
    <input
      v-model="email"
      type="email"
      placeholder="Correo electrónico"
      class="border p-2 rounded"
    />
    <input
      v-model="phone"
      type="tel"
      placeholder="Teléfono"
      class="border p-2 rounded"
    />
    <input
      v-model="address"
      type="text"
      placeholder="Dirección"
      class="border p-2 rounded"
    />

    <select v-model="headquartersId" class="border p-2 rounded">
      <option value="" disabled>Selecciona una sede</option>
      <option
        v-for="hq in headquartersStore.headquarters"
        :key="hq.id"
        :value="hq.id"
      >
        {{ hq.name }}
      </option>
    </select>

    <button
      type="submit"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Crear cliente
    </button>

    <p v-if="successMessage" class="text-green-600">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>

  </form>
</template>

// Editar en la bbdd con ejemplo básico de cliente

<script setup>
// Importaciones necesarias
import { ref } from "vue"
import { useClientStore } from "@/stores/useClientStore"
import { useHeadquartersStore } from "@/stores/useHeadquartersStore"

// Inicialización de los stores
const clientStore = useClientStore()
const headquartersStore = useHeadquartersStore()

// Carga inicial si no están ya disponibles
if (!clientStore.clients.length) clientStore.loadClients()
if (!headquartersStore.headquarters.length) headquartersStore.loadHeadquarters()

// ID del cliente que está en modo edición
const editingClientId = ref(null)

// Formulario editable para el cliente actual
const form = ref({
  name: "",
  first_surname: "",
  second_surname: "",
  DNI: "",
  email: "",
  phone: "",
  address: "",
  id_headquarters: ""
})

// Activa el modo edición cargando los datos en el formulario
const startEdit = (client) => {
  editingClientId.value = client.id
  form.value = {
    name: client.full_name.split(" ")[0] || "",
    first_surname: client.full_name.split(" ")[1] || "",
    second_surname: client.full_name.split(" ")[2] || "",
    DNI: client.DNI,
    email: client.email,
    phone: client.phone,
    address: client.address,
    id_headquarters: headquartersStore.headquarters.find(
      (hq) => hq.name === client.headquarters_name
    )?.id || ""
  }
}

// Cancela la edición
const cancelEdit = () => {
  editingClientId.value = null
  form.value = {
    name: "",
    first_surname: "",
    second_surname: "",
    DNI: "",
    email: "",
    phone: "",
    address: "",
    id_headquarters: ""
  }
}

// Guarda los cambios
const saveEdit = async () => {
  const error = await clientStore.editClient(editingClientId.value, form.value)
  if (!error) {
    cancelEdit()
    await clientStore.loadClients()
  } else {
    alert("❌ Error al guardar los cambios")
  }
}
</script>

<template>
  <div class="p-4 max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Editar Clientes</h2>

    <table class="min-w-full border text-sm">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="px-3 py-2 border-b">Nombre</th>
          <th class="px-3 py-2 border-b">Primer apellido</th>
          <th class="px-3 py-2 border-b">Segundo apellido</th>
          <th class="px-3 py-2 border-b">DNI</th>
          <th class="px-3 py-2 border-b">Email</th>
          <th class="px-3 py-2 border-b">Teléfono</th>
          <th class="px-3 py-2 border-b">Dirección</th>
          <th class="px-3 py-2 border-b">Sede</th>
          <th class="px-3 py-2 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="client in clientStore.clients"
          :key="client.id"
          class="hover:bg-gray-50"
        >
          <template v-if="editingClientId === client.id">
            <td class="px-3 py-2 border-b">
              <input v-model="form.name" class="border p-1 w-full" />
            </td>
            <td class="px-3 py-2 border-b">
              <input v-model="form.first_surname" class="border p-1 w-full" />
            </td>
            <td class="px-3 py-2 border-b">
              <input v-model="form.second_surname" class="border p-1 w-full" />
            </td>
            <td class="px-3 py-2 border-b">
              <input v-model="form.DNI" class="border p-1 w-full" />
            </td>
            <td class="px-3 py-2 border-b">
              <input v-model="form.email" class="border p-1 w-full" />
            </td>
            <td class="px-3 py-2 border-b">
              <input v-model="form.phone" class="border p-1 w-full" />
            </td>
            <td class="px-3 py-2 border-b">
              <input v-model="form.address" class="border p-1 w-full" />
            </td>
            <td class="px-3 py-2 border-b">
              <select v-model="form.id_headquarters" class="border p-1 w-full">
                <option
                  v-for="hq in headquartersStore.headquarters"
                  :key="hq.id"
                  :value="hq.id"
                >
                  {{ hq.name }}
                </option>
              </select>
            </td>
            <td class="px-3 py-2 border-b flex gap-2">
              <button
                class="bg-green-600 text-white px-2 py-1 rounded"
                @click="saveEdit"
              >
                Guardar
              </button>
              <button
                class="bg-gray-500 text-white px-2 py-1 rounded"
                @click="cancelEdit"
              >
                Cancelar
              </button>
            </td>
          </template>

          <template v-else>
            <td class="px-3 py-2 border-b">{{ client.full_name.split(" ")[0] }}</td>
            <td class="px-3 py-2 border-b">{{ client.full_name.split(" ")[1] }}</td>
            <td class="px-3 py-2 border-b">{{ client.full_name.split(" ")[2] || "" }}</td>
            <td class="px-3 py-2 border-b">{{ client.DNI }}</td>
            <td class="px-3 py-2 border-b">{{ client.email }}</td>
            <td class="px-3 py-2 border-b">{{ client.phone }}</td>
            <td class="px-3 py-2 border-b">{{ client.address }}</td>
            <td class="px-3 py-2 border-b">{{ client.headquarters_name }}</td>
            <td class="px-3 py-2 border-b">
              <button
                class="bg-yellow-400 text-black px-2 py-1 rounded"
                @click="startEdit(client)"
              >
                Editar
              </button>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

  </div>
</template>

// Eliminar de la bbdd

<script setup>
// Importamos el store de clientes
import { useClientStore } from "@/stores/useClientStore";

// Inicializamos el store
const clientStore = useClientStore();

// Cargamos los clientes si aún no están cargados
if (!clientStore.clients.length) {
  console.log("📥 Cargando clientes desde store...");
  clientStore.loadClients();
}

// Función para eliminar un cliente con confirmación
const deleteClient = async (id) => {
  const confirmed = window.confirm(
    "¿Estás seguro de que deseas eliminar este cliente?"
  );
  if (!confirmed) return;

  const error = await clientStore.removeClient(id);

  if (error) {
    console.error("❌ Error al eliminar cliente:", error);
    alert("Error al eliminar el cliente");
  } else {
    console.log("🗑️ Cliente eliminado correctamente");
    await clientStore.loadClients();
  }
};
</script>

<template>
  <div class="p-4 max-w-5xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Eliminar Clientes</h2>

    <!-- Tabla de clientes con botón eliminar -->
    <table class="min-w-full border border-gray-300 text-sm">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="px-4 py-2 border-b">Nombre completo</th>
          <th class="px-4 py-2 border-b">DNI</th>
          <th class="px-4 py-2 border-b">Email</th>
          <th class="px-4 py-2 border-b">Teléfono</th>
          <th class="px-4 py-2 border-b">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="client in clientStore.clients"
          :key="client.id"
          class="hover:bg-gray-50"
        >
          <td class="px-4 py-2 border-b">{{ client.full_name }}</td>
          <td class="px-4 py-2 border-b">{{ client.DNI }}</td>
          <td class="px-4 py-2 border-b">{{ client.email }}</td>
          <td class="px-4 py-2 border-b">{{ client.phone }}</td>
          <td class="px-4 py-2 border-b">
            <button
              class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              @click="() => deleteClient(client.id)"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
