import React from 'react';
import { motion } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { Image1, Image2, Image3, Image4, Image5 } from '../assets';

const Landing = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg p-8 mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="mb-4 text-3xl font-bold">Stoop Sale</h1>
                <p className="mb-6 text-gray-600">Join us for a neighborhood stoop sale where you can find great deals on various items!</p>
                <div className="flex justify-center mb-6">
                    <motion.button
                        onClick={() => loginWithRedirect()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none">
                        Register/Login
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Landing;