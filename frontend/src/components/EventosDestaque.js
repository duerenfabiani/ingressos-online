import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom'; // Importando o Link
import './EventosDestaque.css';

const EventosDestaque = ({ selectedDate }) => {
  const [eventos, setEventos] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  // Função para buscar eventos do banco de dados
  const fetchEventos = (selectedDate = null) => {
    let url = 'http://localhost:4000/api/eventos'; // URL do seu backend para buscar eventos
    
    // Se uma data for selecionada, filtramos os eventos pela data
    if (selectedDate) {
      url = `http://localhost:4000/api/eventos?date=${selectedDate}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Garantir que eventos duplicados não sejam adicionados
        const uniqueEventos = Array.from(new Set(data.map(a => a.id))) // Cria um Set para garantir eventos únicos
          .map(id => {
            return data.find(a => a.id === id);
          });

        setEventos(uniqueEventos); // Atualiza o estado com os eventos únicos
      })
      .catch(error => console.error('Erro ao carregar eventos:', error));
  };

  // Carrega os eventos mais recentes inicialmente
  useEffect(() => {
    fetchEventos();
  }, []);

  // Atualiza os eventos ao selecionar um mês
  useEffect(() => {
    if (selectedDate) {
      setSelectedMonth(selectedDate.substring(0, 7)); // Exemplo de "2025-07"
      fetchEventos(selectedDate); // Quando a data muda, buscar eventos para a data selecionada
    }
  }, [selectedDate]);

  // Configurações do carrossel
  const settings = {
    infinite: false,       // Habilita loop infinito
    speed: 500,           // Velocidade de transição
    slidesToShow: 5.3,      // Quantidade de slides visíveis
    slidesToScroll: 1,    // Quantidade de slides rolados por vez
    draggable: true,      // Habilita o arraste com o mouse
    arrows: true,        // Remove as setas de navegação (Previous e Next)
    centerMode: false,     // Exibe o slide centralizado
    centerPadding: '1',   // Remove o espaço nas laterais
    responsive: [
      {
        breakpoint: 1024, // Para telas maiores
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768, // Para telas menores
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480, // Para telas muito pequenas
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mes começa do 0
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;  // Formato dd/mm/yyyy
  }
  
  return (
    <div className="eventos-destaque">
      <h2>Eventos em Destaque</h2>
      
      <div className="carrossel-container">
        <Slider {...settings}>
          {eventos.length > 0 ? (
              eventos.map((evento) => (
                <div key={evento.id} className="evento-card">
                  <Link to={`/CompraIngresso?evento_id=${evento.id}`} style={{ textDecoration: 'none' }}>
                    <img
                      src={`http://localhost:4000${evento.banner_url}`}
                      alt={evento.nome}
                      onError={(e) => e.target.src = '/uploads/default_image.jpg'} // Caso a imagem falhe
                      style={{ width: '100%', objectFit: 'cover' }}
                    />
                    <h3>{evento.nome}</h3>
                  </Link>
                  <p>{formatarData(evento.data_inicio)}</p>
                </div>
              ))
            ) : (
              <p>Não há eventos disponíveis no momento.</p> // Exibir uma mensagem se não houver eventos
            )}

        </Slider>
      </div>
    </div>
  );
};

export default EventosDestaque;
