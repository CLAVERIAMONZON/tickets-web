const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyaJ-whtPA3Y7-kljPH8TG-5QKcPS5LEwaY44zWuH8oj7yWFE0A6DKtCBN0YdYE9D0rNg/exec';

const BOT_WEBHOOK_URL = 'https://presuming-feminist-blouse.ngrok-free.dev/notificar-ticket';

export async function POST(request) {

  const body = await request.json();

  const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();

  const googleData = JSON.parse(text);

  // AVISAR AL BOT WHATSAPP
  if (googleData.success) {

    await fetch(BOT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: body.id,
        estado: googleData.estado,
        CLIENTE: body.CLIENTE,
        EQUIPO: body.EQUIPO,
        OBRA: body.OBRA,
        NUMERO_MAQUINA: body.NUMERO_MAQUINA,
        HORAS_MAQUINA: body.HORAS_MAQUINA
      })
    });

  }

  return Response.json(googleData);

}