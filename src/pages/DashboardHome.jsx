import { Link } from 'react-router-dom';
import { Building2, Blocks, DoorOpen, QrCode, TrendingUp, Users, Calendar } from 'lucide-react';
import { getAllHotels } from '../utils/dataTransformer';
import { useState, useEffect } from 'react';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalBlocks: 0,
    totalRooms: 0,
    availableRooms: 0
  });

  useEffect(() => {
    const hotels = getAllHotels();
    const totalHotels = hotels.length;
    const totalBlocks = hotels.reduce((acc, hotel) => acc + hotel.blocks.length, 0);
    const totalRooms = hotels.reduce((acc, hotel) => 
      acc + hotel.blocks.reduce((blockAcc, block) => blockAcc + block.rooms.length, 0), 0
    );
    const availableRooms = hotels.reduce((acc, hotel) => 
      acc + hotel.blocks.reduce((blockAcc, block) => 
        blockAcc + block.rooms.filter(room => room.status === 'Available').length, 0
      ), 0
    );

    setStats({ totalHotels, totalBlocks, totalRooms, availableRooms });
  }, []);

  const quickActions = [
    {
      title: 'Manage Hotels',
      description: 'View and manage all hotel properties',
      icon: Building2,
      color: 'blue',
      link: '/hotels'
    },
    {
      title: 'View Blocks',
      description: 'Browse all building blocks',
      icon: Blocks,
      color: 'green',
      link: '/blocks'
    },
    {
      title: 'Manage Rooms',
      description: 'Access room management',
      icon: DoorOpen,
      color: 'purple',
      link: '/rooms'
    },
    {
      title: 'QR Management',
      description: 'Generate and manage QR codes',
      icon: QrCode,
      color: 'orange',
      link: '/qr-management'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to HotelPro</h1>
        <p className="text-blue-100">Manage your hotel properties efficiently with our comprehensive dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Hotels</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalHotels}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Active
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Blocks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBlocks}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Active
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <Blocks className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rooms</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalRooms}</p>
              <p className="text-xs text-gray-500 mt-1">All rooms</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
              <DoorOpen className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Rooms</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.availableRooms}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalRooms > 0 
                  ? `${Math.round((stats.availableRooms / stats.totalRooms) * 100)}% available`
                  : '0% available'
                }
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
              <DoorOpen className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600'
            };
            
            return (
              <Link
                key={action.title}
                to={action.link}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow group"
              >
                <div className={`w-12 h-12 ${colorClasses[action.color]} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  Get Started
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">System Initialized</p>
              <p className="text-xs text-gray-500 mt-1">Hotel management system is ready to use</p>
              <p className="text-xs text-gray-400 mt-2">Just now</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <DoorOpen className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Data Loaded</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalHotels} hotels, {stats.totalBlocks} blocks, and {stats.totalRooms} rooms loaded successfully
              </p>
              <p className="text-xs text-gray-400 mt-2">Just now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

