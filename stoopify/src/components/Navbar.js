import React from 'react'
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
    const { isAuthenticated, user } = useAuth0();

    return (
        <div>
            <header className="flex items-center justify-between p-4 text-white bg-gray-900">
                <Link to="/" className="flex items-center text-3xl font-bold text-white">
                    <img src={Logo} alt="logo" className="w-12 h-12 mr-2 rounded-full" />
                    Stoopify
                </Link>
                <nav>
                    <Link to="/directory" className="mx-4 hover:underline">Directory</Link>
                    {
                        isAuthenticated ? (
                            <Link to="/stoop-sale-register" className="mx-4 hover:underline">Register Sale</Link>
                        )
                        :
                        null
                    }
                </nav>
                <Link to="/profile">
                    <div className="flex items-center">
                        {
                            isAuthenticated && user.picture ? (
                                <img src={user.picture} alt={user.name} className="w-8 h-8 mr-2 rounded-full" />
                            )
                            :
                        (
                        <FaUser className="w-8 h-8 mr-2" />
                        )
                    }
                        <span>{isAuthenticated ? user.name : 'Profile'}</span>
                    </div>
                </Link>
            </header>
        </div>
    )
}

export default Navbar