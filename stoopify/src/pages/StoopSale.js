// StoopSale.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../db/Firebase';
import Filter from '../components/Filter';

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

    return (
        <div className="max-w-6xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
            <h1 className="mb-6 text-3xl font-bold text-center">Stoop Sales</h1>
            <Filter onFilterChange={handleFilterChange} /> {/* Add Filter component */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSales.map(sale => (
                    <div key={sale.id} className="p-6 transition duration-300 border border-gray-300 rounded-lg hover:shadow-lg">
                        <Link to={`/stoopSale/${sale.id}`}>
                            <h2 className="mb-2 text-lg font-semibold text-blue-600">{sale.title}</h2>
                            <p className="mb-2 text-gray-600">{sale.description}</p>
                            <p className="text-gray-600">{sale.date} at {sale.time}</p>
                            <p className="text-gray-600">{sale.location}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoopSale;