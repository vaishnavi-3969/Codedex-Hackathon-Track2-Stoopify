import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaSignOutAlt } from 'react-icons/fa';
import Loading from '../components/Loading';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../db/Firebase';

const Profile = () => {
    const { user, isAuthenticated, isLoading, logout, loginWithPopup } = useAuth0();
    const [userSales, setUserSales] = useState([]);

    useEffect(() => {
        const fetchUserSales = async () => {
            if (isAuthenticated) {
                const db = getFirestore(app);
                const q = query(collection(db, 'stoopSales'), where('organizerEmail', '==', user.email));
                const querySnapshot = await getDocs(q);
                const salesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUserSales(salesData);
            }
        };

        fetchUserSales();
    }, [isAuthenticated, user]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        isAuthenticated ? (
            <div className="max-w-4xl min-h-screen p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
                <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
                    <img
                        src={user.picture}
                        alt={user.name}
                        className="w-24 h-24 mb-4 border-2 border-gray-200 rounded-full md:mb-0"
                    />
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-semibold text-gray-800">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="text-gray-800">
                            <h3 className="text-lg font-semibold">Given Name</h3>
                            <p className="text-gray-600">{user.given_name}</p>
                        </div>
                        <div className="text-gray-800">
                            <h3 className="text-lg font-semibold">Family Name</h3>
                            <p className="text-gray-600">{user.family_name}</p>
                        </div>
                        <div className="text-gray-800">
                            <h3 className="text-lg font-semibold">Updated At</h3>
                            <p className="text-gray-600">{new Date(user.updated_at).toLocaleString()}</p>
                        </div>
                        <div className="text-gray-800">
                            <h3 className="text-lg font-semibold">Email Verified</h3>
                            <p className="text-gray-600">{user.email_verified ? "Yes" : "No"}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <h3 className="text-2xl font-semibold text-gray-800">Your Sales</h3>
                    {userSales.length > 0 ? (
                        <ul className="mt-4">
                            {userSales.map(sale => (
                                <li key={sale.id} className="p-4 mb-4 border rounded-lg">
                                    <h4 className="text-xl font-semibold text-blue-600">{sale.title}</h4>
                                    <p className="text-gray-600">{sale.description}</p>
                                    <p className="text-gray-600">Date: {new Date(sale.date).toLocaleDateString()}</p>
                                    <p className="text-gray-600">Time: {sale.time}</p>
                                    <p className="text-gray-600">Location: {sale.location}</p>
                                    <p className="text-gray-600">Items: {sale.items}</p>
                                    <p className="text-gray-600">RSVPs: {sale.rsvps.length}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You haven't posted any sales yet.</p>
                    )}
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => logout({ returnTo: window.location.origin })}
                        className="flex items-center px-4 py-2 text-white transition-all duration-300 bg-red-500 rounded-lg hover:bg-red-600"
                    >
                        <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
                <p className="text-gray-600">Log in to view profile</p>
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

export default Profile;