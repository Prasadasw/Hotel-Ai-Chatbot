import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Users, Maximize2, Wifi, Car, Home, MapPin, Phone, Mail } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getRoomByNumber, getHotelById, getBlockById } from '../utils/dataTransformer';
import Chatbot from '../components/Chatbot/Chatbot';

const RoomDetails = () => {
  const { hotelId, blockId, roomNo } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [block, setBlock] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      // Decode the room number to handle URL-encoded characters (like spaces)
      const decodedRoomNo = decodeURIComponent(roomNo);
      
      const hotelData = getHotelById(hotelId);
      const blockData = getBlockById(hotelId, blockId);
      const roomData = getRoomByNumber(hotelId, blockId, decodedRoomNo);
      
      setHotel(hotelData);
      setBlock(blockData);
      setRoom(roomData);
      setIsLoading(false);
    }, 500);
  }, [hotelId, blockId, roomNo]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Room Not Found</h1>
          <p className="text-gray-600 mb-6">The room you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Room {room.roomNo}</h1>
              <p className="text-gray-600">{hotel?.name} - {block?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot Welcome Banner - MAIN FEATURE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-2xl p-8 text-white border-4 border-yellow-300 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                  🤖
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Your Virtual Room Assistant is Ready!</h2>
                  <p className="text-blue-100 text-lg">Ask me anything - I'm here 24/7!</p>
                </div>
              </div>
              <p className="text-blue-100 mb-6 text-lg">
                👉 <strong>Look at the bottom-right corner!</strong> The chatbot is already open and waiting for your questions. 
                Ask me about amenities, check-in/check-out times, WiFi, parking, room features, or anything else!
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white/30 rounded-full text-sm font-semibold backdrop-blur-sm">Ask about amenities</span>
                <span className="px-4 py-2 bg-white/30 rounded-full text-sm font-semibold backdrop-blur-sm">Check-in times</span>
                <span className="px-4 py-2 bg-white/30 rounded-full text-sm font-semibold backdrop-blur-sm">WiFi password</span>
                <span className="px-4 py-2 bg-white/30 rounded-full text-sm font-semibold backdrop-blur-sm">Parking info</span>
                <span className="px-4 py-2 bg-white/30 rounded-full text-sm font-semibold backdrop-blur-sm">Room features</span>
                <span className="px-4 py-2 bg-white/30 rounded-full text-sm font-semibold backdrop-blur-sm">Contact support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Room Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Room Status</p>
                  <p className={`text-2xl font-bold mt-1 ${
                    room.status === 'Available' ? 'text-green-600' :
                    room.status === 'Occupied' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {room.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Room Type</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{room.type}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {room.description && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Room</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{room.description}</p>
              </div>
            )}

            {/* Room Features */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Room Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-semibold text-gray-900">{room.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Occupancy</p>
                    <p className="font-semibold text-gray-900">{room.occupancy} (Max: {room.maxOccupancy})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Floor</p>
                    <p className="font-semibold text-gray-900">{room.floor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">View</p>
                    <p className="font-semibold text-gray-900">{room.view}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {room.amenities && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {room.amenities.split(',').map((amenity, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {amenity.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Beds */}
            {room.beds && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Beds</h2>
                <p className="text-gray-700 whitespace-pre-line">{room.beds}</p>
              </div>
            )}

            {/* Check-in/Check-out */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Check-in & Check-out</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Check-in Time</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{room.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out Time</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{room.checkOut}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code & Actions */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Room QR Code</h2>
              <div className="bg-gray-50 rounded-lg p-4 flex justify-center mb-4">
                <QRCodeSVG
                  value={window.location.href}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Scan this QR code to share this room page
              </p>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">+43 1 3943941</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">office@sky9-apartments.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{hotel?.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  Request Service
                </button>
                <button className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium">
                  View Map
                </button>
                <button className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot room={room} hotel={hotel} block={block} />
    </div>
  );
};

export default RoomDetails;

