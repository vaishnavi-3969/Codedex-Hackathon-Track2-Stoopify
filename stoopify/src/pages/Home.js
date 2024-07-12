import React from 'react';
import { motion } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { FaTags, FaUsers, FaMapMarkedAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
    const { user, logout } = useAuth0();

    return (
        <div className="bg-[#f1f2eb] min-h-screen flex flex-col items-center py-10">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl w-full mx-auto p-8 bg-white shadow-lg rounded-lg text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Stoopify, {user.name}!</h1>
                <p className="text-gray-600 mb-6">Discover and join amazing stoop sales in your neighborhood.</p>
                <div className="flex justify-center mb-6">
                    <motion.button
                        onClick={() => logout({ returnTo: window.location.origin })}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg focus:outline-none">
                        Logout
                    </motion.button>
                </div>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                    <FaTags className="text-5xl text-blue-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Browse Sales</h2>
                    <p className="text-gray-600 mb-4">Find the best stoop sales happening around you.</p>
                    <Link to="/directory" className="text-blue-500 hover:underline">Explore Sales</Link>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                    <FaUsers className="text-5xl text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Join Community</h2>
                    <p className="text-gray-600 mb-4">Connect with fellow stoop sale enthusiasts.</p>
                    <Link to="/community" className="text-green-500 hover:underline">Join Now</Link>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                    <FaMapMarkedAlt className="text-5xl text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Map Sales</h2>
                    <p className="text-gray-600 mb-4">See where sales are happening on the map.</p>
                    <Link to="/map" className="text-red-500 hover:underline">View Map</Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;