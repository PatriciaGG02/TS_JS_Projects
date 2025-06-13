import { supabase } from "./DatabaseConnection";

/**
 * @typedef {Object} AppointmentDB
 * @property {string} id
 * @property {string} date
 * @property {string} time
 * @property {string} reason
 * @property {string} status
 * @property {string} note
 * @property {{ name: string } | null} pets
 * @property {{ name: string } | null} specialties
 * @property {{ name: string, first_surname: string, second_surname: string } | null} client
 * @property {{ name: string } | null} employee
 * @property {{ name: string } | null} headquarters
 */

/**
 * @typedef {Object} AppointmentInput
 * @property {string} date
 * @property {string} time
 * @property {string} reason
 * @property {string} status
 * @property {string} note
 * @property {string} pet_id
 * @property {string} specialty_id
 * @property {string} client_id
 * @property {string} employee_id
 * @property {string} headquarters_id
 */

/**
 * @returns {Promise<AppointmentDB[]>}
 */
export async function fetchAppointments() {
  const { data, error } = await supabase.from("appointment").select(`
    id,
    date,
    time,
    reason,
    status,
    note,
    pets ( id, name ),
    specialties (id, name ),
    client ( id, name, first_surname, second_surname ),
    employee:users ( id, name ),
    headquarters ( id, name )
  `);

  if (error) throw error;
  return data;
}

export async function fetchClientsByHeadquarters(id_headquarters) {
  const { data, error } = await supabase
    .from("client")
    .select("id, name, first_surname, second_surname, DNI")
    .eq("id_headquarters", id_headquarters);
  if (error) throw error;

  return data;
}

export async function fetchPetsByClient(id_client) {
  const { data, error } = await supabase
    .from("pets")
    .select("id, name, chip_number")
    .eq("id_client", id_client);

  if (error) throw error;
  return data;
}

export async function fetchSpecialties() {
  const { data, error } = await supabase.from("specialties").select("id, name");

  if (error) throw error;
  return data;
}

/**
 * @param {AppointmentInput} appointmentData
 * @returns {Promise<{ error: any }>}
 */
export async function createAppointment(appointmentData) {
  const { error } = await supabase
    .from("appointment")
    .insert([appointmentData]);
  if (error) throw error;
  return { error };
}

/**
 * @param {string} id
 * @param {Partial<AppointmentInput>} appointmentData
 * @returns {Promise<{ error: any }>}
 */
export async function updateAppointment(id, appointmentData) {
  const { error } = await supabase
    .from("appointment")
    .update(appointmentData)
    .eq("id", id);

  return { error };
}

/**
 * @param {string} id
 * @returns {Promise<{ error: any }>}
 */
export async function deleteAppointment(id) {
  const { error } = await supabase.from("appointment").delete().eq("id", id);
  return { error };
}
