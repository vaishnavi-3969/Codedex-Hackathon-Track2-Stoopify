import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { getFirestore, collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { app } from '../db/Firebase';

const StoopSale = () => {
    const [stoopSales, setStoopSales] = useState([]);

    useEffect(() => {
        const fetchStoopSales = async () => {
            const db = getFirestore(app);
            const stoopSalesSnapshot = await getDocs(collection(db, 'stoopSales'));
            const stoopSalesData = stoopSalesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStoopSales(stoopSalesData);
        };

        fetchStoopSales();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Stoop Sales</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stoopSales.map(sale => (
                    <div key={sale.id} className="border border-gray-300 p-4 rounded-lg transition duration-300 hover:shadow-md">
                        <Link to={`/stoopSale/${sale.id}`}>
                            <h2 className="text-lg font-semibold mb-2">{sale.title}</h2>
                            <p className="text-gray-600 mb-2">{sale.description}</p>
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