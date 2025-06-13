import { supabase } from './DatabaseConnection'

/**
 * @typedef {Object} Headquarters
 * @property {string} id
 * @property {string} name
 * @property {string} city
 * @property {string} address
 * @property {string} phone
 */

/**
 * @typedef {Object} HeadquartersInput
 * @property {string} name
 * @property {string} city
 * @property {string} address
 * @property {string} phone
 */

/**
 * @returns {Promise<Headquarters[]>}
 */
export async function fetchHeadquarters() {
  const { data, error } = await supabase
    .from('headquarters')
    .select('id, name, city, address, phone')

  if (error) throw error
  return data
}

/**
 * @param {HeadquartersInput} headquartersData
 * @returns {Promise<{ error: any }>}
 */
export async function createHeadquarters(headquartersData) {
  const { error } = await supabase.from('headquarters').insert([headquartersData])
  return { error }
}

/**
 * @param {string} id
 * @param {Partial<HeadquartersInput>} headquartersData
 * @returns {Promise<{ error: any }>}
 */
export async function updateHeadquarters(id, headquartersData) {
  const { error } = await supabase
    .from('headquarters')
    .update(headquartersData)
    .eq('id', id)
  return { error }
}

/**
 * @param {string} id
 * @returns {Promise<{ error: any }>}
 */
export async function deleteHeadquarters(id) {
  const { error } = await supabase
    .from('headquarters')
    .delete()
    .eq('id', id)

    if(error){
      console.error('Error deleting headquarters:', error)
      return { error }
    }

    return { error: null, success: true, message: 'Headquarters deleted successfully'}
  
}
