import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './EventosDestaque.css';

const EventosDestaque = ({ date }) => {
  const [eventos, setEventos] = useState([]);

  // Função para buscar eventos do banco de dados
  const fetchEventos = (selectedDate = null) => {
    let url = 'http://localhost:4000/api/eventos'; // URL do seu backend para buscar eventos
    
    // Se uma data for selecionada, filtramos os eventos pela data
    if (selectedDate) {
      url = `http://localhost:4000/api/eventos?date=${selectedDate}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => setEventos(data))
      .catch(error => console.error('Erro ao carregar eventos:', error));
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Configuração do carrossel
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: true,
    arrows: true,
    centerMode: true,
    centerPadding: '0',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <div className="eventos-destaque">
      <h2>Eventos em Destaque</h2>
      <Slider {...settings}>
        {eventos.map(evento => (
          <div key={evento.id} className="evento-card">
            <img src={evento.banner_url} alt={evento.nome} />
            <h3>{evento.nome}</h3>
            <p>{evento.data_inicio}</p>
            <p>{evento.local}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EventosDestaque;
