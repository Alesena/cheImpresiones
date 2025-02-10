'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface CustomDollFormData {
  name: string;
  photo: string;
  dedication: string;
  accessories: string;
}

export default function CustomDollForm() {
  const [form, setForm] = useState<CustomDollFormData>({
    name: '',
    photo: '',
    dedication: '',
    accessories: '',
  });

  const [status, setStatus] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/dolls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('Pedido enviado correctamente');
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('Hubo un error al enviar el pedido');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Nombre:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </label>
        
        <label className="flex flex-col">
          Foto (URL):
          <input
            type="text"
            name="photo"
            value={form.photo}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </label>

        <label className="flex flex-col">
          Dedicatoria:
          <textarea
            name="dedication"
            value={form.dedication}
            onChange={handleChange}
            className="border px-2 py-1"
          />
        </label>

        <label className="flex flex-col">
          Accesorios:
          <input
            type="text"
            name="accessories"
            value={form.accessories}
            onChange={handleChange}
            className="border px-2 py-1"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Enviar Pedido
        </button>
      </form>

      {status && (
        <p className="mt-4 text-center font-semibold">
          {status}
        </p>
      )}
    </>
  );
}
