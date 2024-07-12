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
                className="w-full max-w-3xl p-8 mx-auto text-center bg-white rounded-lg shadow-lg">
                <h1 className="mb-4 text-4xl font-bold">Welcome to Stoopify, {user.name}!</h1>
                <p className="mb-6 text-gray-600">Discover and join amazing stoop sales in your neighborhood.</p>
                <div className="flex justify-center mb-6">
                    <motion.button
                        onClick={() => logout({ returnTo: window.location.origin })}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none">
                        Logout
                    </motion.button>
                </div>
            </motion.div>

            <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto mt-10 md:grid-cols-3">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-lg">
                    <FaTags className="mb-4 text-5xl text-blue-500" />
                    <h2 className="mb-2 text-2xl font-bold">Browse Sales</h2>
                    <p className="mb-4 text-gray-600">Find the best stoop sales happening around you.</p>
                    <Link to="/directory" className="text-blue-500 hover:underline">Explore Sales</Link>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-lg">
                    <FaUsers className="mb-4 text-5xl text-green-500" />
                    <h2 className="mb-2 text-2xl font-bold">Join Community</h2>
                    <p className="mb-4 text-gray-600">Connect with fellow stoop sale enthusiasts.</p>
                    <Link to="/community" className="text-green-500 hover:underline">Join Now</Link>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-lg">
                    <FaMapMarkedAlt className="mb-4 text-5xl text-red-500" />
                    <h2 className="mb-2 text-2xl font-bold">Register</h2>
                    <p className="mb-4 text-gray-600">Register your sale</p>
                    <Link to="/stoop-sale-register" className="text-red-500 hover:underline">Register</Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Home;