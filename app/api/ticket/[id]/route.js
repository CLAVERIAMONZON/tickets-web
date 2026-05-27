const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyaJ-whtPA3Y7-kljPH8TG-5QKcPS5LEwaY44zWuH8oj7yWFE0A6DKtCBN0YdYE9D0rNg/exec';

export async function GET(request, { params }) {
  const { id } = await params;

  const response = await fetch(`${GOOGLE_SCRIPT_URL}?id=${id}`);
  const data = await response.json();

await fetch('https://presuming-feminist-blouse.ngrok-free.dev/notificar-ticket', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    id,
    estado: data.estado,
    CLIENTE: body.CLIENTE,
    EQUIPO: body.EQUIPO,
    OBRA: body.OBRA,
    NUMERO_MAQUINA: body.NUMERO_MAQUINA,
    HORAS_MAQUINA: body.HORAS_MAQUINA
  })
});

  return Response.json(data);
}