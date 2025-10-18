import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2 } from 'lucide-react';

const Chatbot = ({ room, hotel, block }) => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: `Hello! 👋 I'm your virtual assistant for Room ${room?.roomNo}. I can help you with information about amenities, check-in/check-out, services, and more. What would you like to know?`,
      timestamp: new Date()
    }
  ]);

  const quickQuestions = [
    'What are the check-in times?',
    'Tell me about amenities',
    'What is the WiFi password?',
    'Is parking available?',
    'What is the room size?',
    'How many guests can stay?',
    'Contact information?',
    'What floor is the room on?'
  ];
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true); // Open by default
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Check-in/Check-out
    if (message.includes('check in') || message.includes('check-in') || message.includes('arrival')) {
      return `Check-in time is ${room?.checkIn || '14:00'}. You can arrive anytime after this time. For early check-in, please contact the office.`;
    }
    
    if (message.includes('check out') || message.includes('check-out') || message.includes('departure')) {
      return `Check-out time is ${room?.checkOut || '11:00'}. Please ensure you vacate the room by this time. Late check-out may be available upon request.`;
    }
    
    // Amenities
    if (message.includes('amenities') || message.includes('amenity') || message.includes('features')) {
      return `Your room includes: ${room?.amenities || 'Wi-Fi, Kitchen, TV, Heating, Towels and Linens, Toiletries'}. Is there anything specific you'd like to know about?`;
    }
    
    // WiFi
    if (message.includes('wifi') || message.includes('internet') || message.includes('wlan')) {
      if (room?.wifi) {
        return `WiFi details: ${room.wifi}. You can connect immediately upon arrival.`;
      }
      return `Free high-speed WiFi is available in your room. Network details are provided in the room.`;
    }
    
    // Parking
    if (message.includes('parking') || message.includes('car') || message.includes('vehicle')) {
      if (room?.parking) {
        return `Parking is available: ${room.parking}. Please contact the office for parking reservation.`;
      }
      return `Parking information is available at the front desk. Please inquire about availability and rates.`;
    }
    
    // Room size
    if (message.includes('size') || message.includes('sqm') || message.includes('square')) {
      return `Your room is ${room?.size || '40 m²'}. It's spacious and comfortable for ${room?.occupancy || '2 guests'}.`;
    }
    
    // Capacity
    if (message.includes('capacity') || message.includes('guests') || message.includes('people') || message.includes('occupancy')) {
      return `Standard occupancy: ${room?.occupancy || '2 guests'}. Maximum occupancy: ${room?.maxOccupancy || '4 guests'}.`;
    }
    
    // Beds
    if (message.includes('bed') || message.includes('sleep') || message.includes('mattress')) {
      if (room?.beds) {
        return `Bed configuration: ${room.beds}. All beds are comfortable and ready for your stay.`;
      }
      return `Your room has comfortable beds ready for your arrival. Bed linens are provided.`;
    }
    
    // Heating/AC
    if (message.includes('heating') || message.includes('heat') || message.includes('temperature')) {
      if (room?.heating === 'Yes') {
        return `Heating is available in your room. You can control the temperature using the thermostat.`;
      }
      return `Climate control is available in your room. Please check the instructions provided.`;
    }
    
    if (message.includes('air conditioning') || message.includes('ac') || message.includes('cooling')) {
      if (room?.airConditioning === 'Yes') {
        return `Air conditioning is available in your room for your comfort during warmer months.`;
      }
      return `Your room has climate control options. Please check the room instructions for details.`;
    }
    
    // Services
    if (message.includes('service') || message.includes('help') || message.includes('assistance') || message.includes('support')) {
      return `I'm here to help! You can ask me about amenities, check-in/out times, or contact the office at +43 1 3943941 or office@sky9-apartments.com for additional assistance.`;
    }
    
    if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return `Office Phone: +43 1 3943941\nEmail: office@sky9-apartments.com\nOffice Hours: Monday-Friday, 9 AM - 6 PM\nFor emergencies outside office hours, please call the emergency number provided in your welcome email.`;
    }
    
    // Location
    if (message.includes('location') || message.includes('address') || message.includes('where')) {
      return `You're at ${hotel?.name}, ${hotel?.location}. The exact address is provided in your booking confirmation.`;
    }
    
    // View
    if (message.includes('view') || message.includes('window') || message.includes('balcony')) {
      if (room?.view) {
        return `Your room offers: ${room.view}. Enjoy the beautiful scenery!`;
      }
      return `Your room has a pleasant view. Check the room description for more details.`;
    }
    
    // Floor
    if (message.includes('floor') || message.includes('level') || message.includes('elevator')) {
      if (room?.floor) {
        return `Your room is on ${room.floor}. The building has an elevator for easy access.`;
      }
      return `Elevator access is available in the building for your convenience.`;
    }
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello! 👋 How can I assist you with your stay in Room ${room?.roomNo}?`;
    }
    
    // Thanks
    if (message.includes('thank') || message.includes('thanks')) {
      return `You're welcome! 😊 Is there anything else I can help you with?`;
    }
    
    // Default response
    return `I can help you with information about check-in/check-out times, amenities, room features, parking, WiFi, and more. What specific information are you looking for?`;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(input);
  };

  const sendMessage = (messageText) => {
    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = {
        role: 'bot',
        content: getBotResponse(messageText),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 flex items-center justify-center animate-pulse"
        >
          <Bot className="w-10 h-10" />
        </button>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
          1
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-[450px] bg-white rounded-xl shadow-2xl z-50 transition-all duration-300 border-2 border-blue-200 ${
      isMinimized ? 'h-16' : 'h-[650px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-5 rounded-t-xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-lg">🤖 Room Assistant</h3>
            <p className="text-xs text-blue-100">Room {room?.roomNo} - Always here to help!</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {msg.role === 'bot' && (
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600">Assistant</span>
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="flex items-center gap-2 mb-1 justify-end">
                      <span className="text-xs font-semibold text-blue-100">You</span>
                      <User className="w-4 h-4 text-blue-100" />
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Always Visible */}
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2 font-medium">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="💬 Ask me anything about your room..."
                className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default Chatbot;

