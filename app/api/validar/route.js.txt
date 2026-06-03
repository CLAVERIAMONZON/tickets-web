const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyaJ-whtPA3Y7-kljPH8TG-5QKcPS5LEwaY44zWuH8oj7yWFE0A6DKtCBN0YdYE9D0rNg/exec';

const BOT_WEBHOOK_URL = 'https://presuming-feminist-blouse.ngrok-free.dev/notificar-ticket';

export async function POST(request) {
  try {
    const body = await request.json();

    console.log('RECIBIDO EN /api/validar');
    console.log('ID:', body.id);
    console.log('Fotos:', body.FOTOS_SALIDA ? body.FOTOS_SALIDA.length : 0);
    console.log('FOTOS ES ARRAY:', Array.isArray(body.FOTOS_SALIDA));
    console.log('PRIMERA FOTO:', body.FOTOS_SALIDA?.[0]?.nombre);
    console.log('TIPO PRIMERA FOTO:', body.FOTOS_SALIDA?.[0]?.tipo);
    console.log('TAMAÑO BASE64 PRIMERA FOTO:', body.FOTOS_SALIDA?.[0]?.contenido?.length);

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();

    console.log('RESPUESTA APPS SCRIPT:', text);

    let googleData;

    try {
      googleData = JSON.parse(text);
    } catch (error) {
      return Response.json({
        success: false,
        error: 'Apps Script no devolvió JSON',
        detalle: text
      }, { status: 500 });
    }

    if (googleData.success) {
      try {
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

  		FECHA_DE_ALQUILER: body.FECHA_DE_ALQUILER,

  		NUMERO_MAQUINA: body.NUMERO_MAQUINA,
  		HORAS_MAQUINA: body.HORAS_MAQUINA,

  		tipoAviso: googleData.tipoAviso,

  		fechaAnterior: googleData.fechaAnterior,
  		fechaNueva: googleData.fechaNueva,

  		maquinaAnterior: googleData.maquinaAnterior,
  		maquinaNueva: googleData.maquinaNueva
		})
        });
      } catch (error) {
        console.log('No se pudo avisar al bot:', error);
      }
    }

    return Response.json(googleData);

  } catch (error) {
    console.log('ERROR EN /api/validar:', error);

    return Response.json({
      success: false,
      error: 'Error interno en /api/validar',
      detalle: error.message
    }, { status: 500 });
  }
}