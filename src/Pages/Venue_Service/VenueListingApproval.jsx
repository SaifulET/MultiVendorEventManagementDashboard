import React, { useState } from 'react';
import { Eye, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const VenueListingApproval = () => {
  const [activeTab, setActiveTab] = useState('venue');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const venueData = [
    {
      id: 1,
      providerName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      date: 'Dec 28, 2024',
      time: '6:00 PM - 11:00 PM',
      venueName: 'Grand Ballroom',
      eventType: 'Corporate Event',
      status: 'pending'
    },
    {
      id: 2,
      providerName: 'Michael Chen',
      email: 'm.chen@gmail.com',
      date: 'Dec 30, 2024',
      time: '2:00 PM - 8:00 PM',
      venueName: 'Garden Terrace',
      eventType: 'Wedding Reception',
      status: 'pending'
    },
    {
      id: 3,
      providerName: 'Emily Rodriguez',
      email: 'emily.r@events.com',
      date: 'Jan 5, 2025',
      time: '10:00 AM - 4:00 PM',
      venueName: 'Conference Hall A',
      eventType: 'Business Meeting',
      status: 'approved'
    },
    {
      id: 4,
      providerName: 'David Park',
      email: 'david.park@startup.io',
      date: 'Jan 8, 2025',
      time: '7:00 PM - 12:00 AM',
      venueName: 'Rooftop Lounge',
      eventType: 'Product Launch',
      status: 'pending'
    },
    {
      id: 5,
      providerName: 'Lisa Thompson',
      email: 'lisa.t@creative.com',
      date: 'Jan 12, 2025',
      time: '5:00 PM - 10:00 PM',
      venueName: 'Art Gallery Space',
      eventType: 'Exhibition Opening',
      status: 'changes'
    },
    // Additional entries for pagination demonstration
    ...Array.from({ length: 245 }, (_, i) => ({
      id: i + 6,
      providerName: `Provider ${i + 6}`,
      email: `provider${i + 6}@email.com`,
      date: `Jan ${15 + (i % 15)}, 2025`,
      time: '9:00 AM - 5:00 PM',
      venueName: `Venue ${i + 6}`,
      eventType: ['Corporate Event', 'Wedding', 'Conference', 'Party'][i % 4],
      status: ['pending', 'approved', 'changes'][i % 3]
    }))
  ];

  const serviceData = [
    {
      id: 1,
      providerName: 'Gourmet Catering Co',
      email: 'info@gourmetcatering.com',
      date: 'Dec 27, 2024',
      time: '12:00 PM - 10:00 PM',
      serviceName: 'Premium Catering Package',
      serviceType: 'Catering Service',
      status: 'approved'
    },
    {
      id: 2,
      providerName: 'Elite Photography',
      email: 'bookings@elitephoto.com',
      date: 'Dec 29, 2024',
      time: '3:00 PM - 9:00 PM',
      serviceName: 'Wedding Photography',
      serviceType: 'Photography',
      status: 'pending'
    },
    {
      id: 3,
      providerName: 'Sound Masters',
      email: 'contact@soundmasters.io',
      date: 'Jan 3, 2025',
      time: '6:00 PM - 11:00 PM',
      serviceName: 'Audio & Lighting Setup',
      serviceType: 'AV Services',
      status: 'changes'
    },
    {
      id: 4,
      providerName: 'Floral Elegance',
      email: 'orders@floralelegance.com',
      date: 'Jan 6, 2025',
      time: '8:00 AM - 2:00 PM',
      serviceName: 'Floral Decoration',
      serviceType: 'Decoration',
      status: 'pending'
    },
    {
      id: 5,
      providerName: 'Dream Events Planners',
      email: 'hello@dreamevents.com',
      date: 'Jan 10, 2025',
      time: '9:00 AM - 6:00 PM',
      serviceName: 'Full Event Management',
      serviceType: 'Event Planning',
      status: 'approved'
    },
    // Additional service entries for pagination
    ...Array.from({ length: 245 }, (_, i) => ({
      id: i + 6,
      providerName: `Service Provider ${i + 6}`,
      email: `service${i + 6}@email.com`,
      date: `Jan ${15 + (i % 15)}, 2025`,
      time: '9:00 AM - 5:00 PM',
      serviceName: `Service ${i + 6}`,
      serviceType: ['Catering', 'Photography', 'DJ Services', 'Decoration'][i % 4],
      status: ['pending', 'approved', 'changes'][i % 3]
    }))
  ];

  const currentData = activeTab === 'venue' ? venueData : serviceData;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayData = currentData.slice(startIndex, endIndex);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-[#FEF9C3]',
          text: 'text-[#854D0E]',
          icon: Clock,
          label: 'Pending'
        };
      case 'approved':
        return {
          bg: 'bg-[#DCFCE7]',
          text: 'text-[#166534]',
          icon: CheckCircle,
          label: 'Approved'
        };
      case 'changes':
        return {
          bg: 'bg-[#DBEAFE]',
          text: 'text-[#1E40AF]',
          icon: AlertTriangle,
          label: 'Changes Required'
        };
      default:
        return {
          bg: 'bg-[#FEF9C3]',
          text: 'text-[#854D0E]',
          icon: Clock,
          label: 'Pending'
        };
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to page 1 when switching tabs
  };

  return (
    <div className="min-h-screen mt-[96px] ">
      <div className="">
        {/* Header */}
        <div className="bg-[#B74140] px-[20px] py-[18px] rounded-t-xl">
          <h1 className="text-white text-3xl font-semibold">
            Venue & Service listing approval
          </h1>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 pt-6 pb-0 flex gap-3">
          <button
            onClick={() => handleTabChange('venue')}
            className={`px-6 py-3 rounded-lg font-medium text-[15px] transition-all ${
              activeTab === 'venue'
                ? 'bg-[#B74140] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Venue
          </button>
          <button
            onClick={() => handleTabChange('service')}
            className={`px-6 py-3 rounded-lg font-medium text-[15px] transition-all ${
              activeTab === 'service'
                ? 'bg-[#B74140] text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
          >
            Service
          </button>
        </div>

        {/* Table */}
        <div className="mt-[16px] ">
          <div className=" rounded-lg border border-[#E5E7EB]">
            <table className="w-full">
              <thead className="bg-gray-50 border border-[#E5E7EB]">
                <tr className="border-b border-gray-200">
                  <th className="text-left px-4 py-4 text-gray-600 font-semibold text-sm">
                    {activeTab === 'venue' ? 'Venue Provider Name' : 'Service Provider Name'}
                  </th>
                  <th className="text-left px-4 py-4 text-gray-600 font-semibold text-sm">
                    Date
                  </th>
                  <th className="text-left px-4 py-4 text-gray-600 font-semibold text-sm">
                    {activeTab === 'venue' ? 'Venue Name' : 'Service Name'}
                  </th>
                  <th className="text-left px-4 py-4 text-gray-600 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left px-4 py-4 text-gray-600 font-semibold text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {displayData.map((item) => {
                  const statusConfig = getStatusConfig(item.status);
                  const StatusIcon = statusConfig.icon;
                  const initials = item.providerName.split(' ').map(n => n[0]).join('').slice(0, 2);
                  
                  return (
                    <tr 
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-[15px]">
                              {item.providerName}
                            </div>
                            <div className="text-gray-500 text-[13px] mt-0.5">
                              {item.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="font-medium text-gray-900 text-[15px]">
                          {item.date}
                        </div>
                        <div className="text-gray-500 text-[13px] mt-1">
                          {item.time}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="font-medium text-gray-900 text-[15px]">
                          {activeTab === 'venue' ? item.venueName : item.serviceName}
                        </div>
                        <div className="text-gray-500 text-[13px] mt-1">
                          {activeTab === 'venue' ? item.eventType : item.serviceType}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md ${statusConfig.bg} ${statusConfig.text} text-[13px] font-medium`}>
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <Link to="/venueandservice/venuedetails/id1">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all">
                          <Eye size={16} />
                          View Details
                        </button>
                        
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
            <div className="text-[#B74140] text-sm font-medium uppercase">
              SHOWING {startIndex + 1}-{Math.min(endIndex, currentData.length)} OF {currentData.length}
            </div>

            <div className="flex gap-2 items-center flex-wrap justify-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all text-lg"
              >
                ‹
              </button>

              {generatePageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500 text-sm">
                    ....
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[36px] h-9 px-3 rounded-md text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-[#B74140] text-white border border-[#B74140]'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all text-lg"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueListingApproval;