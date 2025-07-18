// src/pages/eventos/editarevento/painel/CustomizarEvento.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TagInput from '../../../../components/TagInput';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import '../../../../styles/CustomizarEvento.css';

export default function CustomizarEvento() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [form, setForm] = useState({
    status: '0',
    titulo: '',
    descricao: '',
    categoria: '',
    tag: [],
    local: '',
    data_inicio: '',
    data_fim: '',
    flyer: null,
    mapa: null
  });
  const [flyerPreview, setFlyerPreview] = useState(null);
  const [mapaPreview, setMapaPreview] = useState(null);

  const categorias = ['show', 'festa', 'teatro', 'comedia'];
  const tags = [
    'pop', 'funk', 'rap', 'rock', 'Heavy Metal', 'Reggae', 'Gospel/Religioso',
    'Eletrônica', 'Samba', 'Axé', 'Sertanejo', 'Forró', 'Pagode', 'Show',
    'festa', 'Matinê', 'Open Bar', 'Feira', 'Hardcore', 'Stand Up', 'Arrocha', 'Trap', 'Teatro'
  ];

  useEffect(() => {
    fetch(`http://localhost:4000/api/eventos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar evento');
        return res.json();
      })
      .then(data => {
        setEvento(data);
        setForm({
          status: data.status?.toString() || '0',
          titulo: data.titulo || '',
          descricao: data.descricao || '',
          categoria: data.categoria || '',
          tag: data.tag ? data.tag.split(',') : [],
          local: data.local || '',
          data_inicio: data.data_inicio ? data.data_inicio.substring(0, 16) : '',
          data_fim: data.data_fim ? data.data_fim.substring(0, 16) : '',
          flyer: null,
          mapa: null
        });
        setFlyerPreview(data.banner_url ? `http://localhost:4000${data.banner_url}` : null);
      })
      .catch(err => console.error('Erro ao carregar evento:', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (name === 'flyer') {
        setFlyerPreview(URL.createObjectURL(file));
      } else if (name === 'mapa') {
        setMapaPreview(URL.createObjectURL(file));
      }
      setForm(prev => ({ ...prev, [name]: file }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagChange = (tags) => {
    setForm(prev => ({ ...prev, tag: tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === 'tag') {
        formData.append(key, Array.isArray(value) ? value.join(',') : '');
      } else if (value !== null) {
        formData.append(key, value);
      }
    });

    try {
      const res = await fetch(`http://localhost:4000/api/eventos/${id}`, {
        method: 'PUT',
        body: formData
      });

      if (!res.ok) throw new Error('Erro ao salvar alterações');
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar as alterações.');
    }
  };

  if (!evento) return <p>Carregando...</p>;

  return (
    <div className="customizar-evento-container">
      <h1>Personalize o Evento</h1>
      <form onSubmit={handleSubmit} className="customizar-form">

        <label>
          Visibilidade do evento:
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="0">Ocultar evento do público</option>
            <option value="1">Tornar esse evento público</option>
          </select>
        </label>

        <label>Título do Evento:
          <input
            type="text"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
          />
        </label>

        <label>Descrição do Evento:
          <SunEditor
            name="descricao"
            setContents={form.descricao}
            onChange={(content) => setForm(prev => ({ ...prev, descricao: content }))}
            height="200px"
          />
        </label>

        <label>Categoria do Evento:
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </label>


        <label>Tags (separadas por vírgula):
          <TagInput
            selectedTags={form.tag || []}
            setSelectedTags={handleTagChange}
            availableTags={tags}
          />
        </label>

        <label>Local:
          <input
            type="text"
            name="local"
            value={form.local}
            onChange={handleChange}
          />
        </label>

        <div className="row">
          <div>
            <label>Data de Início:
              <input
                type="datetime-local"
                name="data_inicio"
                value={form.data_inicio}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label>Data Final:
              <input
                type="datetime-local"
                name="data_fim"
                value={form.data_fim}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div>
            <label>Flyer do Evento:
              <input
                type="file"
                name="flyer"
                accept="image/*"
                onChange={handleChange}
              />
              {flyerPreview && (
                <img src={flyerPreview} alt="Preview flyer" className="preview-img" />
              )}
            </label>
          </div>
          <div>
            <label>Mapa do Evento:
              <input
                type="file"
                name="mapa"
                accept="image/*"
                onChange={handleChange}
              />
              {mapaPreview && (
                <img src={mapaPreview} alt="Preview mapa" className="preview-img" />
              )}
            </label>
          </div>
        </div>

        <button type="submit" className="btn-salvar">Salvar as Alterações</button>
      </form>
    </div>
  );
}
