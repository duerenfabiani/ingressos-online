import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CriarEvento() {
  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      lotes: [{ nome: '', valor: '', quantidade_total: '', data_inicio: '', data_fim: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lotes"
  });

  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:4000/api/eventos/criar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const resultado = await response.json();
    alert(resultado.sucesso || resultado.erro);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Criar Evento</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('nome')} placeholder="Nome do evento" required />
        <textarea {...register('descricao')} placeholder="Descrição" />
        <input {...register('banner_url')} placeholder="URL do banner" />

        <label>Data de início</label>
        <input type="datetime-local" {...register('data_inicio')} required />
        <label>Data de fim</label>
        <input type="datetime-local" {...register('data_fim')} required />

        <h3>Lotes</h3>
        {fields.map((item, index) => (
          <div key={item.id} style={{ marginBottom: 16, padding: 10, border: '1px solid #ccc' }}>
            <input {...register(`lotes.${index}.nome`)} placeholder="Nome do lote" />
            <input type="number" step="0.01" {...register(`lotes.${index}.valor`)} placeholder="Valor R$" />
            <input type="number" {...register(`lotes.${index}.quantidade_total`)} placeholder="Quantidade" />
            <input type="datetime-local" {...register(`lotes.${index}.data_inicio`)} />
            <input type="datetime-local" {...register(`lotes.${index}.data_fim`)} />
            <button type="button" onClick={() => remove(index)}>Remover</button>
          </div>
        ))}
        <button type="button" onClick={() => append({})}>+ Adicionar lote</button>

        <br /><br />
        <button type="submit">Salvar evento</button>
      </form>
    </div>
  );
}
