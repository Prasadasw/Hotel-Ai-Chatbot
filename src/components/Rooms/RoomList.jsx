import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, DoorOpen, Users, Maximize2, Wifi, Car } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getBlockById, getHotelById } from '../../utils/dataTransformer';

const RoomList = () => {
  const { hotelId, blockId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [block, setBlock] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const hotelData = getHotelById(hotelId);
      const blockData = getBlockById(hotelId, blockId);
      setHotel(hotelData);
      setBlock(blockData);
      setIsLoading(false);
    }, 500);
  }, [hotelId, blockId]);

  const filteredRooms = filterStatus === 'All' 
    ? block?.rooms || []
    : block?.rooms.filter(room => room.status === filterStatus) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="text-center py-12">
        <DoorOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Block not found</p>
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
          onClick={() => navigate(`/hotels/${hotelId}/blocks`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{block.name}</h1>
          <p className="text-gray-600 mt-1">{hotel?.name} - {hotel?.location}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Rooms</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{block.rooms.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {block.rooms.filter(r => r.status === 'Available').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Occupied</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {block.rooms.filter(r => r.status === 'Occupied').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Maintenance</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {block.rooms.filter(r => r.status === 'Maintenance').length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('All')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Rooms
          </button>
          <button
            onClick={() => setFilterStatus('Available')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'Available'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setFilterStatus('Occupied')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'Occupied'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Occupied
          </button>
          <button
            onClick={() => setFilterStatus('Maintenance')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'Maintenance'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.roomNo}
            onClick={() => setSelectedRoom(room)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="p-4">
              {/* QR Code */}
              <div className="flex justify-center mb-4 bg-gray-50 rounded-lg p-3">
                <QRCodeSVG
                  value={`${window.location.origin}/room/${hotel?.id}/${block.id}/${encodeURIComponent(room.roomNo)}`}
                  size={120}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Room Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Room {room.roomNo}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    room.status === 'Available' ? 'bg-green-100 text-green-800' :
                    room.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {room.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{room.type}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{room.occupancy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize2 className="w-4 h-4" />
                    <span>{room.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                  {room.wifi && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      <Wifi className="w-3 h-3 inline mr-1" />
                      WiFi
                    </span>
                  )}
                  {room.parking && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      <Car className="w-3 h-3 inline mr-1" />
                      Parking
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Room {selectedRoom.roomNo} Details
                </h2>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                    <QRCodeSVG
                      value={`${window.location.origin}/room/${hotel?.id}/${block.id}/${encodeURIComponent(selectedRoom.roomNo)}`}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Room Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room Number:</span>
                        <span className="font-medium">{selectedRoom.roomNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedRoom.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          selectedRoom.status === 'Available' ? 'text-green-600' :
                          selectedRoom.status === 'Occupied' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {selectedRoom.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{selectedRoom.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Floor:</span>
                        <span className="font-medium">{selectedRoom.floor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">View:</span>
                        <span className="font-medium">{selectedRoom.view}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Occupancy</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Standard:</span>
                        <span className="font-medium">{selectedRoom.occupancy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maximum:</span>
                        <span className="font-medium">{selectedRoom.maxOccupancy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Amenities</h3>
                    <p className="text-sm text-gray-600">{selectedRoom.amenities}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Beds</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{selectedRoom.beds}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Check-in/Check-out</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{selectedRoom.checkIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">{selectedRoom.checkOut}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoom.heating === 'Yes' && (
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Heating</span>
                      )}
                      {selectedRoom.airConditioning === 'Yes' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">AC</span>
                      )}
                      {selectedRoom.wifi && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">WiFi</span>
                      )}
                      {selectedRoom.parking && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Parking</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Actions</h3>
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Edit Room
                      </button>
                      <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        View Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;

