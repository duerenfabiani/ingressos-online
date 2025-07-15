import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaSearch, FaUser } from 'react-icons/fa';
import '../styles/Header.css';
import logo from '../assets/images/logo360.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const searchRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/busca?query=${encodeURIComponent(query)}`);
      setQuery('');
      setShowSearch(false);
    }
  };

  // Fecha dropdown de busca se clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fecha menu mobile se for para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  return (
    <>
      <header>
        <div className="header-left">
          <Link to="/" className="header-logo">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        <nav className="header-links">
          <Link to="/">Eventos</Link>
          <Link to="/organizadores">Publique seu evento</Link>
          <Link to="/login">Área do Produtor</Link>
        </nav>

        <div className="header-right">
          <div className="search-container" ref={searchRef}>
            <button className="header-icon" onClick={toggleSearch} aria-label="Buscar">
              <FaSearch />
            </button>
            {showSearch && (
              <div className="search-dropdown">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Buscar evento..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button type="submit">Encontre seu evento</button>
                </form>
              </div>
            )}
          </div>

          <Link to="/cliente-login" className="header-icon" aria-label="Área do Cliente">
            <FaUser />
          </Link>

          <button className="hamburger" onClick={toggleMenu} aria-label="Abrir Menu">
            <FaBars />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-nav">
          <Link to="/" onClick={() => setMenuOpen(false)}>Eventos</Link>
          <Link to="/organizadores" onClick={() => setMenuOpen(false)}>Publique seu evento</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>Área do Produtor</Link>
        </div>
      )}
    </>
  );
}
