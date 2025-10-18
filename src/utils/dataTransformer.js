// Data transformation utility to convert apartment data into hotel structure
import hotelData from '../jsondata/hotel_knowledge_base.json';

// Transform apartment data into hotel management structure
export const transformHotelData = () => {
  // Group apartments by address to create "hotels"
  const hotelsMap = new Map();
  
  hotelData.forEach((apartment, index) => {
    const address = apartment['Unit address'];
    const unitCode = apartment['Unique Internal Unit Code'];
    const unitCategory = apartment['Unit Category'];
    
    // Create hotel key from address
    if (!hotelsMap.has(address)) {
      hotelsMap.set(address, {
        id: index + 1,
        name: address.split(',')[0], // Use street name as hotel name
        location: address.split(',').slice(1).join(',').trim(), // City, country
        fullAddress: address,
        blocks: new Map()
      });
    }
    
    const hotel = hotelsMap.get(address);
    
    // Create blocks based on unit category (or use a default block)
    const blockName = unitCategory || 'Main Building';
    
    if (!hotel.blocks.has(blockName)) {
      hotel.blocks.set(blockName, {
        id: hotel.blocks.size + 1,
        name: blockName,
        rooms: []
      });
    }
    
    const block = hotel.blocks.get(blockName);
    
    // Create room from apartment data
    const room = {
      roomNo: unitCode,
      type: unitCategory,
      status: 'Available', // Default status
      occupancy: apartment['Standard Occupancy'],
      maxOccupancy: apartment['Maximum Occupancy'],
      size: apartment['Unit Size (sqm)'],
      beds: apartment['Bed Type'],
      amenities: apartment['Standard Amenities (All Apartments)'],
      description: apartment['Apartment Description (Website)'],
      googleMaps: apartment['Google Maps Link (Exact Apartment Location)'],
      videoTour: apartment['INTERNAL: Apartment Video Tour'],
      floor: apartment['Apartment Floor'],
      view: apartment['Unit View'],
      heating: apartment['Heating'],
      airConditioning: apartment['Air Conditioning'],
      wifi: apartment['WiFi Details (Network Name & Password)'],
      parking: apartment['Parking (In-House)'],
      checkIn: apartment['Regular Check-in Hours'],
      checkOut: apartment['Regular Check-out Hours']
    };
    
    block.rooms.push(room);
  });
  
  // Convert Maps to Arrays
  const hotels = Array.from(hotelsMap.values()).map(hotel => ({
    ...hotel,
    blocks: Array.from(hotel.blocks.values())
  }));
  
  return hotels;
};

// Get all hotels
export const getAllHotels = () => {
  return transformHotelData();
};

// Get hotel by ID
export const getHotelById = (id) => {
  const hotels = getAllHotels();
  return hotels.find(hotel => hotel.id === parseInt(id));
};

// Get block by hotel ID and block ID
export const getBlockById = (hotelId, blockId) => {
  const hotel = getHotelById(hotelId);
  if (!hotel) return null;
  return hotel.blocks.find(block => block.id === parseInt(blockId));
};

// Get room by hotel ID, block ID, and room number
export const getRoomByNumber = (hotelId, blockId, roomNo) => {
  const block = getBlockById(hotelId, blockId);
  if (!block) return null;
  return block.rooms.find(room => room.roomNo === roomNo);
};

// Search hotels by name or location
export const searchHotels = (query) => {
  const hotels = getAllHotels();
  const lowercaseQuery = query.toLowerCase();
  
  return hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(lowercaseQuery) ||
    hotel.location.toLowerCase().includes(lowercaseQuery) ||
    hotel.fullAddress.toLowerCase().includes(lowercaseQuery)
  );
};

// Filter rooms by status
export const filterRoomsByStatus = (rooms, status) => {
  if (!status || status === 'All') return rooms;
  return rooms.filter(room => room.status === status);
};

// Filter rooms by type
export const filterRoomsByType = (rooms, type) => {
  if (!type || type === 'All') return rooms;
  return rooms.filter(room => room.type.toLowerCase().includes(type.toLowerCase()));
};

