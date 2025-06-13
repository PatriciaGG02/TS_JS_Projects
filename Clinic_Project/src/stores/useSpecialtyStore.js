import { defineStore } from "pinia";
import {
  fetchSpecialties,
  createSpecialty as createSpecialtyService,
  updateSpecialty as updateSpecialtyService,
  deleteSpecialty as deleteSpecialtyService,
} from "@/services/SpecialtyService";

/**
 * @typedef {Object} Specialty
 * @property {string} id
 * @property {string} name
 * @property {boolean} active
 */

export const useSpecialtiesStore = defineStore("specialties", {
  state: () => ({
    /** @type {Specialty[]} */
    specialties: [],
    loading: false,
    /** @type {Error|null} */
    error: null,
  }),

  actions: {
    async loadSpecialties() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchSpecialties();
        this.specialties = data;
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async createSpecialty(specialtyData) {
      const { error } = await createSpecialtyService(specialtyData);
      if (!error) await this.loadSpecialties();
      return error;
    },

    async editSpecialty(id, updatedData) {
      const { error } = await updateSpecialtyService(id, updatedData);
      if (!error) await this.loadSpecialties();
      return error;
    },

    async removeSpecialty(id) {
      const { error } = await deleteSpecialtyService(id);
      if (!error) {
        this.specialties = this.specialties.filter((s) => s.id !== id);
      }
      return error;
    },
  },
});
