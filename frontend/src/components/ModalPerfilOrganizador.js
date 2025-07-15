import React, { useState } from 'react';
import '../styles/ModalPerfilOrganizador.css';

export default function ModalPerfilOrganizador({ organizadorId, onSaveSuccess }) {
  const [abaAtiva, setAbaAtiva] = useState('geral');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nomeCompleto: '',
    email: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarNovaSenha: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.nomeCompleto.trim() || !form.email.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (mostrarSenha) {
      if (!form.senhaAtual || !form.novaSenha || !form.confirmarNovaSenha) {
        alert('Preencha todos os campos de senha.');
        return;
      }

      if (form.novaSenha !== form.confirmarNovaSenha) {
        alert('As senhas novas não conferem!');
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        id: organizadorId,
        nomeCompleto: form.nomeCompleto.trim(),
        email: form.email.trim(),
        senhaAtual: mostrarSenha ? form.senhaAtual : null,
        novaSenha: mostrarSenha ? form.novaSenha : null
      };

      const response = await fetch('http://localhost:4000/api/organizadores/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Resposta inválida do servidor.');
      }

      if (!response.ok) throw new Error(data.message || 'Erro ao salvar os dados.');

      alert('Perfil atualizado com sucesso!');
      onSaveSuccess();

    } catch (error) {
      console.error(error);
      alert(error.message || 'Erro ao salvar os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-perfil-overlay">
      <div className="modal-perfil">
        <h2 className="modal-titulo">Meu Perfil</h2>
        <div className="modal-layout">
          <div className="modal-abas-lateral">
            <div
              className={`aba-item ${abaAtiva === 'geral' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('geral')}
            >
              Geral
            </div>
            <div
              className={`aba-item ${abaAtiva === 'integracoes' ? 'ativa' : ''}`}
              onClick={() => setAbaAtiva('integracoes')}
            >
              Integrações
            </div>
          </div>

          <div className="modal-conteudo">
            {abaAtiva === 'geral' && (
              <div className="conteudo-scroll">
                <p className="mensagem-inicial">
                  <strong>Bem-vindo(a) à Entrada360!</strong>
                  <br />
                  Antes de continuar, atualize sua conta com seu nome completo.
                </p>

                <label>Nome Completo *</label>
                <input
                  type="text"
                  name="nomeCompleto"
                  placeholder="Digite seu nome completo"
                  value={form.nomeCompleto}
                  onChange={handleChange}
                  required
                />

                <label>E-mail *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="seuemail@exemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                {!mostrarSenha && (
                  <div className="link-senha-wrapper">
                    <button
                      type="button"
                      className="link-senha"
                      onClick={() => setMostrarSenha(true)}
                    >
                      Mudar senha
                    </button>
                  </div>
                )}

                {mostrarSenha && (
                  <div className="senha-section">
                    <label>Senha atual *</label>
                    <input
                      type="password"
                      name="senhaAtual"
                      value={form.senhaAtual}
                      onChange={handleChange}
                      required
                    />

                    <label>Nova senha *</label>
                    <input
                      type="password"
                      name="novaSenha"
                      value={form.novaSenha}
                      onChange={handleChange}
                      required
                    />

                    <label>Confirme a nova senha *</label>
                    <input
                      type="password"
                      name="confirmarNovaSenha"
                      value={form.confirmarNovaSenha}
                      onChange={handleChange}
                      required
                    />

                    <button
                      type="button"
                      className="cancelar-senha"
                      onClick={() => {
                        setMostrarSenha(false);
                        setForm({ ...form, senhaAtual: '', novaSenha: '', confirmarNovaSenha: '' });
                      }}
                    >
                      Ocultar a alteração de senha
                    </button>
                  </div>
                )}

                <button className="salvar" onClick={handleSave} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Dados'}
                </button>
              </div>
            )}

            {abaAtiva === 'integracoes' && (
              <div className="conteudo-scroll">
                <p>Configurações de integrações futuras :)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
