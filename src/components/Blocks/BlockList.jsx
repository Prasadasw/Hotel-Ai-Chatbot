import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, DoorOpen, Search } from 'lucide-react';
import { getHotelById } from '../../utils/dataTransformer';

const BlockList = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const data = getHotelById(hotelId);
      setHotel(data);
      setIsLoading(false);
    }, 500);
  }, [hotelId]);

  const handleBlockClick = (blockId) => {
    navigate(`/hotels/${hotelId}/blocks/${blockId}/rooms`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Hotel not found</p>
        <button
          onClick={() => navigate('/hotels')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Hotels
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/hotels')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
          <p className="text-gray-600 mt-1">{hotel.location}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Blocks</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{hotel.blocks.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {hotel.blocks.reduce((acc, block) => acc + block.rooms.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DoorOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Rooms</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {hotel.blocks.reduce((acc, block) => 
                  acc + block.rooms.filter(room => room.status === 'Available').length, 0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DoorOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Blocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotel.blocks.map((block) => (
          <div
            key={block.id}
            onClick={() => handleBlockClick(block.id)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {block.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Block ID: {block.id}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Total Rooms</p>
                  <p className="text-lg font-semibold text-gray-900">{block.rooms.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Available</p>
                  <p className="text-lg font-semibold text-green-600">
                    {block.rooms.filter(room => room.status === 'Available').length}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">View Rooms</span>
                  <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition-transform rotate-180" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockList;

