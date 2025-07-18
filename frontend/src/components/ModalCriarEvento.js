import React, { useState, useEffect } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import '../styles/ModalCriarEvento.css';
import TagInput from './TagInput';

export default function ModalCriarEvento({ onClose }) {
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    tag: [],
    data_inicio: '',
    data_fim: '',
    imagem: null,
    local: '',
  });

  useEffect(() => {
    // Evitar rolagem no body quando modal está aberto
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const categorias = ['show', 'festa', 'teatro', 'comedia'];
  const tags = [
    'pop', 'funk', 'rap', 'rock', 'Heavy Metal', 'Reggae', 'Gospel/Religioso',
    'Eletrônica', 'Samba', 'Axé', 'Sertanejo', 'Forró', 'Pagode', 'Show',
    'festa', 'Matinê', 'Open Bar', 'Feira', 'Hardcore', 'Stand Up', 'Arrocha', 'Trap', 'Teatro'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagem') {
      setForm({ ...form, imagem: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

const handleSubmit = (e) => {
  e.preventDefault();
  const data = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (key === 'imagem' && value) {
      data.append(key, value);
    } else if (key === 'tag') {
      data.append('tag', value.join(',')); // Salva como "pop,rock"
    } else {
      data.append(key, value);
    }
  });

  data.append('status', 0);

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario?.id) {
    data.append('criado_por', usuario.id);
  }

  fetch(`${process.env.REACT_APP_BACKEND_URL}/api/eventos`, {
    method: 'POST',
    body: data
  })
    .then(res => res.json())
    .then(() => {
      alert('Evento criado com sucesso!');
      onClose();
    })
    .catch(() => alert('Erro ao criar evento.'));
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Criar Novo Evento</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Local</label>
              <input
                type="text"
                name="local"
                value={form.local}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecione</option>
                {categorias.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label>Tags</label>
              <TagInput
                availableTags={tags}
                selectedTags={form.tag}
                setSelectedTags={(newTags) => setForm({ ...form, tag: newTags })}
              />
            </div>

            <div className="form-group">
              <label>Data de Início</label>
              <input
                type="datetime-local"
                name="data_inicio"
                value={form.data_inicio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Data Final</label>
              <input
                type="datetime-local"
                name="data_fim"
                value={form.data_fim}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Imagem (opcional)</label>
              <input
                type="file"
                name="imagem"
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Descrição</label>
              <SunEditor
                setContents={form.descricao}
                onChange={(value) => setForm(prev => ({ ...prev, descricao: value }))}
                setOptions={{
                  height: 200,
                  buttonList: [
                    ['undo', 'redo', 'bold', 'underline', 'italic', 'strike'],
                    ['list', 'align'],
                    ['link', 'image']
                  ]
                }}
              />
            </div>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="btn-salvar">Salvar Evento</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
