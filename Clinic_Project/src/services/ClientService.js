import { supabase } from "./DatabaseConnection";

/**
 * @typedef {Object} Client
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} Headquarters
 * @property {string} name
 */

/**
 * @typedef {Object} Client
 * @property {string} id
 * @property {string} name
 * @property {string} first_surname
 * @property {string} second_surname
 * @property {string} DNI
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {Headquarters|null} headquarters
 */

/**
 * @param {string} [headquartersId] - Opcional ID de la sede para filtrar los clientes.
 * @returns {Promise<Client[]>}
 */
export async function fetchClients(headquartersId) {
  let query = supabase
    .from("client") // Nombre correcto de la tabla
    .select(
      `
      id,
      name,
      first_surname,
      second_surname,
      DNI,
      email,
      phone,
      address,
      headquarters ( name )
    `
    )

  if (headquartersId) {
    query = query.eq("id_headquarters", headquartersId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * @param {Client} clientData
 * @returns {Promise<{ error: any }>}
 */
export async function createClient(clientData) {
  const { error } = await supabase.from("client").insert([clientData]); // Nombre correcto de la tabla
  return { error };
}

/**
 * @param {string} id
 * @param {Partial<Client>} clientData
 * @returns {Promise<{ error: any }>}
 */
export async function updateClient(id, clientData) {
  const { error } = await supabase.from("client").update(clientData).eq("id", id); // Nombre correcto de la tabla
  return { error };
}

/**
 * @param {string} id
 * @returns {Promise<{ error: any }>}
 */
export async function deleteClient(id) {
  const { error } = await supabase.from("client").delete().eq("id", id); // Nombre correcto de la tabla
  return { error };
}