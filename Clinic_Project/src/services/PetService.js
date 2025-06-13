import { supabase } from "./DatabaseConnection";

/**
 * @typedef {Object} Client
 * @property {string} name
 */

/**
 * @typedef {Object} Headquarters
 * @property {string} name
 */

/**
 * @typedef {Object} Pet
 * @property {string} id
 * @property {string} name
 * @property {string} kind
 * @property {string} birthdate
 * @property {number} chip_number
 * @property {string} observations
 * @property {string} breed
 * @property {Client|null} id_client
 * @property {Headquarters|null} headquarters
 */

/**
 * @typedef {Object} PetInput
 * @property {string} name
 * @property {string} kind
 * @property {string} birthdate
 * @property {number} chip_number
 * @property {string} observations
 * @property {string} breed
 * @property {string} id_client // Cambiar client_id a id_client
 * @property {string} headquarters_id
 */

/**
 * @param {string} [headquartersId] - Opcional ID de la sede para filtrar las mascotas.
 * @returns {Promise<Pet[]>}
 */
export async function fetchPets(headquartersId) {
  const selectFields = [
    'id',
    'name',
    'kind',
    'birthdate',
    'chip_number',
    'observations',
    'breed',
    'client ( id, DNI )',
    'id_headquarters',
    'headquarters ( name )'
  ];

  let query = supabase
    .from("pets")
    .select(selectFields.join(', '))
    .order('name', { ascending: true });

  console.log("Headquarters ID:", headquartersId); // Agrega este console.log

  if (headquartersId) {
    query = query.eq("id_headquarters", headquartersId);
  }

  const { data, error } = await query;

  console.log("Supabase query:", query); // Agrega este console.log

  if (error) throw error;

  return data;
}

/**
 * @param {PetInput} petData
 * @returns {Promise<{ error: any }>}
 */
export async function createPet(petData) {
  const { error } = await supabase.from("pets").insert([petData]);
  return { error };
}

/**
 * @param {string} id
 * @param {Partial<PetInput>} petData
 * @returns {Promise<{ error: any }>}
 */
export async function updatePet(id, petData) {
  const { error } = await supabase.from("pets").update(petData).eq("id", id);
  return { error };
}

/**
 * @param {string} id
 * @returns {Promise<{ error: any }>}
 */
export async function deletePet(id) {
  const { error } = await supabase.from("pets").delete().eq("id", id);
  return { error };
}