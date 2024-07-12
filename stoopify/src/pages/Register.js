import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaShareAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Map, Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { app } from '../db/Firebase';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

mapboxgl.accessToken = 'pk.eyJ1IjoidmFpc2huYXZpa2FsZTMwMTEiLCJhIjoiY2x5aDJuMjhjMDA4YTJqc2Vxanh0N3htbSJ9.ALPuZS4dSjgkGrooyUH8RA';

const Register = () => {
    const { isAuthenticated, loginWithPopup, user } = useAuth0();
    const db = getFirestore(app); 

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: new Date(),
        time: '',
        location: '',
        items: '',
        coordinates: { longitude: -73.935242, latitude: 40.730610 }, // Default to New York
        rsvps: [],
        owner: user.name
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            date: date,
        }));
    };

    const handleMapClick = (event) => {
        const { lngLat } = event;
        if (lngLat) {
            setFormData((prevData) => ({
                ...prevData,
                coordinates: { longitude: lngLat.lng, latitude: lngLat.lat }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, 'stoopSales'), {
                title: formData.title,
                description: formData.description,
                date: formData.date.toLocaleDateString(),
                time: formData.time,
                location: formData.location,
                items: formData.items,
                coordinates: formData.coordinates,
                organizer: user.name, 
                organizerEmail: user.email, 
                rsvps: formData.rsvps 
            });
            console.log('Document written with ID: ', docRef.id);
            // Reset form data after submission
            setFormData({
                title: '',
                description: '',
                date: new Date(),
                time: '',
                location: '',
                items: '',
                coordinates: { longitude: -73.935242, latitude: 40.730610 },
                rsvps: []
            });
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };
    
    const shareEvent = () => {
        const shareData = {
            title: formData.title,
            text: `${formData.description}\n\nLocation: ${formData.location}\nDate: ${formData.date.toLocaleDateString()}\nTime: ${formData.time}`,
            url: window.location.href
        };

        try {
            navigator.share(shareData);
        } catch (error) {
            console.error('Error sharing', error);
        }
    };

    return (
        isAuthenticated ? (
            <div className="max-w-4xl min-h-screen p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
                <h1 className="mb-6 text-3xl font-bold text-center">Register Your Stoop Sale</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-gray-700">Sale Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-gray-700">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="date" className="block text-gray-700">Date</label>
                            <DatePicker
                                selected={formData.date}
                                onChange={handleDateChange}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-gray-700">Time</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-gray-700">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="items" className="block text-gray-700">Items for Sale</label>
                        <textarea
                            id="items"
                            name="items"
                            value={formData.items}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="List items separated by commas"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-gray-700">Pin Location on Map</label>
                        <div style={{ width: '100%', height: '300px' }}>
                            <Map
                                {...formData.coordinates ? ({
                                    width: '100%',
                                    height: '100%',
                                    mapStyle: 'mapbox://styles/mapbox/streets-v11',
                                    mapboxApiAccessToken: mapboxgl.accessToken,
                                    latitude: formData.coordinates.latitude,
                                    longitude: formData.coordinates.longitude,
                                    zoom: 12
                                }) : ({
                                    width: '100%',
                                    height: '100%',
                                    mapStyle: 'mapbox://styles/mapbox/streets-v11',
                                    mapboxApiAccessToken: mapboxgl.accessToken,
                                    onClick: handleMapClick
                                })}
                            >
                                <Marker longitude={formData.coordinates.longitude} latitude={formData.coordinates.latitude}>
                                    <FaMapMarkerAlt className="text-2xl text-red-600" />
                                </Marker>
                                <NavigationControl showZoom position='top-right'/>
                            </Map>
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                        >
                            Submit
                        </motion.button>
                    </div>
                    <div className="flex justify-center mt-4">
                        <motion.button
                            type="button"
                            onClick={shareEvent}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
                        >
                            <FaShareAlt className="mr-2" /> Share Event
                        </motion.button>
                    </div>
                </form>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Register Your Stoop Sale</h2>
                <p className="text-gray-600">Log in to register your sale</p>
                <div className="mt-4">
                    <button
                        onClick={() => loginWithPopup()}
                        className="px-4 py-2 text-white transition-all duration-300 bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                        Register/Login
                    </button>
                </div>
            </div>
        )
    );
};

export default Register;