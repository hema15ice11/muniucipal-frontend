import { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Calendar, Building, Clock, Filter, X } from 'lucide-react';
import UserNavbar from './UserNavbar';

const DailyActivities = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/daily-updates');
            setActivities(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    // Filter activities based on selected date
    const filteredActivities = selectedDate
        ? activities.filter(act =>
            new Date(act.date).toISOString().split('T')[0] === selectedDate
        )
        : activities;

    // Get unique dates for quick selection
    const uniqueDates = [...new Set(activities
        .map(act => act.date)
        .sort((a, b) => new Date(b) - new Date(a))
        .map(date => new Date(date).toISOString().split('T')[0])
    )];

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Clear date filter
    const clearFilter = () => {
        setSelectedDate('');
        setShowDatePicker(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <UserNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">Daily Municipal Activities</h1>
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Stay updated with the latest work and developments happening in your municipality
                    </p>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                            <Filter className="h-5 w-5 text-gray-600" />
                            <span className="font-medium text-gray-700">Filter by Date:</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Date Picker */}
                            <div className="relative">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    {selectedDate && (
                                        <button
                                            onClick={clearFilter}
                                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                            title="Clear filter"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Quick Date Selection */}
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600 whitespace-nowrap">Quick select:</span>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setSelectedDate('')}
                                        className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                                            !selectedDate
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        All Dates
                                    </button>
                                    {uniqueDates.slice(0, 3).map(date => (
                                        <button
                                            key={date}
                                            onClick={() => setSelectedDate(date)}
                                            className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                                                selectedDate === date
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {new Date(date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selected Date Display */}
                    {selectedDate && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-green-600" />
                                    <span className="text-green-800 font-medium">
                    Showing activities for {formatDate(selectedDate)}
                  </span>
                                </div>
                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                  {filteredActivities.length} activity{filteredActivities.length !== 1 ? 'ies' : ''}
                </span>
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    // Loading State
                    <div className="flex justify-center items-center py-16">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading activities...</p>
                        </div>
                    </div>
                ) : filteredActivities.length === 0 ? (
                    // Empty State
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Found</h3>
                        <p className="text-gray-600 mb-4">
                            {selectedDate
                                ? `No activities found for ${formatDate(selectedDate)}.`
                                : "There are no activities available yet."}
                        </p>
                        {selectedDate && (
                            <button
                                onClick={clearFilter}
                                className="text-green-600 hover:text-green-700 font-medium"
                            >
                                View all activities
                            </button>
                        )}
                    </div>
                ) : (
                    // Activities Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {filteredActivities.map((act) => (
                            <div
                                key={act._id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-green-200 group"
                            >
                                {/* Image Section */}
                                {act.image && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={`http://localhost:5000${act.image}`}
                                            alt={act.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-4 left-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        {act.department}
                      </span>
                                        </div>
                                    </div>
                                )}

                                {/* Content Section */}
                                <div className="p-5">
                                    {/* Department and Date */}
                                    <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {act.department}
                    </span>
                                        <div className="flex items-center space-x-1 text-gray-500 text-xs">
                                            <Calendar className="h-3 w-3" />
                                            <span>{new Date(act.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Title and Description */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {act.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {act.description}
                                    </p>

                                    {/* Additional Info */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center space-x-1 text-gray-400 text-xs">
                                            <Clock className="h-3 w-3" />
                                            <span>Updated recently</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Footer */}
                {/*{!loading && filteredActivities.length > 0 && (*/}
                {/*    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">*/}
                {/*        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">*/}
                {/*            <div className="p-4">*/}
                {/*                <div className="text-2xl font-bold text-green-600 mb-1">*/}
                {/*                    {filteredActivities.length}*/}
                {/*                </div>*/}
                {/*                <div className="text-gray-600">*/}
                {/*                    {selectedDate ? 'Activities on this date' : 'Total Activities'}*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="p-4">*/}
                {/*                <div className="text-2xl font-bold text-blue-600 mb-1">*/}
                {/*                    {new Set(filteredActivities.map(act => act.department)).size}*/}
                {/*                </div>*/}
                {/*                <div className="text-gray-600">Departments Involved</div>*/}
                {/*            </div>*/}
                {/*            <div className="p-4">*/}
                {/*                <div className="text-2xl font-bold text-purple-600 mb-1">*/}
                {/*                    {selectedDate ? '1' : new Set(filteredActivities.map(act =>*/}
                {/*                        new Date(act.date).toISOString().split('T')[0]*/}
                {/*                    )).size}*/}
                {/*                </div>*/}
                {/*                <div className="text-gray-600">*/}
                {/*                    {selectedDate ? 'Selected Date' : 'Active Dates'}*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}
            </main>
        </div>
    );
};

export default DailyActivities;