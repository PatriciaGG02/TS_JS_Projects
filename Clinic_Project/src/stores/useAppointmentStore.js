import { defineStore } from "pinia";
import {
  fetchAppointments,
  createAppointment as createAppointmentService,
  updateAppointment as updateAppointmentService,
  deleteAppointment as deleteAppointmentService,
  fetchClientsByHeadquarters,
  fetchPetsByClient,
} from "@/services/AppointmentService";
import { fetchSpecialties } from "@/services/SpecialtyService";

/**
 * @typedef {Object} AppointmentMapped
 * @property {string} id
 * @property {string} date
 * @property {string} time
 * @property {string} reason
 * @property {string} status
 * @property {string} note
 * @property {string} pet_name
 * @property {string} specialty_name
 * @property {string} client_name
 * @property {string} employee_name
 * @property {string} headquarters_name
 */
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(" ");
}

export const useAppointmentStore = defineStore("appointment", {
  state: () => ({
    /** @type {AppointmentMapped[]} */
    appointments: [],
    formData: {
      clients: [],
      specialties: [],
      clientPets: [],
    },
  }),

  actions: {
    async loadAppointments() {
      const data = await fetchAppointments();
      this.appointments = data.map((appointment) => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time
          ? appointment.time.split("+")[0].slice(0, 5)
          : "", //De esta forma se obtiene la hora sin la zona horaria
        reason: capitalize(appointment.reason),
        status: capitalize(appointment.status),
        note: capitalize(appointment.note),
        pet_name: capitalize(appointment.pets?.name || "Sin mascota"),
        specialty_name: capitalize(
          appointment.specialties?.name || "Sin especialidad"
        ),
        client_name: appointment.client
          ? capitalizeWords(
              [
                appointment.client.name,
                appointment.client.first_surname,
                appointment.client.second_surname,
              ]
                .filter(Boolean)
                .join(" ")
            )
          : "Sin cliente",
        id_pets: appointment.pets?.id || null,
        id_specialties: appointment.specialties.id,
        id_client: appointment.client.id,
        id_employee: appointment.employee.id,
        id_headquarters: appointment.headquarters.id,
        que: appointment,
        employee_name: capitalize(appointment.employee?.name || "Sin empleado"),
        headquarters_name: capitalize(
          appointment.headquarters?.name || "Sin sede"
        ),
      }));
    },

    async createAppointment(appointmentData) {
      const { error } = await createAppointmentService(appointmentData);
      if (!error) await this.loadAppointments();
      return { error };
    },

    async editAppointment(id, updatedData) {
      const { error } = await updateAppointmentService(id, updatedData);
      if (!error) await this.loadAppointments();
      return { error };
    },

    async removeAppointment(id) {
      const { error } = await deleteAppointmentService(id);
      if (!error) {
        this.appointments = this.appointments.filter((a) => a.id !== id);
      }
      return error;
    },

    async getFormData(id_headquarters) {
      const clients = await fetchClientsByHeadquarters(id_headquarters);
      if (clients) {
        const options = clients.map((item) => ({
          label: item.DNI,
          value: item.id,
          extra: `${item.name} ${item.first_surname} ${
            item.second_surname || ""
          }`,
        }));
        this.formData.clients = options;
      }

      const specialties = await fetchSpecialties();
      if (specialties) {
        const options = specialties.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        this.formData.specialties = options;
      }
    },

    async getPetsByClient(id_client) {
      const pets = await fetchPetsByClient(id_client);
      if (pets) {
        const options = pets.map((item) => ({
          label: item.name,
          value: item.id,
          extra: item.chip_number,
        }));
        console.log(options);
        this.formData.clientPets = options;
      }
    },

    async clearPets() {
      this.formData.clientPets = [];
    },
  },
});
