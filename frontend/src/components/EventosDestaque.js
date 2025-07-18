import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import './EventosDestaque.css';

const EventosDestaque = ({ selectedDate }) => {
  const [eventos, setEventos] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  // Função para buscar eventos do banco de dados
  const fetchEventos = (selectedDate = null) => {
    let url = 'http://localhost:4000/api/eventos';

    if (selectedDate) {
      url = `http://localhost:4000/api/eventos?date=${selectedDate}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Filtrar apenas eventos com status = 1
        const ativos = data.filter(evento => evento.status === 1);

        // Garantir que eventos duplicados não sejam adicionados
        const uniqueEventos = Array.from(new Set(ativos.map(a => a.id)))
          .map(id => {
            return ativos.find(a => a.id === id);
          });

        setEventos(uniqueEventos);
      })
      .catch(error => console.error('Erro ao carregar eventos:', error));
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setSelectedMonth(selectedDate.substring(0, 7));
      fetchEventos(selectedDate);
    }
  }, [selectedDate]);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 5.3,
    slidesToScroll: 1,
    draggable: true,
    arrows: true,
    centerMode: false,
    centerPadding: '1',
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

  function formatarData(dataISO) {
    const data = new Date(dataISO);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
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
                    onError={(e) => e.target.src = '/uploads/default_image.jpg'}
                    style={{ width: '100%', objectFit: 'cover' }}
                  />
                  <h3>{evento.nome}</h3>
                </Link>
                <p>{formatarData(evento.data_inicio)}</p>
              </div>
            ))
          ) : (
            <p>Não há eventos disponíveis no momento.</p>
          )}
        </Slider>
      </div>
    </div>
  );
};

export default EventosDestaque;
