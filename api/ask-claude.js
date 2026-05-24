// Función serverless de Vercel — proxy seguro a la API de Anthropic.
// Lee la clave ANTHROPIC_API_KEY desde las variables de entorno del proyecto en Vercel.
// El frontend nunca ve la clave.

export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validar entrada
  const prompt = req && req.body && req.body.prompt;
  const maxTokens = (req && req.body && req.body.max_tokens) || 1024;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Falta el campo "prompt".' });
  }
  if (prompt.length > 50000) {
    return res.status(400).json({ error: 'El prompt es demasiado largo (>50k caracteres).' });
  }

  // Verificar que la clave esté configurada
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY no configurada en Vercel.' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: Math.min(Number(maxTokens) || 1024, 4096),
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!upstream.ok) {
      let detail = '';
      try { detail = await upstream.text(); } catch (_) {}
      return res.status(upstream.status).json({
        error: 'Anthropic devolvió ' + upstream.status,
        detail: detail.substring(0, 500)
      });
    }

    const data = await upstream.json();
    // Extraer texto del primer bloque de contenido
    let text = '';
    if (data && Array.isArray(data.content) && data.content.length > 0) {
      text = data.content.map(c => c && c.text ? c.text : '').join('');
    }
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: 'Error llamando a Anthropic: ' + (e && e.message ? e.message : 'desconocido') });
  }
}
