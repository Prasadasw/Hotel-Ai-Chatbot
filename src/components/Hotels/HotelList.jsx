import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, ArrowRight, Search, Filter } from 'lucide-react';
import { getAllHotels, searchHotels } from '../../utils/dataTransformer';

const HotelList = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const data = getAllHotels();
      setHotels(data);
      setFilteredHotels(data);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredHotels(hotels);
    } else {
      const results = searchHotels(query);
      setFilteredHotels(results);
    }
  };

  const handleHotelClick = (hotelId) => {
    navigate(`/hotels/${hotelId}/blocks`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotels</h1>
          <p className="text-gray-600 mt-1">
            Manage all your hotel properties and locations
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Add New Hotel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hotels</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{hotels.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Blocks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {hotels.reduce((acc, hotel) => acc + hotel.blocks.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {hotels.reduce((acc, hotel) => 
                  acc + hotel.blocks.reduce((blockAcc, block) => 
                    blockAcc + block.rooms.length, 0
                  ), 0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search hotels by name or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Hotel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hotels found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery ? 'Try adjusting your search' : 'Add your first hotel to get started'}
            </p>
          </div>
        ) : (
          filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => handleHotelClick(hotel.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{hotel.location}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Blocks</p>
                    <p className="text-lg font-semibold text-gray-900">{hotel.blocks.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rooms</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {hotel.blocks.reduce((acc, block) => acc + block.rooms.length, 0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-600">View Details</span>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HotelList;

