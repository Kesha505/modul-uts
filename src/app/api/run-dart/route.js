/**
 * API route: proxy ke DartPad compile API
 * Menghindari CORS error saat client langsung memanggil dart-services
 */
export async function POST(request) {
  // Selalu kembalikan JSON, tidak pernah HTML
  const headers = { 'Content-Type': 'application/json' };

  let code;
  try {
    const body = await request.json();
    code = body?.code;
  } catch {
    return new Response(JSON.stringify({ error: 'Request body tidak valid' }), { status: 400, headers });
  }

  if (!code?.trim()) {
    return new Response(JSON.stringify({ error: 'Kode kosong' }), { status: 400, headers });
  }

  // Manual AbortController (lebih kompatibel dari AbortSignal.timeout)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 14000);

  try {
    const res = await fetch(
      'https://dart-services.appspot.com/api/dartservices/v3/compile',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: code }),
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    // Baca sebagai text dulu agar tidak crash jika bukan JSON
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(
        JSON.stringify({ error: 'DartPad mengembalikan respons tidak valid: ' + text.slice(0, 200) }),
        { status: 502, headers }
      );
    }

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), { status: 200, headers });
    }

    return new Response(JSON.stringify({ compiledJs: data.result }), { status: 200, headers });

  } catch (err) {
    clearTimeout(timer);
    const msg = err.name === 'AbortError'
      ? 'Timeout: kompilasi membutuhkan terlalu lama'
      : 'Gagal menghubungi DartPad: ' + err.message;
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers });
  }
}
