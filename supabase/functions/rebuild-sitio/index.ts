// @ts-nocheck
// =============================================================================
// Edge Function: rebuild-sitio (Deno 2 / Supabase Edge Runtime)
// Resuelve el mecanismo de publicación estática mencionado en architecture.md:
// "La salida actual es estática. Actualizar datos en Supabase no regenera las
// páginas automáticamente; el mecanismo de publicación se definirá..."
// Dispara el Deploy Hook de Vercel de forma segura sin exponer la URL secreta.
// =============================================================================

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
    const vercelDeployHookUrl = Deno.env.get('VERCEL_DEPLOY_HOOK_URL');

    if (!vercelDeployHookUrl) {
      return new Response(
        JSON.stringify({
          error: 'VERCEL_DEPLOY_HOOK_URL no está configurada en las variables de Supabase.',
          nota: 'Configure el Deploy Hook en el panel de Vercel y agréguelo a las variables de entorno de Supabase.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Opcional: verificar si la llamada proviene de un webhook de base de datos o de un usuario autenticado
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No autorizado: se requiere cabecera Authorization.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Llamada segura al webhook de Vercel para reconstruir el sitio estático
    const vercelResponse = await fetch(vercelDeployHookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivo: 'Nueva publicación en Trafkintu Kimün' }),
    });

    if (!vercelResponse.ok) {
      const errorText = await vercelResponse.text();
      return new Response(
        JSON.stringify({ error: 'Fallo al solicitar despliegue a Vercel.', detalle: errorText }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await vercelResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Reconstrucción del sitio en Vercel solicitada con éxito.',
        job: data?.job || null,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno inesperado';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
