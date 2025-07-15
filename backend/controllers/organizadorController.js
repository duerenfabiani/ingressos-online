//organizadorController.js
const db = require('../models/db');
require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

console.log('🟢 organizadorController carregado!');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function gerarSenhaForte(length = 10) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let senha = '';
  for (let i = 0; i < length; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return senha;
}

async function enviarEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Entrada360" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('✅ Email enviado:', info.response);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    throw error;
  }
}

// 📌 Cadastro do Organizador
exports.createOrganizador = async (req, res) => {
  try {
    const dados = req.body;

    // Verifica se o e-mail já existe
    const [rows] = await db.execute(
      'SELECT id FROM organizadores WHERE email_responsavel = ?',
      [dados.emailResponsavel]
    );

    if (rows.length > 0) {
      return res.status(409).json({ message: 'E-mail já cadastrado. Você pode recuperar sua conta!' });
    }

    const senhaGerada = gerarSenhaForte(10);
    const senhaHash = await bcrypt.hash(senhaGerada, 10);

    const cleanValue = (value) => value === undefined ? null : value;

    // ✅ Query com TODAS as colunas da tabela
    const query = `
      INSERT INTO organizadores (
        primeiro_nome, sobrenome, nome_responsavel, celular_responsavel, cpf_responsavel,
        email_responsavel, confirmar_email_responsavel, nome_produtora, cnpj_produtora,
        instagram_produtora, eventos_realizados, plataforma_venda, faturamento, chave_pix,
        cep, bairro, rua, numero, complemento, cidade, estado, senha, created_at, primeiro_login_completo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      cleanValue(dados.primeiroNome),
      cleanValue(dados.sobrenome),
      cleanValue(dados.nomeResponsavel),
      cleanValue(dados.celularResponsavel),
      cleanValue(dados.cpfResponsavel),
      cleanValue(dados.emailResponsavel),
      cleanValue(dados.confirmarEmailResponsavel),
      cleanValue(dados.nomeProdutora),
      cleanValue(dados.cnpjProdutora),
      cleanValue(dados.instagramProdutora),
      cleanValue(dados.eventosRealizados),
      cleanValue(dados.plataformaVenda),
      cleanValue(dados.faturamento),
      cleanValue(dados.chavePix),
      cleanValue(dados.cep),
      cleanValue(dados.bairro),
      cleanValue(dados.rua),
      cleanValue(dados.numero),
      cleanValue(dados.complemento),
      cleanValue(dados.cidade),
      cleanValue(dados.estado),
      senhaHash,
      new Date(),
      0  // primeiro_login_completo
    ];

    await db.execute(query, values);

    const anoAtual = new Date().getFullYear();
    const htmlContent = `
      <div style="max-width:600px;margin:0 auto;font-family:sans-serif;padding:20px;">
        <div style="text-align:center;">
          <img src="${process.env.FRONTEND_URL}/assets/logo360_cinza.png" alt="Entrada360" style="max-width:200px;margin-bottom:20px;" />
        </div>
        <h2 style="color:#e63946;text-align:center;">Seja bem-vindo(a) à Entrada360!</h2>
        <p>É um prazer ter você com a gente.</p>
        <p>Entre no link com o login e senha fornecidos nesse e-mail para ter acesso à sua área de produtor.</p>
        <p>Recomendamos que, após efetuar o seu primeiro acesso, troque imediatamente sua senha para garantir maior segurança. 
        Se você não sabe como fazer isso, basta <a href="${process.env.FRONTEND_URL}/ajuda/trocar-senha">clicar aqui</a>.</p>
        <p>Ainda não sabe utilizar nosso sistema? <a href="${process.env.FRONTEND_URL}/ajuda/tutorial">Clique aqui</a> e aprenda o passo a passo de todas as funcionalidades da Entrada360. É tudo muito simples e rápido.</p>
        <p>Caso tenha qualquer dúvida, basta mandar um e-mail para <a href="mailto:organizador@entrada360.com.br">organizador@entrada360.com.br</a>.</p>
        <hr />
        <h3>Seus dados de acesso:</h3>
        <p><strong>Usuário:</strong> ${dados.emailResponsavel}</p>
        <p><strong>Senha:</strong> ${senhaGerada}</p>
        <p><strong>Link para acessar:</strong> <a href="${process.env.FRONTEND_URL}/login">${process.env.FRONTEND_URL}/login</a></p>
        <hr />
        <p style="text-align:center;font-size:12px;color:#888;">© ${anoAtual} Entrada360 - Todos os direitos reservados.</p>
      </div>
    `;

    await enviarEmail(dados.emailResponsavel, 'Bem-vindo(a) à Entrada360!', htmlContent);

    res.status(201).json({ message: 'Organizador cadastrado com sucesso. Verifique seu e-mail para acesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar organizador.' });
  }
};

// 📌 Atualizar Perfil do Organizador
exports.atualizarPerfil = async (req, res) => {
  const { id, nomeCompleto, email, senhaAtual, novaSenha } = req.body;

  if (!id || !nomeCompleto || !email) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    // ✅ Verifica se o organizador existe
    const [rows] = await db.execute(
      'SELECT senha FROM organizadores WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Organizador não encontrado.' });
    }

    // ✅ Se for trocar senha, precisa validar senha atual
    if (senhaAtual && novaSenha) {
      const senhaHashSalva = rows[0].senha;

      const senhaConfere = await bcrypt.compare(senhaAtual, senhaHashSalva);
      if (!senhaConfere) {
        return res.status(401).json({ message: 'Senha atual incorreta.' });
      }

      const novaHash = await bcrypt.hash(novaSenha, 10);

      await db.execute(
        `UPDATE organizadores
         SET nome_responsavel = ?, email_responsavel = ?, senha = ?, primeiro_login_completo = 1
         WHERE id = ?`,
        [nomeCompleto.trim(), email.trim(), novaHash, id]
      );

    } else {
      // ✅ Atualização sem troca de senha
      await db.execute(
        `UPDATE organizadores
         SET nome_responsavel = ?, email_responsavel = ?, primeiro_login_completo = 1
         WHERE id = ?`,
        [nomeCompleto.trim(), email.trim(), id]
      );
    }

    res.json({ message: 'Perfil atualizado com sucesso!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar perfil.' });
  }
};

// 📌 Recuperação de conta
exports.recuperarConta = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT id FROM organizadores WHERE email_responsavel = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'E-mail não encontrado.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 60 * 60 * 1000);

    await db.execute(
      'UPDATE organizadores SET reset_token = ?, reset_token_expira = ? WHERE email_responsavel = ?',
      [token, expira, email]
    );

    const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;
    const anoAtual = new Date().getFullYear();

    const htmlContent = `
      <div style="max-width:600px;margin:0 auto;padding:20px;font-family:sans-serif;">
        <h2 style="color:#e63946;text-align:center;">Recuperação de Conta</h2>
        <p>Olá! Clique no link abaixo para redefinir sua senha:</p>
        <p><a href="${link}" style="color:#e63946;">${link}</a></p>
        <p>Este link expira em 1 hora.</p>
        <hr />
        <p style="text-align:center;font-size:12px;color:#888;">© ${anoAtual} Entrada360 - Todos os direitos reservados.</p>
      </div>
    `;

    await enviarEmail(email, 'Recuperação de Conta', htmlContent);

    res.json({ message: 'E-mail de recuperação enviado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar recuperação.' });
  }
};

// 📌 Redefinição de senha
exports.redefinirSenha = async (req, res) => {
  const { token, senha } = req.body;

  if (!token || !senha) {
    return res.status(400).json({ message: 'Token e senha são obrigatórios.' });
  }

  try {
    const [rows] = await db.execute(
      'SELECT id, reset_token_expira FROM organizadores WHERE reset_token = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Link inválido ou expirado.' });
    }

    const expira = new Date(rows[0].reset_token_expira);
    if (expira < new Date()) {
      return res.status(400).json({ message: 'Link expirado.' });
    }

    const hash = await bcrypt.hash(senha, 10);

    await db.execute(
      'UPDATE organizadores SET senha = ?, reset_token = NULL, reset_token_expira = NULL WHERE reset_token = ?',
      [hash, token]
    );

    res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao redefinir senha.' });
  }
};
