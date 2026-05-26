'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function PreTicketPage() {

  const params = useParams();
  const id = params.id;

  // DATOS SIMULADOS TEMPORALES
  const ticket = {
    cliente: 'QUALITY CORN GRAIN',
    equipo: 'Cesta eléctrica 15m',
    obra: 'Ariestolas',
    observaciones: 'Lo antes posible. Que esté cargada a tope.',
    mensajeOriginal:
      '14/05/2026 QUALITY CORN GRAIN llevar lo antes posible cesta eléctrica de 15m a sus instalaciones en Ariestolas. Que esté cargada a tope. Cargamos en Monzon. Cristian 666 285 596'
  };

  // ESTADOS FORMULARIO
  const [numeroMaquina, setNumeroMaquina] = useState('');
  const [horasMaquina, setHorasMaquina] = useState('');
  const [observacionesAlquiler, setObservacionesAlquiler] = useState('');

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

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

  return (
    <main className="min-h-screen bg-[#f4f4f4] p-4">

      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

        {/* CABECERA */}
        <div className="bg-[#ffd100] px-6 py-5 text-black">

          <h1 className="text-3xl font-black tracking-tight">
            PRE-TICKET · TC-{id}
          </h1>

          <p className="mt-1 text-sm opacity-70">
            Salida de maquinaria Monzón
          </p>

        </div>

        {/* BARRA ESTADOS */}
        <div className="border-b bg-white px-6 py-4 text-3xl tracking-tight">
          ⬜⬜⬜⬜⬜
        </div>

        {/* DATOS */}
        <div className="grid gap-6 p-6 md:grid-cols-2">

          <div className="space-y-5">

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Cliente
              </div>

              <div className="mt-1 text-xl font-semibold text-gray-900">
                {ticket.cliente}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Equipo
              </div>

              <div className="mt-1 text-xl font-semibold text-gray-900">
                {ticket.equipo}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Obra
              </div>

              <div className="mt-1 text-xl font-semibold text-gray-900">
                {ticket.obra}
              </div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Observaciones IA
              </div>

              <div className="mt-1 rounded-xl bg-yellow-50 p-4 text-gray-800">
                {ticket.observaciones}
              </div>
            </div>

          </div>

          {/* FORMULARIO */}
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

        {/* MENSAJE ORIGINAL */}
        <div className="border-t bg-gray-50 p-6">

          <div className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Mensaje original WhatsApp
          </div>

          <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700">
            {ticket.mensajeOriginal}
          </div>

        </div>

      </div>

    </main>
  );
}