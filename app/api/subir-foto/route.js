const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyaJ-whtPA3Y7-kljPH8TG-5QKcPS5LEwaY44zWuH8oj7yWFE0A6DKtCBN0YdYE9D0rNg/exec';

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    const data = JSON.parse(text);

    return Response.json(data);

  } catch (error) {
    return Response.json({
      success: false,
      error: 'Error en /api/subir-foto',
      detalle: error.message
    }, { status: 500 });
  }
}