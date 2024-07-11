import React from 'react';
import { motion } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { Image1, Image2, Image3, Image4, Image5 } from '../assets';

const Landing = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="bg-[#f1f2eb] min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold mb-4">Stoop Sale</h1>
                <p className="text-gray-600 mb-6">Join us for a neighborhood stoop sale where you can find great deals on various items!</p>
                <div className="flex justify-center mb-6">
                    <motion.button
                        onClick={() => loginWithRedirect()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none">
                        Register/Login
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Landing;