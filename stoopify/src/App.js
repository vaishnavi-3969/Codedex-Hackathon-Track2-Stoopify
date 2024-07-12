import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import Contact from './components/Contact';
import StoopSale from './pages/StoopSale';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Error from './pages/Error';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './pages/Home';
import StoopSaleDetail from './pages/StoopSaleDetail';
import Community from './pages/Community';

function App() {
  const {isAuthenticated} = useAuth0();

  const routes = [
    { path: '/', element: isAuthenticated ? <Home /> : <Landing /> },
    { path: '/contact', element: <Contact /> },
    { path: '/directory', element: <StoopSale /> },
    { path: '/stoop-sale-register', element: <Register /> },
    { path: '/profile', element: <Profile /> },
    { path: '*', element: <Error /> },
    { path: '/stoopSale/:id', element: <StoopSaleDetail /> },
    { path: '/community', element: <Community /> },
  ]
  return (
    <div class="bg-[#f1f2eb] ">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {routes.map(route => (
            <Route path={route.path} element={route.element} exact />
          ))}
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;