// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { compact } from 'lodash';
import { serve } from 'server';
import { createClient } from 'supabase';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchText(url: URL | string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Response not OK (${response.status})`);
  return response.text();
}

serve(async req => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    );
    // Now we can get the session or user object
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    const {
      data: { publicUrl },
    } = supabaseClient.storage.from('uploads').getPublicUrl(`${user!.id}/onetab.json`);

    const content = await fetchText(publicUrl);

    const validated = content.split('\n');
    const compacted = compact(validated) as string[];

    const translated = compacted.map(b => {
      const splitted = b.split('|');
      const [url, ...rest] = splitted;

      const obj = {
        url: (url ?? '').trim(),
        name: compact(rest.map(e => (e ?? '').trim())).join(' | '),
      };

      return obj;
    });

    const { error: insertError } = await supabaseClient.from('bookmarks').insert(translated).select();
    if (insertError) throw insertError;

    const { error: removeError } = await supabaseClient.storage.from('uploads').remove([`${user!.id}/onetab.json`]);
    if (removeError) throw removeError;

    return new Response('ok', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
