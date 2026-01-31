import React, { useState } from 'react';
import { MapPin, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const VenueApproval = () => {
  
  const [mapExpanded, setMapExpanded] = useState(false);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [detailedMessage, setDetailedMessage] = useState('');
  const [requestChanges, setRequestChanges] = useState({
    images: false,
    pricing: false,
    capacity: false,
    address: false
  });

  const amenities = [
    { name: 'Parking Available', icon: '🚗' },
    { name: 'Sound System', icon: '🎵' },
    { name: 'Catering Options', icon: '🍴' },
    { name: 'Air Conditioning', icon: '❄️' },
    { name: 'Stage Available', icon: '🎭' }
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1519167758481-83f29da8fd8c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop'
  ];

  const calendarDays = [
    { day: 1, status: 'pending' },
    { day: 2, status: 'booked' },
    { day: 3, status: 'pending' },
    { day: 4, status: 'available' },
    { day: 5, status: 'available' },
    { day: 6, status: 'available' },
    { day: 7, status: 'available' },
    { day: 8, status: 'available' },
    { day: 9, status: 'available' },
    { day: 10, status: 'available' },
    { day: 11, status: 'available' },
    { day: 12, status: 'available' },
    { day: 13, status: 'available' },
    { day: 14, status: 'available' },
    { day: 15, status: 'booked' },
    { day: 16, status: 'pending' },
    { day: 17, status: 'available' },
    { day: 18, status: 'available' },
    { day: 19, status: 'available' },
    { day: 20, status: 'available' },
    { day: 21, status: 'available' },
    { day: 22, status: 'available' },
    { day: 23, status: 'available' },
    { day: 24, status: 'available' },
    { day: 25, status: 'pending' },
    { day: 26, status: 'booked' },
    { day: 27, status: 'available' },
    { day: 28, status: 'available' },
    { day: 29, status: 'available' },
    { day: 30, status: 'pending' },
    { day: 31, status: 'available' }
  ];

  const getCalendarColor = (status) => {
    switch(status) {
      case 'available':
        return 'bg-[#3CCF911A] text-gray-900';
      case 'booked':
        return 'bg-[#FF5A5A1A] text-gray-900';
      case 'pending':
        return 'bg-[#FACC151A] text-gray-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  return (
    <div className="min-h-screen mt-[84px]">
      <div className="">
        {/* Header */}
        <div className="bg-[#B74140] rounded-t-2xl border border-[#E5E7EB] p-8 mb-0">
          <h1 className="text-white text-4xl font-bold tracking-tight">
            Venue & Service listing approval
          </h1>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-b-2xl border border-[#E5E7EB]">
        

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
            {/* Left Column - Venue Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Venue Overview */}
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50   duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Venue Overview</h2>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Grand Ballroom Palace</h3>
                <p className="text-gray-600 mb-4">Wedding Hall</p>
                
                <div className="flex items-start gap-2 text-gray-700 mb-4">
                  <MapPin className="w-5 h-5 text-[#B74140] mt-0.5 flex-shrink-0" />
                  <span>123 Main Street, Gulshan-2, Dhaka-1212</span>
                </div>

                {/* Map Preview */}
                <div 
                  className={`relative rounded-xl overflow-hidden border-2 border-[#E5E7EB] cursor-pointer transition-all duration-500 ${
                    mapExpanded ? 'h-96' : 'h-56'
                  }`}
                  onClick={() => setMapExpanded(!mapExpanded)}
                >
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
                    alt="Venue Location"
                    className="w-full h-full object-cover"
                  />
                  {/* Map Markers Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <MapPin className="w-16 h-16 text-[#B74140] fill-[#B74140] drop-shadow-2xl animate-bounce" style={{animationDuration: '2s'}} />
                      <MapPin className="w-12 h-12 text-[#B74140] fill-[#B74140] absolute -left-20 top-6 drop-shadow-xl" />
                      <MapPin className="w-10 h-10 text-[#B74140] fill-[#B74140] absolute left-24 top-2 drop-shadow-lg" />
                    </div>
                  </div>
                  {/* Click to zoom indicator */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm font-semibold text-gray-700">
                      {mapExpanded ? 'Click to zoom out' : 'Click to zoom in'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing & Capacity */}
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 transition-shadow duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Pricing & Capacity</h2>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Price per person</p>
                    <p className="text-3xl font-bold text-gray-900">$5,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Min Capacity</p>
                    <p className="text-3xl font-bold text-gray-900">200</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 stransition-shadow duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Amenities</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-[#E5E7EB] hover:border-[#3CCF91] transition-colors duration-300"
                    >
                      <span className="text-2xl">{amenity.icon}</span>
                      <span className="text-gray-700 font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 transition-shadow duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Gallery</h2>
                
                <div className="grid grid-cols-3 gap-4">
                  {galleryImages.map((img, index) => (
                    <div 
                      key={index} 
                      className="aspect-square rounded-xl overflow-hidden border-2 border-[#E5E7EB] hover:border-[#B74140] transition-all duration-300 hover:scale-105 cursor-pointer "
                    >
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Venue Provider Information */}
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50  transition-shadow duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Venue Provider Information</h2>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#B74140] to-[#8B3130] flex items-center justify-center text-white text-2xl font-bold ">
                    AR
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">Ahmed Rahman</h3>
                    <p className="text-gray-600">ahmed.rahman@email.com</p>
                    <p className="text-gray-600">+880 1712-345678</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-[#3CCF911A] text-[#3CCF91] text-xs font-semibold rounded-full border border-[#3CCF91]">
                      Verified Account
                    </span>
                  </div>
                </div>
              </div>

              {/* Availability Calendar */}
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50  duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Availability Calendar</h2>
                
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-bold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((dayObj, index) => (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-110 cursor-pointer ${getCalendarColor(dayObj.status)}`}
                    >
                      {dayObj.day}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center gap-6 mt-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#3CCF91] "></div>
                    <span className="text-sm text-gray-700 font-medium">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#FF5A5A] "></div>
                    <span className="text-sm text-gray-700 font-medium">Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-[#FACC15] "></div>
                    <span className="text-sm text-gray-700 font-medium">Pending Bookings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Approve Venue Listing */}
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50  duration-300">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Approve Venue Listing</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Approving this venue will make it visible on the public landing page.
                </p>
                <button className="w-full bg-[#3CCF91] hover:bg-[#2EB87E] text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2  transform hover:scale-105">
                  <CheckCircle className="w-5 h-5" />
                  Approve Venue
                </button>
              </div>

              {/* Decline Venue Listing */}
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50  duration-300">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Decline Venue Listing</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Decline this venue if it does not meet platform standards.
                </p>
                
                <select 
                  className="w-full border-2 border-[#E5E7EB] rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-[#B74140] transition-colors duration-300"
                  value={selectedDeclineReason}
                  onChange={(e) => setSelectedDeclineReason(e.target.value)}
                >
                  <option value="">Select decline reason</option>
                  <option value="incomplete">Incomplete Information</option>
                  <option value="quality">Poor Quality Images</option>
                  <option value="pricing">Pricing Issues</option>
                  <option value="other">Other</option>
                </select>
                
                <textarea
                  className="w-full border-2 border-[#E5E7EB] rounded-lg px-4 py-3 mb-4 resize-none focus:outline-none focus:border-[#B74140] transition-colors duration-300"
                  rows="3"
                  placeholder="Optional internal note..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                ></textarea>
                
                <button className="w-full bg-[#FF5A5A] hover:bg-[#E64545] text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2  transform hover:scale-105">
                  <XCircle className="w-5 h-5" />
                  Decline Venue
                </button>
              </div>

              {/* Request Changes */}
              <div className="border-2 border-[#E5E7EB] rounded-xl p-6 bg-gradient-to-br from-white to-gray-50  duration-300">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-[#2B7FFF]" />
                  Request Changes
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Ask the venue provider to update or correct specific information.
                </p>
                
                <div className="space-y-3 mb-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={requestChanges.images}
                      onChange={(e) => setRequestChanges({...requestChanges, images: e.target.checked})}
                      className="w-5 h-5 text-[#2B7FFF] border-2 border-[#E5E7EB] rounded focus:ring-[#2B7FFF] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Missing or low-quality images</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={requestChanges.pricing}
                      onChange={(e) => setRequestChanges({...requestChanges, pricing: e.target.checked})}
                      className="w-5 h-5 text-[#2B7FFF] border-2 border-[#E5E7EB] rounded focus:ring-[#2B7FFF] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Incorrect pricing</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={requestChanges.capacity}
                      onChange={(e) => setRequestChanges({...requestChanges, capacity: e.target.checked})}
                      className="w-5 h-5 text-[#2B7FFF] border-2 border-[#E5E7EB] rounded focus:ring-[#2B7FFF] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Capacity mismatch</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={requestChanges.address}
                      onChange={(e) => setRequestChanges({...requestChanges, address: e.target.checked})}
                      className="w-5 h-5 text-[#2B7FFF] border-2 border-[#E5E7EB] rounded focus:ring-[#2B7FFF] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">Incomplete address</span>
                  </label>
                </div>
                
                <textarea
                  className="w-full border-2 border-[#E5E7EB] rounded-lg px-4 py-3 mb-4 resize-none focus:outline-none focus:border-[#2B7FFF] transition-colors duration-300"
                  rows="4"
                  placeholder="Detailed message to provider..."
                  value={detailedMessage}
                  onChange={(e) => setDetailedMessage(e.target.value)}
                ></textarea>
                
                <button className="w-full bg-[#2B7FFF] hover:bg-[#1E6FEE] text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <AlertTriangle className="w-5 h-5" />
                  Request Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueApproval;