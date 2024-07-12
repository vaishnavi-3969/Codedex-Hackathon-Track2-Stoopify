import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Error = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 text-center bg-white rounded-lg shadow-lg">
                <h1 className="text-6xl font-bold text-red-500">404</h1>
                <h2 className="mt-4 text-2xl font-semibold text-gray-700">Oops! Page not found</h2>
                <p className="mt-2 text-gray-600">Sorry, the page you're looking for doesn't exist.</p>
                <Link to="/" className="inline-flex items-center px-4 py-2 mt-6 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                    <FaHome className="mr-2" /> Go to Home
                </Link>
            </div>
        </div>
    );
};

export default Error;