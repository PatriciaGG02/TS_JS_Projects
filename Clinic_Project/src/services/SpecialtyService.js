import { supabase } from "./DatabaseConnection";

/**
 * @typedef {Object} Specialty
 * @property {string} id
 * @property {string} name
 * @property {boolean} active
 */

/**
 * @typedef {Object} SpecialtyInput
 * @property {string} name
 * @property {boolean} active
 */

/**
 * @returns {Promise<Specialty[]>}
 */
export async function fetchSpecialties() {
  const { data, error } = await supabase
    .from("specialties")
    .select("id, name, active")
    .eq("active", true);

  if (error) throw error;
  return data;
}

/**
 * @param {SpecialtyInput} specialtyData
 * @returns {Promise<{ error: any }>}
 */
export async function createSpecialty(specialtyData) {
  const { error } = await supabase.from("specialties").insert([specialtyData]);
  return { error };
}

/**
 * @param {string} id
 * @param {Partial<SpecialtyInput>} specialtyData
 * @returns {Promise<{ error: any }>}
 */
export async function updateSpecialty(id, specialtyData) {
  const { error } = await supabase
    .from("specialties")
    .update(specialtyData)
    .eq("id", id);
  return { error };
}

/**
 * @param {string} id
 * @returns {Promise<{ error: any }>}
 */
export async function deleteSpecialty(id) {
  const { error } = await supabase.from("specialties").delete().eq("id", id);
  return { error };
}
