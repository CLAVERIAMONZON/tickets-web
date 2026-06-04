'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

function formatearFecha(valor) {
  if (!valor) return '';

  const fecha = new Date(valor);

  if (isNaN(fecha.getTime())) {
    return valor;
  }

  return fecha.toLocaleDateString('es-ES');
}

function barraEstado(estado) {
  if (estado === 'PRE-TICKET') return '⬜⬜⬜⬜';
  if (estado === 'PENDIENTE_ASIGNAR_MAQUINA') return '🟥🟥⬜⬜';
  if (estado === 'MAQUINA_ASIGNADA') return '🟨🟨🟨⬜';
  if (estado === 'CARGADO') return '🟩🟩🟩🟩';
  return '⬜⬜⬜⬜';
}

function tituloTicket(ticket) {
  if (ticket.ESTADO === 'PRE-TICKET') {
    return `PRE-TICKET · ${ticket.ID}`;
  }

  return `${ticket.ID.replace('PT-', 'TC-')}`;
}

export default function PreTicketPage() {
  const params = useParams();
  const id = params.id;

  const [ticket, setTicket] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [fechaAlquiler, setFechaAlquiler] = useState('');
  const [cliente, setCliente] = useState('');
  const [equipo, setEquipo] = useState('');
  const [obra, setObra] = useState('');
  const [personaContacto, setPersonaContacto] = useState('');
  const [telefonoContacto, setTelefonoContacto] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const [numeroMaquina, setNumeroMaquina] = useState('');
  const [horasMaquina, setHorasMaquina] = useState('');
  const [funcionamientoComprobado, setFuncionamientoComprobado] = useState(false);
  const [observacionesAlquiler, setObservacionesAlquiler] = useState('');
  const [fotosSalida, setFotosSalida] = useState([]);
  const [modificarSalida, setModificarSalida] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function cargarTicket() {
      const response = await fetch(`/api/ticket/${id}`);
      const data = await response.json();

      if (data.success) {
        const t = data.ticket;
        setTicket(t);

        setFechaAlquiler(formatearFecha(t.FECHA_DE_ALQUILER) || '');
        setCliente(t.CLIENTE || '');
        setEquipo(t.EQUIPO || '');
        setObra(t.OBRA || '');
        setPersonaContacto(t.PERSONA_DE_CONTACTO || '');
        setTelefonoContacto(t.TELEFONO_DE_CONTACTO || '');
        setObservaciones(t.OBSERVACIONES || '');

        setNumeroMaquina(t.NUMERO_MAQUINA || '');
        setHorasMaquina(t.HORAS_MAQUINA || '');
        setFuncionamientoComprobado(t.FUNCIONAMIENTO_COMPROBADO === 'SI');
        setObservacionesAlquiler(t.OBSERVACIONES_ALQUILER || '');
      }

      setCargando(false);
    }

    cargarTicket();
  }, [id]);

  async function actualizarTicket() {
    setGuardando(true);
    setMensaje('');

    try {
          let fotosBase64 = [];

    if (ticket.ESTADO === 'MAQUINA_ASIGNADA') {
      fotosBase64 = await Promise.all(
        fotosSalida.map((foto) => {
          return new Promise((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
              resolve({
                nombre: foto.name,
                tipo: foto.type,
                contenido: reader.result.split(',')[1]
              });
            };

            reader.readAsDataURL(foto);
          });
        })
      );
    }
      const response = await fetch('/api/validar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accion: 'validar_ticket',
          id,
	  MODIFICAR_SALIDA: modificarSalida,
          FECHA_DE_ALQUILER: fechaAlquiler,
          CLIENTE: cliente,
          EQUIPO: equipo,
          OBRA: obra,
          PERSONA_DE_CONTACTO: personaContacto,
          TELEFONO_DE_CONTACTO: telefonoContacto,
          OBSERVACIONES: observaciones,
          NUMERO_MAQUINA: numeroMaquina,
          HORAS_MAQUINA: horasMaquina,
          FUNCIONAMIENTO_COMPROBADO: funcionamientoComprobado,
          OBSERVACIONES_ALQUILER: observacionesAlquiler,
          FOTOS_SALIDA: fotosBase64
        })
      });

      const data = await response.json();


if (!response.ok) {
  setMensaje('Error API: ' + (data.error || data.detalle || response.status));
  setGuardando(false);
  return;
}

if (data.success) {
  setMensaje('Ticket actualizado correctamente');
} else {
  setMensaje('Error: ' + (data.detalle || data.error || 'No identificado'));
}
    } catch (err) {
      console.log(err);
      setMensaje('Error de conexión: ' + err.message);
    }

    setGuardando(false);
  }

