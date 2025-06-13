import { defineStore } from 'pinia'
import {
  fetchPets,
  createPet as createPetService,
  updatePet as updatePetService,
  deletePet as deletePetService
} from '@/services/PetService'
import { useAuthStore } from './useAuthStore';

/**
 * @typedef {Object} PetMapped
 * @property {string} id
 * @property {string} name
 * @property {string} kind
 * @property {string} birthdate
 * @property {number} chip_number
 * @property {string} observations
 * @property {string} breed
 * @property {string} headquarters_name
 * @property {string} id_client
 * @property {string} client_DNI
 */

export const usePetsStore = defineStore('pets', {
  state: () => ({
    /** @type {PetMapped[]} */
    pets: [],
    loading: false,
    /** @type {Error|null} */
    error: null
  }),

  actions: {
    async loadPets() {
      this.loading = true
      this.error = null
      try {
        const authStore = useAuthStore();
        const headquartersId = authStore.profile?.id_headquarters;

        let data = await fetchPets(headquartersId); // Pasa el ID de la sede a la función fetchPets

        console.log("usePetStore - Pets data:", data); // Agrega este console.log

        // Filtrar las mascotas por headquartersId
        if (headquartersId) {
          data = data.filter(pet => pet.id_headquarters === headquartersId);
        }

        this.pets = data.map(pet => ({
          id: pet.id,
          name: pet.name,
          kind: pet.kind,
          birthdate: pet.birthdate,
          chip_number: pet.chip_number,
          observations: pet.observations,
          breed: pet.breed,
          headquarters_name: pet.headquarters?.name || 'Sin sede',
          id_client: pet.client?.id || null,
          client_DNI: pet.client?.DNI || 'Sin cliente',
          headquarters_id: pet.headquarters_id, // Agrega headquarters_id al mapeo
        }))
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async createPet(petData) {
      try {
        const { error } = await createPetService(petData);
        console.log("Supabase createPet error:", error);
        if (error) {
          console.error("Error al crear la mascota:", error);
          this.error = error;
          return error;
        } else {
          console.log("Mascota creada correctamente");
          await this.loadPets(); // Recarga la lista de mascotas
          return null;
        }
      } catch (error) {
        console.error("Error al crear la mascota:", error);
        this.error = error;
        return error;
      }
    },

    async editPet(id, updatedData) {
      try {
        const { error } = await updatePetService(id, updatedData);
        if (error) {
          console.error("Error al editar la mascota:", error);
          this.error = error;
          return error;
        } else {
          console.log("Mascota editada correctamente");
          await this.loadPets(); // Recarga la lista de mascotas
          return null;
        }
      } catch (error) {
        console.error("Error al editar la mascota:", error);
        this.error = error;
        return error;
      }
    },

    async removePet(id) {
      const { error } = await deletePetService(id)
      if (!error) {
        this.pets = this.pets.filter(p => p.id !== id)
      }
      return error
    }
  }
})