import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <>
      <Header />
      <div className="principal">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
