import { defineStore } from "pinia";
import {
  fetchUsers,
  createUser as createUserService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from "@/services/UserService";

/**
 * @typedef {Object} UserMapped
 * @property {string} id
 * @property {string} full_name
 * @property {string} email
 * @property {string} rol
 * @property {string} date
 * @property {string} headquarters_name
 */

export const useUserStore = defineStore("user", {
  state: () => ({
    /** @type {UserMapped[]} */
    users: [],
    loading: false,
    /** @type {Error|null} */
    error: null,
  }),

  actions: {
    async loadUsers() {
      this.loading = true;
      this.error = null;
      try {
        const data = await fetchUsers();
        this.users = data.map((user) => ({
          id: user.id,
          name: user.name,
          first_surname: user.first_surname,
          second_surname: user.second_surname,
          full_name: `${user.name} ${user.first_surname} ${
            user.second_surname || ""
          }`.trim(),
          email: user.email,
          rol: user.rol,
          date: user.date,
          headquarters_name: user.headquarters?.name || "Sin sede",
          headquarters_id: user.headquarters?.id || null,
        }));
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }

    },

    async createUser(userData) {
      const { error } = await createUserService(userData);
      if (!error) await this.loadUsers();
      return {error};
    },

    async editUser(id, updatedData) {
      try{
      const response = await updateUserService(id, updatedData);
      await this.loadUsers();
      return {data: response}
    }catch (error) {
      return {error}
    }
      
    },

    async removeUser(id) {
      const { error } = await deleteUserService(id);
      if (!error) {
        this.users = this.users.filter((u) => u.id !== id);
      }
      return error;
    },
  },
});
