import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../db/Firebase';
import Filter from '../components/Filter';
import { FaCalendarAlt, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import { format, isToday, isPast } from 'date-fns';
import { motion } from 'framer-motion';

const StoopSale = () => {
    const [stoopSales, setStoopSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);

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

    return (
        <div className="max-w-6xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
            <h1 className="mb-6 text-3xl font-bold text-center">Stoop Sales</h1>
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