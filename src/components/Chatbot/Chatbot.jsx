import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Minimize2, Sparkles, MessageSquare } from 'lucide-react';

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
  const [isTyping, setIsTyping] = useState(false);
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
    setIsTyping(true);

    // Simulate bot thinking with typing animation
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = {
        role: 'bot',
        content: getBotResponse(messageText),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 800);
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-110 flex items-center justify-center"
        >
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-blue-500 animate-pulse opacity-30"></div>
          
          {/* Bot icon with glow effect */}
          <div className="relative z-10">
            <Bot className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform" />
          </div>
          
          {/* Sparkle effect */}
          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
        </button>
        
        {/* Notification badge */}
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-bounce">
          <MessageSquare className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-[450px] max-w-[450px] bg-white rounded-2xl shadow-2xl z-50 transition-all duration-300 border-2 border-blue-200 overflow-hidden ${
      isMinimized ? 'h-16' : 'h-[calc(100vh-8rem)] md:h-[650px] max-h-[650px]'
    }`}>
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-4 md:p-5 rounded-t-2xl flex items-center justify-between shadow-lg overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 relative z-10">
          <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
            <Bot className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
          </div>
          <div>
            <h3 className="font-bold text-base md:text-lg flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Room Assistant
            </h3>
            <p className="text-xs text-blue-100 hidden md:block">Room {room?.roomNo} - Always here to help!</p>
            <p className="text-xs text-blue-100 md:hidden">Room {room?.roomNo}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2 relative z-10">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-lg transition-all hover:scale-110 active:scale-95"
            aria-label="Minimize"
          >
            <Minimize2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-all hover:scale-110 active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 shadow-sm transition-all hover:shadow-md ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {msg.role === 'bot' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
                    </div>
                  )}
                  {msg.role === 'user' && (
                    <div className="flex items-center gap-2 mb-2 justify-end">
                      <span className="text-xs font-semibold text-blue-100">You</span>
                      <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  )}
                  <p className="text-sm md:text-base whitespace-pre-line leading-relaxed">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-blue-600">AI Assistant</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions - Scrollable on Mobile */}
          <div className="px-3 md:px-4 py-3 bg-white border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              Quick Questions:
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-medium hover:from-blue-100 hover:to-indigo-100 transition-all whitespace-nowrap border border-blue-200 hover:border-blue-300 hover:scale-105 active:scale-95 shadow-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 md:p-4 border-t-2 border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="💬 Ask me anything..."
                className="flex-1 px-4 py-3 md:py-3.5 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm text-sm md:text-base transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="px-5 md:px-6 py-3 md:py-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
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

