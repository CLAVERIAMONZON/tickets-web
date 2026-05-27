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
  if (estado === 'CARGADO -> GENERAR ALBARAN') return '🟩🟩🟩🟩';
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
  const [observacionesIA, setObservacionesIA] = useState('');

  const [numeroMaquina, setNumeroMaquina] = useState('');
  const [horasMaquina, setHorasMaquina] = useState('');
  const [observacionesAlquiler, setObservacionesAlquiler] = useState('');

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
        setObservacionesIA(t.OBSERVACIONES || '');

        setNumeroMaquina(t.NUMERO_MAQUINA || '');
        setHorasMaquina(t.HORAS_MAQUINA || '');
        setObservacionesAlquiler(t.OBSERVACIONES_ALQUILER || '');
      }

      setCargando(false);
    }

    cargarTicket();
  }, [id]);

  async function validarTicket() {
    setGuardando(true);
    setMensaje('');

    try {
      const response = await fetch('/api/validar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accion: 'validar_ticket',
          id,
          FECHA_DE_ALQUILER: fechaAlquiler,
          CLIENTE: cliente,
          EQUIPO: equipo,
          OBRA: obra,
          PERSONA_DE_CONTACTO: personaContacto,
          TELEFONO_DE_CONTACTO: telefonoContacto,
          OBSERVACIONES: observacionesIA,
          NUMERO_MAQUINA: numeroMaquina,
          HORAS_MAQUINA: horasMaquina,
          OBSERVACIONES_ALQUILER: observacionesAlquiler
        })
      });

      const data = await response.json();

      if (data.success) {
        setMensaje('Ticket validado y guardado correctamente');
      } else {
        setMensaje('Error al guardar ticket');
      }
    } catch (err) {
      console.log(err);
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

        <div className="border-b bg-white px-6 py-4 text-3xl tracking-tight">
  		{barraEstado(ticket.ESTADO)}
	</div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div className="space-y-4">


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
                Observaciones IA
              </label>
              <textarea
                value={observacionesIA}
                onChange={(e) => setObservacionesIA(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-300 bg-yellow-50 p-3 text-gray-800 outline-none transition focus:border-yellow-500"
                placeholder="Observaciones detectadas por IA"
              />
            </div>
          </div>

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

              <button
                onClick={validarTicket}
                className="w-full rounded-xl bg-[#ffd100] py-3 text-xl font-black tracking-wide text-black transition hover:bg-yellow-400"
              >
                {guardando ? 'GUARDANDO...' : 'VALIDAR TICKET'}
              </button>

              {mensaje && (
                <p className="text-center text-sm font-bold text-green-700">
                  {mensaje}
                </p>
              )}
            </div>
          </div>
        </div>

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