async function cancelarCarga() {
  setGuardando(true);
  setMensaje('');

  try {
    const response = await fetch('/api/validar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accion: 'cancelar_ticket',
        id,
        FECHA_DE_ALQUILER: fechaAlquiler,
        CLIENTE: cliente,
        EQUIPO: equipo,
        OBRA: obra,
        PERSONA_DE_CONTACTO: personaContacto,
        TELEFONO_DE_CONTACTO: telefonoContacto
      })
    });

    const data = await response.json();

    if (data.success) {
      setMensaje('Carga cancelada correctamente');
    } else {
      setMensaje(data.error || 'Error al cancelar');
    }

  } catch (err) {
    setMensaje('Error de conexión');
  }

  setGuardando(false);
}





  if (cargando) {
    return (
      <main className="min-h-screen bg-[#f4f4f4] p-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
          Cargando ticket...
        </div>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="min-h-screen bg-[#f4f4f4] p-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
          Ticket no encontrado
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f4f4] p-4">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

        <div className="bg-[#ffd100] px-6 py-5 text-black">
          <h1 className="text-3xl font-black tracking-tight">
            {tituloTicket(ticket)}
          </h1>

          <p className="mt-1 text-sm opacity-70">
            Salida de maquinaria Monzón
          </p>
        </div>
        <div className="border-b bg-white px-6 py-4 text-3xl tracking-[0.35em]">
          {barraEstado(ticket.ESTADO)}
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div className="space-y-4">
           <div>
  	<label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">
    	Fecha alquiler
  	</label>
  	<input
    	value={fechaAlquiler}
    	onChange={(e) => setFechaAlquiler(e.target.value)}
    	className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg font-semibold text-gray-900 outline-none transition focus:border-yellow-500"
    	placeholder="Ej: 05/06/2026"
  	/>
	</div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">
		Cliente
              </label>
              <input
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg font-semibold text-gray-900 outline-none transition focus:border-yellow-500"
                placeholder="Cliente"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">
                Equipo
              </label>
              <input
                value={equipo}
                onChange={(e) => setEquipo(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg font-semibold text-gray-900 outline-none transition focus:border-yellow-500"
                placeholder="Equipo"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">
                Obra
              </label>
              <input
                value={obra}
                onChange={(e) => setObra(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg font-semibold text-gray-900 outline-none transition focus:border-yellow-500"
                placeholder="Obra"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">
                Persona de contacto
              </label>
              <input
                value={personaContacto}
                onChange={(e) => setPersonaContacto(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg font-semibold text-gray-900 outline-none transition focus:border-yellow-500"
                placeholder="Persona de contacto"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">
                Teléfono de contacto
              </label>
              <input
                value={telefonoContacto}
                onChange={(e) => setTelefonoContacto(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-lg font-semibold text-gray-900 outline-none transition focus:border-yellow-500"
                placeholder="Teléfono"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-gray-400">
                Observaciones
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-800 outline-none transition focus:border-yellow-500"
                placeholder="Observaciones del ticket"
              />
            </div>

          </div>

          {ticket.ESTADO !== 'PRE-TICKET' && (
  		<div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-xl font-bold text-gray-900">
              Validación operativa
            </h2>

            <div className="mt-5 space-y-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Número de máquina
                </label>
                <input
                  value={numeroMaquina}
                  onChange={(e) => setNumeroMaquina(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-yellow-500"
                  placeholder="Ej: 2451"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Horas del equipo
                </label>
                <input
                  value={horasMaquina}
                  onChange={(e) => setHorasMaquina(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-yellow-500"
                  placeholder="Ej: 3245"
                />
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white p-3 text-sm font-bold text-gray-700">
                <input
                  type="checkbox"
                  checked={funcionamientoComprobado}
                  onChange={(e) => setFuncionamientoComprobado(e.target.checked)}
                  className="h-5 w-5"
                />
                Funcionamiento básico comprobado
              </label>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Observaciones alquiler
                </label>
                <textarea
                  value={observacionesAlquiler}
                  onChange={(e) => setObservacionesAlquiler(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none transition focus:border-yellow-500"
                  placeholder="Observaciones para el albarán o entrega"
                />
              </div>

              {ticket.ESTADO === 'MAQUINA_ASIGNADA' && (
  <div className="rounded-2xl border border-gray-300 bg-white p-4">
    <h3 className="mb-3 text-lg font-black text-gray-900">
      Fotografías de salida
    </h3>


    <input
      type="file"
      accept="image/*"
      capture="environment"
      multiple


      onChange={(e) => {
        const nuevasFotos = Array.from(e.target.files);
        setFotosSalida((actuales) => [...actuales, ...nuevasFotos]);
      }}
      className="w-full rounded-xl border border-gray-300 bg-white p-3"
    />
    {fotosSalida.length > 0 && (
      <p className="mt-2 text-sm font-bold text-green-700">
        {fotosSalida.length} foto(s) seleccionada(s)
      </p>
    )}
    <p className="mt-2 text-sm text-gray-500">
      Haz las fotos de la máquina antes de confirmar la salida.
    </p>
  </div>
)}

              {mensaje && (
                <p className="text-center text-sm font-bold text-green-700">
                  {mensaje}
                </p>
              )}

            </div>
	</div>
	)}
	</div>
<label className="mt-4 flex items-center gap-3 rounded-xl border border-gray-300 bg-gray-50 p-3 text-sm font-bold text-gray-700">
  <input
    type="checkbox"
    checked={modificarSalida}
    onChange={(e) => setModificarSalida(e.target.checked)}
    className="h-5 w-5"
  />
  Modificar salida
</label>        
<button
  onClick={actualizarTicket}
  className="w-full rounded-xl bg-[#ffd100] py-3 text-xl font-black tracking-wide text-black transition hover:bg-yellow-400"
>
  {
    guardando
      ? 'GUARDANDO...'
      : ticket.ESTADO === 'PRE-TICKET'
        ? 'VALIDAR PRE-TICKET'
        : ticket.ESTADO === 'MAQUINA_ASIGNADA'
          ? 'CONFIRMAR SALIDA'
          : ticket.ESTADO === 'CARGADO'
            ? 'GENERAR ALBARÁN'
            : 'ACTUALIZAR TICKET'
  }
</button>

<button
  onClick={cancelarCarga}
  className="mt-3 w-full rounded-xl border border-red-300 bg-white py-3 text-lg font-black tracking-wide text-red-700 transition hover:bg-red-50"
>
  CANCELAR CARGA
</button>
        <div className="border-t bg-gray-50 p-6">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Mensaje original WhatsApp
          </div>

          <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700">
            {ticket.MENSAJE_ORIGINAL || 'Sin mensaje original guardado'}
          </div>
        </div>

      </div>
    </main>
  );
}
