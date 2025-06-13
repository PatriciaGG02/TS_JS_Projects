import { supabase } from "./DatabaseConnection";

/**
 * @typedef {Object} Headquarters
 * @property {string} name
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} first_surname
 * @property {string} second_surname
 * @property {string} email
 * @property {string} rol
 * @property {string} date
 * @property {string} id_headquarters
 * @property {Headquarters|null} headquarters
 */

/**
 * @typedef {Object} UserInput
 * @property {string} name
 * @property {string} first_surname
 * @property {string} second_surname
 * @property {string} email
 * @property {string} rol
 * @property {string} date
 * @property {string} id_headquarters
 */

/**
 * @returns {Promise<User[]>}
 */
export async function fetchUsers() {
  const { data, error } = await supabase.from("users").select(`
    id,
    name,
    first_surname,
    second_surname,
    email,
    rol,
    date,
    id_headquarters, 
    headquarters:headquarters (
      id, name
    )
  `);

  if (error) throw error;
  return data;
}

/**.
 * @param {UserInput} userData
 * @returns {Promise<{ error: any }>}
 */
export async function createUser(userData) {
  const currentSession = await supabase.auth.getSession();

  const { data, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: "zapato",
    options: {
      data: {
        name: userData.name,
        first_surname: userData.first_surname,
        second_surname: userData.second_surname,
        rol: userData.rol,
        id_headquarters: userData.id_headquarters,
      },
    },
  });

  if (authError) {
    return { error: authError };
  }

  if (!data?.user?.id) {
    return { error: "No se pudo obtener el user_id de Supabase Auth" };
  }

  const authUserId = data.user.id;

  await supabase.auth.setSession(currentSession.data.session);

  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("id", authUserId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    return { error: fetchError };
  }

  if (existingUser) {
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name: userData.name,
        first_surname: userData.first_surname,
        second_surname: userData.second_surname,
        rol: userData.rol,
        date: userData.date,
        id_headquarters: userData.id_headquarters,
      })
      .eq("id", authUserId);

    if (updateError) {
      return { error: updateError };
    }
  } else {
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: authUserId,
        name: userData.name,
        first_surname: userData.first_surname,
        second_surname: userData.second_surname,
        email: userData.email,
        rol: userData.rol,
        date: userData.date,
        id_headquarters: userData.id_headquarters,
      },
    ]);

    if (insertError) {
      return { error: insertError };
    }
  }

  return { error: null };
}

/**
 * @param {string} id
 * @param {Partial<UserInput>} updatedData
 * @returns {Promise<{ error: any }>}
 */
export async function updateUser(id, updatedData) {
  if (!id) return { error: "ID de usuario no válido" };

  const { error } = await supabase
    .from("users")
    .update(updatedData)
    .eq("id", id);


}
/**
 * @param {string} id
 * @returns {Promise<{ error: any }>}
 */
export async function deleteUser(id) {
  const { error } = await supabase.from("users").delete().eq("id", id);
  return { error };
}
