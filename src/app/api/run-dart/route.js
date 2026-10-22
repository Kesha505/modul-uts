/**
 * API route: proxy ke DartPad compile API
 * Menghindari CORS error saat client langsung memanggil dart-services
 */
export async function POST(request) {
  const { code } = await request.json();

  if (!code?.trim()) {
    return Response.json({ error: 'Kode kosong' }, { status: 400 });
  }

  try {
    const res = await fetch(
      'https://dart-services.appspot.com/api/dartservices/v3/compile',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: code }),
        signal: AbortSignal.timeout(15000),
      }
    );

    const data = await res.json();

    // DartPad returns { result: "compiled js..." } or { error: "..." }
    if (data.error) {
      return Response.json({ error: data.error });
    }

    return Response.json({ compiledJs: data.result });
  } catch (err) {
    if (err.name === 'TimeoutError' || err.name === 'AbortError') {
      return Response.json(
        { error: 'Timeout: kompilasi terlalu lama (>15 detik)' },
        { status: 504 }
      );
    }
    return Response.json({ error: err.message }, { status: 500 });
  }
}
