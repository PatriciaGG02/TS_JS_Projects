import { defineStore } from 'pinia'
import {
  fetchHeadquarters,
  createHeadquarters as createHeadquartersService,
  updateHeadquarters as updateHeadquartersService,
  deleteHeadquarters as deleteHeadquartersService
} from '@/services/HeadquartersService'

/**
 * @typedef {Object} Headquarters
 * @property {string} id
 * @property {string} name
 * @property {string} city
 * @property {string} address
 * @property {string} phone
 */

export const useHeadquartersStore = defineStore('headquarters', {
  state: () => ({
    /** @type {Headquarters[]} */
    headquarters: [],
    loading: false,
    /** @type {Error|null} */
    error: null
  }),

  actions: {
    async loadHeadquarters() {
      this.loading = true
      this.error = null
      try {
        const data = await fetchHeadquarters()
        this.headquarters = data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async createHeadquarters(hqData) {
      const { error } = await createHeadquartersService(hqData)
      if (!error) await this.loadHeadquarters()
      return {error}
    },

    async editHeadquarters(id, updatedData) {
      const { error } = await updateHeadquartersService(id, updatedData)
      if (!error) await this.loadHeadquarters()
      return {error}
    },

    async removeHeadquarters(id) {
      const { error } = await deleteHeadquartersService(id)
      if (!error) {
        this.headquarters = this.headquarters.filter(hq => hq.id !== id)
      }
      console.log('removeHeadquarters', error)
      return {error}
    }
  }
})
