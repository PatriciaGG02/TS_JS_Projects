/// <reference types="https://deno.land/std@0.192.0/http/server.ts" />
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req) => {
  // Manejo de preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const body = await req.json();
    const { email, name, first_surname, second_surname, rol, id_headquarters } = body;

    // Obtener variables de entorno de forma segura
    const SUPABASE_URL = Deno.env.get("PROJECT_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY");

    // Verificar si las variables de entorno están accesibles
    console.log("SUPABASE_URL:", SUPABASE_URL);
    console.log("SERVICE_ROLE_KEY:", SUPABASE_SERVICE_ROLE_KEY ? "✅ Clave encontrada" : "❌ Clave no encontrada");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Faltan variables de entorno.");
      return new Response(JSON.stringify({ error: "Faltan variables de entorno." }), {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      });
    }

    const password = "zapato";

    // 1. Crear usuario en auth.users
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: false,
        user_metadata: { name, first_surname, second_surname, rol, id_headquarters },
      }),
    });

    const authData = await authRes.json();

    console.log("Respuesta de Supabase Auth:", authRes.status, authData);

    if (!authRes.ok) {
      console.error("Error en la creación de usuario:", authData);
      return new Response(JSON.stringify({ error: authData }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      });
    }

    const user_id = authData.user?.id;

    if (!user_id) {
      console.error("No se pudo obtener el user_id.");
      return new Response(JSON.stringify({ error: "Error al obtener user_id." }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      });
    }

    // 2. Insertar en la tabla "users"
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        id: user_id,
        name,
        first_surname,
        second_surname,
        rol,
        email,
        id_headquarters,
        date: new Date().toISOString(),
      }),
    });

    const insertData = await insertRes.json();

    console.log("Respuesta de Supabase DB:", insertRes.status, insertData);

    if (!insertRes.ok) {
      console.error("Error al insertar usuario en la tabla:", insertData);
      return new Response(JSON.stringify({ error: insertData }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, user_id }), {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error inesperado en la función:", error);
    return new Response(JSON.stringify({ error: "Error interno en el servidor." }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    });
  }
});
