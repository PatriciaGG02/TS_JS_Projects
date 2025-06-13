import { defineStore } from 'pinia'
import { fetchClients, createClient as createClientService, updateClient as updateClientService, deleteClient as deleteClientService } from '@/services/ClientService'
import { useAuthStore } from './useAuthStore';

export const useClientStore = defineStore('clients', {
  state: () => ({
    /** @type {ClientMapped[]} */
    clients: [],
    loading: false,
    /** @type {Error|null} */
    error: null
  }),

  actions: {
    async loadClients() {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore();
        const headquartersId = authStore.profile?.id_headquarters;

        let data;
        if (headquartersId) {
          data = await fetchClients(headquartersId); // Pasa el ID de la sede a la función fetchClients
        } else {
          data = await fetchClients(); // Si no hay ID de sede, trae todos los clientes (o puedes manejarlo de otra manera)
        }

        this.clients = data.map(client => ({
          id: client.id,
          name: client.name,
          first_surname: client.first_surname,
          second_surname: client.second_surname,
          full_name: `${client.name} ${client.first_surname} ${client.second_surname || ''}`.trim(),
          DNI: client.DNI,
          email: client.email,
          phone: client.phone,
          address: client.address,
          headquarters_name: client.headquarters?.name || 'Sin sede'
        }))
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },
    async createClient(clientData) {
      const { error } = await createClientService(clientData)
      if (!error) await this.loadClients()
      return error
    },
    async editClient(id, updatedData) {
      const { error } = await updateClientService(id, updatedData)
      if (!error) await this.loadClients()
      return error
    },
    async removeClient(id) {
      const { error } = await deleteClientService(id)
      if (!error) await this.loadClients()
      return error
    }
  }
})