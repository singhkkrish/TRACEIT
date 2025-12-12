import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader } from 'lucide-react';
import ItemCard from '../components/item-card.jsx';

const BrowseItems = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'lost', 'found'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch items from backend
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch both lost and found items
      const [lostResponse, foundResponse] = await Promise.all([
        fetch('http://localhost:5000/api/items/lost'),
        fetch('http://localhost:5000/api/found-items')
      ]);

      const lostData = await lostResponse.json();
      const foundData = await foundResponse.json();

      if (lostData.success && foundData.success) {
        // Combine and format items - UPDATED to include phone field
        const lostItems = lostData.items.map(item => ({
          id: item._id,
          title: item.itemName,
          category: item.category,
          description: item.description || `Lost at ${item.locationLost}`,
          location: item.locationLost,
          date: item.dateLost,
          phone: item.phone || '', // Phone from item
          imageUrl: item.photos && item.photos.length > 0 
            ? item.photos[0] 
            : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=800',
          status: 'active',
          type: 'lost',
          reportedBy: item.reportedBy // Keep the full object with name, email, and phone
        }));

        const foundItems = foundData.foundItems.map(item => ({
          id: item._id,
          title: item.itemName,
          category: item.category,
          description: `Found at ${item.locationFound}`, // Brief description for card
          securityQuestion: item.securityQuestion, // Security question for verification
          location: item.locationFound,
          date: item.dateFound,
          phone: item.phone || '', // Phone from item
          imageUrl: item.photos && item.photos.length > 0 
            ? item.photos[0] 
            : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=800',
          status: item.status === 'claimed' ? 'claimed' : 'active',
          type: 'found',
          foundBy: item.foundBy // Keep the full object with name, email, and phone
        }));

        // Combine and sort by date (newest first)
        const allItems = [...lostItems, ...foundItems].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );

        setItems(allItems);
      } else {
        setError('Failed to fetch items');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Browse Items</h1>
            <p className="text-gray-500">
              Explore recently reported lost and found items in your community.
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative group w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
              <input 
                type="text" 
                placeholder="Search by name or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black cursor-pointer"
              >
                <option value="all">All Items</option>
                <option value="lost">Lost Items Only</option>
                <option value="found">Found Items Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <Loader className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Loading items...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-800 font-semibold">⚠️ {error}</p>
            <button 
              onClick={fetchItems}
              className="mt-4 px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Grid Display */}
        {!loading && !error && (
          <>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} type={item.type} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No items found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
                <button
                  onClick={() => onNavigate('lost-item')}
                  className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Report Lost Item
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default BrowseItems;