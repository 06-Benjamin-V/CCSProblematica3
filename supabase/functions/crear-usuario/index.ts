// @ts-nocheck
// =============================================================================
// Edge Function: crear-usuario (Deno 2 / Supabase Edge Runtime)
// Resuelve la autenticación de profesores y estudiantes cuando el registro
// público está desactivado (enable_signup = false en config.toml).
// Requiere que el solicitante sea un encargado o administrador activo.
// =============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método no permitido. Use POST.' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Variables de entorno del servidor no configuradas.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Validar token de quien llama a la función
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Cabecera Authorization requerida.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const clientUser = createClient(supabaseUrl, anonKey || serviceRoleKey);
    const { data: authData, error: authError } = await clientUser.auth.getUser(token);

    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({ error: 'Sesión no válida o expirada.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Cliente administrativo con clave service_role
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 3. Verificar que quien llama sea un encargado o administrador activo
    const { data: solicitante, error: solicitanteError } = await adminClient
      .from('usuario')
      .select('rol, activo, escuela_id_escuela')
      .eq('id_auth', authData.user.id)
      .single();

    if (solicitanteError || !solicitante || !solicitante.activo) {
      return new Response(
        JSON.stringify({ error: 'Usuario solicitante no encontrado o inactivo.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (solicitante.rol !== 'encargado' && solicitante.rol !== 'administrador') {
      return new Response(
        JSON.stringify({ error: 'Solo encargados o administradores pueden registrar usuarios.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Procesar cuerpo de la petición
    const body = await req.json();
    const { email, password, nombre_completo, rol, escuela_id_escuela } = body;

    if (!email || !password || !nombre_completo || !rol || !escuela_id_escuela) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos: email, password, nombre_completo, rol, escuela_id_escuela.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Un encargado solo puede registrar usuarios para su propia escuela
    if (solicitante.rol === 'encargado' && solicitante.escuela_id_escuela !== Number(escuela_id_escuela)) {
      return new Response(
        JSON.stringify({ error: 'Solo puedes registrar usuarios para tu propia escuela.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Crear usuario en Supabase Auth
    const { data: newUserAuth, error: createAuthError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre_completo },
    });

    if (createAuthError || !newUserAuth.user) {
      return new Response(
        JSON.stringify({ error: createAuthError?.message || 'Error al crear usuario en Auth.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 6. Registrar en la tabla public.usuario
    const { data: newPerfil, error: insertError } = await adminClient
      .from('usuario')
      .insert({
        id_auth: newUserAuth.user.id,
        nombre_completo,
        rol,
        activo: true,
        escuela_id_escuela: Number(escuela_id_escuela),
      })
      .select('id_usuario, nombre_completo, rol, activo, escuela_id_escuela, fecha_creacion')
      .single();

    if (insertError) {
      await adminClient.auth.admin.deleteUser(newUserAuth.user.id);
      return new Response(
        JSON.stringify({ error: 'Error al crear el perfil escolar: ' + insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuario creado exitosamente.',
        user: {
          id_usuario: newPerfil.id_usuario,
          id_auth: newUserAuth.user.id,
          email: newUserAuth.user.email,
          nombre_completo: newPerfil.nombre_completo,
          rol: newPerfil.rol,
          escuela_id_escuela: newPerfil.escuela_id_escuela,
        },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno inesperado';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
