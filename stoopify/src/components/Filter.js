import React, { useState } from 'react';

const Filter = ({ onFilterChange }) => {
    const [city, setCity] = useState('');
    const [sortBy, setSortBy] = useState('date');

    const handleFilterChange = () => {
        onFilterChange({ city, sortBy });
    };

    return (
        <div className="flex flex-col items-center justify-between mb-4 space-y-4 sm:flex-row sm:space-y-0">
            <input
                type="text"
                placeholder="Filter by city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg sm:w-auto"
            />
            <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg sm:w-auto"
            >
                <option value="date">Sort by Date</option>
                <option value="location">Sort by Location</option>
            </select>
            <button
                onClick={handleFilterChange}
                className="w-full p-2 text-white bg-blue-500 rounded-lg sm:w-auto"
            >
                Apply Filters
            </button>
        </div>
    );
};

export default Filter;