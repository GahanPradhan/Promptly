import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Users, Bookmark, Calendar, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PromptCard from './components/PromptCard';
import { fetchBookmarkedPrompts, fetchPrompts, fetchTopUsers } from '../../utils/utils';

function CommunityPage() {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState('grid');
  const [selectedNav, setSelectedNav] = useState('community');
  const [bookmarkedPrompts, setBookmarkedPrompts] = useState([]);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [topUsers, setTopUsers] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [animatedSections, setAnimatedSections] = useState({});
  const [visibleItems, setVisibleItems] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Reference for the main container
  const pageRef = useRef(null);

  // Page load animation effect
  useEffect(() => {
    // Add initial loading state class to body
    document.body.classList.add('loading');
    
    // Simulate content loading and remove loading state
    const timer = setTimeout(() => {
      setPageLoaded(true);
      document.body.classList.remove('loading');
      setIsInitialLoad(false);
      
      // Add first wave of animations after small delay
      setTimeout(() => {
        setAnimatedSections(prev => ({
          ...prev,
          header: true,
          sidebar: true
        }));
        
        // Add second wave of animations
        setTimeout(() => {
          setAnimatedSections(prev => ({
            ...prev,
            content: true,
            rightSidebar: true
          }));
        }, 200);
      }, 100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Set up intersection observer to detect when elements enter viewport
  useEffect(() => {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1 // 10% of the element visible
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const itemId = entry.target.dataset.animateId;
          if (itemId) {
            setVisibleItems(prev => ({
              ...prev,
              [itemId]: true
            }));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Target all items that should animate on scroll
    const animatableItems = document.querySelectorAll('[data-animate-id]');
    animatableItems.forEach(item => {
      observer.observe(item);
    });

    return () => {
      animatableItems.forEach(item => {
        observer.unobserve(item);
      });
    };
  }, [prompts, bookmarkedPrompts, topUsers]); // Re-observe when data changes

  // Fetch all prompts initially
  useEffect(() => {
    fetchPrompts(setPrompts, setError);
  }, []);

  // Fetch Bookmarked
  useEffect(() => {
    fetchBookmarkedPrompts(setBookmarkedPrompts, setError, showBookmarked);
  }, [showBookmarked]);

  // Fetch Top Users
  useEffect(() => {
    fetchTopUsers(setTopUsers, setError);
  }, []);

  // Elasticsearch search handler
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === '') {
      fetchPrompts(setPrompts, setError);
      return;
    }

    try {
      const response = await axios.get('/api/search', {
        params: { query: value }
      });
      console.log(response.data);
      setPrompts(response.data);
    } catch (err) {
      console.error(err);
      setError('Search failed. Please try again later.');
    }
  };

  const filteredPrompts = (showBookmarked ? bookmarkedPrompts : prompts).filter(prompt =>
    (filterTag ? prompt?.tags?.includes(filterTag) : true)
  );

  const navigationItems = [
    {
      id: 'community',
      label: 'Community Picks',
      icon: Users,
      onClick: () => {
        setSelectedNav('community');
        setShowBookmarked(false);
      },
    },
    {
      id: 'add',
      label: 'Add Post',
      icon: Plus,
      onClick: () => {
        setSelectedNav('add');
        navigate('/add-prompt');
      },
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: Bookmark,
      onClick: () => {
        setSelectedNav('saved');
        setShowBookmarked(true);
      },
    },
  ];

  const upcomingEvents = [
    { id: 1, name: "Advanced Prompt Engineering", date: "Mar 15", attendees: 45 },
    { id: 2, name: "AI Ethics Discussion", date: "Mar 18", attendees: 32 },
    { id: 3, name: "Community Meetup", date: "Mar 22", attendees: 78 },
  ];

  const popularTags = ['AI', 'Writing', 'Code', 'Business', 'Creative'];

  const isVisible = (id) => visibleItems[id] === true;

  return (
    <div 
      ref={pageRef}
      className={`min-h-screen bg-gray-950 flex relative overflow-hidden transition-opacity duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Initial loading indicator - only visible during first load */}
      {isInitialLoad && (
        <div className="fixed inset-0 bg-gray-950 z-50 flex items-center justify-center transition-opacity duration-500">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin-slow opacity-30"></div>
              <div className="absolute inset-2 bg-gray-950 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="mt-4 text-gray-400 animate-pulse">Loading community...</div>
          </div>
        </div>
      )}

      {/* Background elements - with milder colors */}
      <div className="absolute inset-0 bg-gray-950 transition-opacity duration-1000">
        {/* Subtle blue gradient */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
        {/* Subtle purple gradient */}
        <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
      </div>
      
      {/* Grid pattern overlay with fade-in animation */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0iIzIwMjAyMCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-0 transition-opacity duration-1000 ease-in-out" style={{ opacity: pageLoaded ? 0.1 : 0 }}></div>

      {/* Left Sidebar with fade-in and slide animation */}
      <div 
        className={`w-64 relative z-10 border-r border-gray-800 custom-scrollbar transition-transform duration-700 ease-out ${
          animatedSections.sidebar ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
        }`}
      >
        <div className="p-6 h-full flex flex-col backdrop-blur-sm">
          <div className="space-y-8 flex-1 overflow-y-auto">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Categories</h3>
              <nav className="space-y-1">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.onClick}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                        selectedNav === item.id
                          ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-blue-400'
                      }`}
                      style={{
                        transitionDelay: `${100 + index * 100}ms`,
                        opacity: animatedSections.sidebar ? 1 : 0,
                        transform: animatedSections.sidebar ? 'translateX(0)' : 'translateX(-10px)'
                      }}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                      filterTag === tag
                        ? 'bg-blue-900/50 text-blue-400 border border-blue-800/50'
                        : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
                    }`}
                    style={{
                      transitionDelay: `${400 + index * 75}ms`,
                      opacity: animatedSections.sidebar ? 1 : 0,
                      transform: animatedSections.sidebar ? 'translateY(0)' : 'translateY(10px)'
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Content without animations */}
      <div className="flex-1 h-screen overflow-y-auto custom-scrollbar relative z-10">
        <div className="max-w-3xl mx-auto px-8 py-8">
          {/* Header card without animations */}
          <div className="mb-8">
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 backdrop-blur-sm relative overflow-hidden">
              {/* Subtle gradient in header background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,#3b82f6,transparent 60%)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent 60%)]"></div>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/30 text-blue-400 text-sm border border-blue-800/50">
                  <span>{showBookmarked ? 'Your Collection' : 'Community Hub'}</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2 text-center">
                {showBookmarked ? 'Saved Prompts' : 'Community Prompts'}
              </h1>
              <p className="text-gray-400 mb-6 text-center">
                {showBookmarked
                  ? 'Your collection of saved prompts'
                  : 'Discover and share powerful prompts with the community'}
              </p>

              <div className="flex gap-4 items-center">
                <div className="relative flex-1 group">
                  {/* Subtle glow on focus */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={search}
                      onChange={handleSearch}
                      placeholder="Search prompts..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800/50 text-white transition-all duration-300"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                  className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-300 hover:scale-105 transition-transform duration-200"
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6">
              <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            </div>
          )}

          {/* Prompt cards without animations */}
          <div className="space-y-4">
            {filteredPrompts.map((prompt) => (
              <div key={prompt._id}>
                <div className="bg-gray-900 rounded-xl border border-gray-800 backdrop-blur-sm overflow-hidden hover:border-gray-700 transition-colors duration-300 hover:shadow-lg hover:shadow-blue-900/10">
                  <PromptCard
                    prompt={prompt}
                    setPrompts={setPrompts}
                    view={view}
                    setBookmarkedPrompts={setBookmarkedPrompts}
                    darkMode={true}
                  />
                </div>
              </div>
            ))}
            {showBookmarked && filteredPrompts.length === 0 && (
              <div className="text-center py-16 text-gray-400">No saved prompts found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar with fade-in and slide animation */}
      <div 
        className={`w-64 relative z-10 border-l border-gray-800 transition-transform duration-700 ease-out ${
          animatedSections.rightSidebar ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
        }`}
      >
        <div className="p-6 h-full backdrop-blur-sm overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Top Contributors</h3>
              <div className="space-y-4">
                {topUsers.map((contributor, index) => (
                  <div 
                    key={contributor.id} 
                    data-animate-id={`contributor-${contributor.id}`}
                    className="transition-all duration-500"
                    style={{
                      opacity: isVisible(`contributor-${contributor.id}`) || animatedSections.rightSidebar ? 1 : 0,
                      transform: isVisible(`contributor-${contributor.id}`) || animatedSections.rightSidebar ? 'translateX(0)' : 'translateX(15px)',
                      transitionDelay: `${index * 150 + 200}ms`
                    }}
                  >
                    <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 backdrop-blur-sm hover:border-blue-800/30 transition-all duration-300 hover:transform hover:translate-x-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center overflow-hidden">
                            <img
                              src={
                                contributor.profilePicture ||
                                "https://res.cloudinary.com/djncnauta/image/upload/v1735364671/profile_photo_gaqfit.jpg"
                              }
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-200">{contributor.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full border border-blue-800/50">{contributor.badge}</span>
                        <span className="text-gray-400">{contributor.contributions} prompts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    data-animate-id={`event-${event.id}`}
                    className="transition-all duration-500"
                    style={{
                      opacity: isVisible(`event-${event.id}`) || animatedSections.rightSidebar ? 1 : 0,
                      transform: isVisible(`event-${event.id}`) || animatedSections.rightSidebar ? 'translateY(0)' : 'translateY(10px)',
                      transitionDelay: `${index * 150 + 500}ms`
                    }}
                  >
                    <div className="bg-gray-900 rounded-lg p-3 border border-gray-800 backdrop-blur-sm hover:border-blue-800/30 hover:shadow-md transition-all duration-300 hover:transform hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-200">{event.name}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {event.date}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {event.attendees}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom animation and scrollbar styles */}
      <style jsx global>{`
        body.loading {
          overflow: hidden;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-fade-in-slow {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        /* Custom scrollbar styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
          border-radius: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
        
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.2) transparent;
        }
        
        /* Hide scrollbar but keep functionality (for cleaner look) */
        @media (min-width: 1024px) {
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          .hide-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        }
      `}</style>
    </div>
  );
}

export default CommunityPage;