import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, MapPin, User } from 'lucide-react';

const getRandomLayout = () => {
  const layouts = [
    [
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 2', gridRow: 'span 1' },
      { gridColumn: 'span 1', gridRow: 'span 2' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 2', gridRow: 'span 2' },
    ],
    [
      { gridColumn: 'span 2', gridRow: 'span 2' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 1', gridRow: 'span 2' },
      { gridColumn: 'span 2', gridRow: 'span 1' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
    ],
    [
      { gridColumn: 'span 1', gridRow: 'span 2' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 2', gridRow: 'span 1' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
      { gridColumn: 'span 2', gridRow: 'span 2' },
      { gridColumn: 'span 1', gridRow: 'span 1' },
    ]
  ];
  
  return layouts[Math.floor(Math.random() * layouts.length)];
};

const formatDate = (dateTimeString) => {
  if (!dateTimeString) return '';
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    timeZoneName: 'short'
  };
  return new Date(dateTimeString).toLocaleDateString('en-US', options);
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const ImageSlideshow = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [images]);
  
  if (!images || images.length === 0) {
    return (
      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">No image available</p>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((image, index) => (
        <div 
          key={index} 
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ 
            opacity: index === currentIndex ? 1 : 0,
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for better text readability */}
          <img 
            src={image.url} 
            alt={image.caption || 'Event image'}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Dots for slideshow navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 z-20 flex gap-1">
          {images.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event, style }) => {
  return (
    <div 
      className="rounded-lg shadow-md overflow-hidden relative min-h-64 transition-all hover:shadow-xl"
      style={{
        ...style,
        minHeight: "200px" // Ensure minimum height for content
      }}
    >
      {/* Background images */}
      <ImageSlideshow images={event.images} />
      
      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between z-10 text-white">
        <div>
          <h3 className="text-xl font-bold mb-2 drop-shadow-md">{event.name}</h3>
          <p className="text-sm drop-shadow-md line-clamp-2 ">
            {truncateText(event.description, 150)}
          </p>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-end flex-wrap">
            {/* Organizer */}
            <div className="flex items-center mb-1 mr-2">
              <User size={16} className="mr-1" />
              <span className="text-xs">{truncateText(event.organizer, 25)}</span>
            </div>
            
            {/* Date & Time */}
            <div className="flex items-center mb-1">
              <Clock size={16} className="mr-1" />
              <span className="text-xs">{formatDate(event.dateTime)}</span>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center">
            <MapPin size={16} className="mr-1" />
            <span className="text-xs">{truncateText(event.location, 40)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventBentoBox = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [layout, setLayout] = useState([]);
  
  // Set a random layout on mount or refresh
  useEffect(() => {
    setLayout(getRandomLayout());
  }, []);
  
  // Fetch events on component mount or page change
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/gaupal/events?page=${page}&limit=6`);
        setEvents(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [page]);
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
    // Generate new layout on page change
    setLayout(getRandomLayout());
    window.scrollTo(0, 0);
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      
      {events.length === 0 ? (
        <p className="text-gray-500">No events found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" style={{ gridAutoRows: "minmax(200px, auto)" }}>
            {events.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                style={layout[index % layout.length]} 
              />
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="text-center">
              Page {page} of {totalPages}
            </div>
            
            <button 
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventBentoBox;