import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Share2, QrCode as QrCodeIcon } from 'lucide-react';
import { getAllHotels } from '../utils/dataTransformer';

const QRManagement = () => {
  const [selectedHotel, setSelectedHotel] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [qrData, setQrData] = useState('');
  const [displayMode, setDisplayMode] = useState('single'); // 'single' or 'bulk'

  const hotels = getAllHotels();

  const handleHotelChange = (e) => {
    setSelectedHotel(e.target.value);
    setSelectedBlock('');
    setSelectedRoom('');
    setQrData('');
  };

  const handleBlockChange = (e) => {
    setSelectedBlock(e.target.value);
    setSelectedRoom('');
    setQrData('');
  };

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
    const hotel = hotels.find(h => h.id === parseInt(selectedHotel));
    const block = hotel?.blocks.find(b => b.id === parseInt(selectedBlock));
    const room = block?.rooms.find(r => r.roomNo === e.target.value);
    
    if (hotel && block && room) {
      // Create a functional URL that can be scanned and opened
      // URL-encode the room number to handle spaces and special characters
      const baseUrl = window.location.origin;
      const encodedRoomNo = encodeURIComponent(room.roomNo);
      const roomUrl = `${baseUrl}/room/${hotel.id}/${block.id}/${encodedRoomNo}`;
      setQrData(roomUrl);
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `QR-${selectedRoom}.png`;
        link.href = url;
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const printQR = () => {
    window.print();
  };

  const generateBulkQR = () => {
    // This would generate QR codes for all rooms
    // For now, just show a message
    alert('Bulk QR generation feature coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">QR Code Management</h1>
          <p className="text-gray-600 mt-1">
            Generate and manage QR codes for your hotel rooms
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDisplayMode('single')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              displayMode === 'single'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Single QR
          </button>
          <button
            onClick={() => setDisplayMode('bulk')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              displayMode === 'bulk'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bulk Generate
          </button>
        </div>
      </div>

      {/* Selection Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Room</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel
            </label>
            <select
              value={selectedHotel}
              onChange={handleHotelChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Block
            </label>
            <select
              value={selectedBlock}
              onChange={handleBlockChange}
              disabled={!selectedHotel}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a block</option>
              {selectedHotel &&
                hotels
                  .find((h) => h.id === parseInt(selectedHotel))
                  ?.blocks.map((block) => (
                    <option key={block.id} value={block.id}>
                      {block.name}
                    </option>
                  ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room
            </label>
            <select
              value={selectedRoom}
              onChange={handleRoomChange}
              disabled={!selectedBlock}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Select a room</option>
              {selectedBlock &&
                hotels
                  .find((h) => h.id === parseInt(selectedHotel))
                  ?.blocks.find((b) => b.id === parseInt(selectedBlock))
                  ?.rooms.map((room) => (
                    <option key={room.roomNo} value={room.roomNo}>
                      Room {room.roomNo} - {room.type}
                    </option>
                  ))}
            </select>
          </div>
        </div>
      </div>

      {/* QR Code Display */}
      {qrData && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* QR Code */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated QR Code</h2>
              <div className="flex justify-center bg-gray-50 rounded-lg p-8">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={qrData}
                  size={300}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            {/* Details and Actions */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Room Information</h3>
                <div className="space-y-2">
                  <div className="py-2 border-b border-gray-200">
                    <span className="text-gray-600 text-sm block mb-1">QR URL:</span>
                    <span className="font-mono text-xs text-blue-600 break-all">{qrData}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Room Number:</span>
                    <span className="font-medium text-gray-900">{selectedRoom}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Hotel:</span>
                    <span className="font-medium text-gray-900">
                      {hotels.find((h) => h.id === parseInt(selectedHotel))?.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Block:</span>
                    <span className="font-medium text-gray-900">
                      {hotels
                        .find((h) => h.id === parseInt(selectedHotel))
                        ?.blocks.find((b) => b.id === parseInt(selectedBlock))?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={downloadQR}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={printQR}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Print</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">QR Code Usage</h4>
                <p className="text-sm text-blue-800">
                  This QR code contains a unique URL that opens room information when scanned. 
                  Guests can scan it with their phone camera to instantly view room details, amenities, 
                  check-in/check-out times, and access digital resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Generation */}
      {displayMode === 'bulk' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <QrCodeIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bulk QR Generation</h2>
              <p className="text-sm text-gray-600">Generate QR codes for multiple rooms at once</p>
            </div>
          </div>

          {selectedHotel && selectedBlock ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                Generate QR codes for all rooms in{' '}
                <span className="font-semibold">
                  {hotels.find((h) => h.id === parseInt(selectedHotel))?.name} -{' '}
                  {hotels
                    .find((h) => h.id === parseInt(selectedHotel))
                    ?.blocks.find((b) => b.id === parseInt(selectedBlock))?.name}
                </span>
              </p>
              <button
                onClick={generateBulkQR}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Generate All QR Codes
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <QrCodeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Please select a hotel and block to generate bulk QR codes</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use QR Codes</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Select a hotel, block, and room from the dropdown menus above</li>
          <li>The QR code will be automatically generated with a unique URL for the selected room</li>
          <li>Download or print the QR code to place it in the room</li>
          <li>Guests can scan the QR code with their phone camera to instantly open room information</li>
          <li>The QR code contains a direct link to room details, amenities, and digital resources</li>
          <li>Use bulk generation to create QR codes for multiple rooms at once</li>
        </ol>
      </div>
    </div>
  );
};

export default QRManagement;

