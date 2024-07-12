import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { FaSignOutAlt } from 'react-icons/fa';
import Loading from '../components/Loading';

const Profile = () => {
    const { user, isAuthenticated, isLoading, logout, loginWithPopup } = useAuth0();

    if (isLoading) {
        return <Loading />;
    }

    return (
        isAuthenticated ? (
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md min-h-screen">
                <div className="flex flex-col items-center md:flex-row md:items-start md:space-x-6">
                    <img
                        src={user.picture}
                        alt={user.name}
                        className="w-24 h-24 rounded-full border-2 border-gray-200 mb-4 md:mb-0"
                    />
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-semibold text-gray-800">{user.name}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => logout({ returnTo: window.location.origin })}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
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
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none transition-all duration-300"
                    >
                        Register/Login
                    </button>
                </div>
            </div>
        )
    );
};

export default Profile;