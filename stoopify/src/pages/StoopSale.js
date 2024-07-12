import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../db/Firebase';
import Filter from '../components/Filter';
import { FaCalendarAlt, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import { format, isToday, isPast } from 'date-fns';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidmFpc2huYXZpa2FsZTMwMTEiLCJhIjoiY2x5aDJuMjhjMDA4YTJqc2Vxanh0N3htbSJ9.ALPuZS4dSjgkGrooyUH8RA';
const DIRECTIONS_API_ENDPOINT = 'https://api.mapbox.com/directions/v5/mapbox/driving/';

const StoopSale = () => {
    const [stoopSales, setStoopSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [map, setMap] = useState(null); // State to hold the map instance
    const [currentLocation, setCurrentLocation] = useState(null);

    useEffect(() => {
        const fetchStoopSales = async () => {
            const db = getFirestore(app);
            const stoopSalesSnapshot = await getDocs(collection(db, 'stoopSales'));
            const stoopSalesData = stoopSalesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStoopSales(stoopSalesData);
            setFilteredSales(stoopSalesData);
        };

        fetchStoopSales();
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setCurrentLocation([position.coords.longitude, position.coords.latitude]);
            });
        }
    }, []);

    useEffect(() => {
        if (!map && currentLocation) {
            mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
            const newMap = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v11', 
                center: currentLocation,
                zoom: 14
            });
            setMap(newMap);
        }
    }, [currentLocation, map]);

    const handleFilterChange = (filters) => {
        let filtered = [...stoopSales];

        if (filters.city) {
            filtered = filtered.filter(sale => sale.location.toLowerCase().includes(filters.city.toLowerCase()));
        }

        if (filters.sortBy === 'location') {
            filtered.sort((a, b) => a.location.localeCompare(b.location));
        } else {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        setFilteredSales(filtered);
    };

    const getTagColor = (date) => {
        const saleDate = new Date(date);

        if (isToday(saleDate)) {
            return 'bg-red-400'; // red - live
        } else if (isPast(saleDate)) {
            return 'bg-gray-400';  // gray - passed
        } else {
            return 'bg-green-400'; //green - upcoming
        }
    };

    const getStaticMapUrl = (latitude, longitude) => {
        return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+FF5733(${longitude},${latitude})/${longitude},${latitude},14/600x300?access_token=${MAPBOX_ACCESS_TOKEN}`;
    };

    const handleShowDirections = (sale) => {
        if (map && currentLocation) {
            const start = `${currentLocation[0]},${currentLocation[1]}`;
            const end = `${sale.coordinates.longitude},${sale.coordinates.latitude}`;
            const directionsUrl = `${DIRECTIONS_API_ENDPOINT}${start};${end}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

            fetch(directionsUrl)
                .then(response => response.json())
                .then(data => {
                    const route = data.routes[0].geometry.coordinates;
                    map.addSource('route', {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: route
                            }
                        }
                    });
                    map.addLayer({
                        id: 'route',
                        type: 'line',
                        source: 'route',
                        layout: {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        paint: {
                            'line-color': '#FF5733',
                            'line-width': 8
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching directions:', error);
                });
        }
    };

    return (
        <div className="max-w-6xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
            <h1 className="mb-6 text-3xl font-bold text-center">Stoop Sales</h1>
            <div id="map" style={{ height: '400px' }} className="mt-6 rounded-lg shadow-md"></div>
            <Filter onFilterChange={handleFilterChange} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSales.map(sale => (
                    <motion.div
                        key={sale.id}
                        className="relative p-6 transition duration-300 border border-gray-300 rounded-lg hover:shadow-lg"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Link to={`/stoopSale/${sale.id}`} className="block">
                            <div className={`absolute top-0 right-0 mt-2 mr-2 px-2 py-1 text-xs font-semibold text-white rounded ${getTagColor(sale.date)}`}>
                                {format(new Date(sale.date), 'MMM dd')}
                            </div>
                            <div className="mt-4">
                                <img src={getStaticMapUrl(sale.coordinates.latitude, sale.coordinates.longitude)} alt="Map" className="w-full h-auto rounded-lg shadow-md" />
                                {/* <button onClick={() => handleShowDirections(sale)} className="px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">Show Directions</button> */}
                            </div>
                            <div className="mb-2 text-lg font-semibold text-blue-600">
                                <FaShoppingBag className="inline-block mr-2 text-xl" /> {sale.title}
                            </div>
                            <p className="mb-2 text-gray-600">{sale.description}</p>
                            <div className="flex items-center mb-2 text-gray-600">
                                <FaCalendarAlt className="inline-block mr-2" /> {format(new Date(sale.date), 'MMM dd')} at {sale.time}
                            </div>
                            <div className="flex items-center mb-2 text-gray-600">
                                <FaMapMarkerAlt className="inline-block mr-2" /> {sale.location}
                            </div>
                            <div className="flex items-center text-xs text-gray-400">
                                <p>Posted by: {sale.organizer}</p>
                            </div>
                            
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StoopSale;