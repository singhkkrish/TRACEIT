import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ItemCard from '../components/item-card.jsx';

// Mock Data to simulate database items
const MOCK_ITEMS = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max',
    category: 'Electronics',
    description: 'Blue iPhone with a clear case. Found on the bench near the fountain.',
    location: 'Central Park, NY',
    date: '2023-11-15',
    imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    type: 'found'
  },
  {
    id: '2',
    title: 'Brown Leather Wallet',
    category: 'Wallet/Keys',
    description: 'Lost my wallet containing ID and cards. Has a small scratch on the front.',
    location: 'Grand Central Station',
    date: '2023-11-14',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    type: 'lost'
  },
  {
    id: '3',
    title: 'Golden Retriever Dog',
    category: 'Pets',
    description: 'Friendly dog wearing a red collar. Answers to the name "Buddy".',
    location: 'Brooklyn Heights',
    date: '2023-11-16',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
    status: 'claimed', // Changed from pending to claimed
    type: 'found'      // Changed from lost to found
  },
  // Removed Car Keys (ID 4)
  {
    id: '4',
    title: 'MacBook Air M2',
    category: 'Electronics',
    description: 'Silver MacBook Air left in the library study room 304.',
    location: 'University Library',
    date: '2023-11-12',
    imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    type: 'found'
  },
  {
    id: '5',
    title: 'Blue Backpack',
    category: 'Clothing/Accessories',
    description: 'Nike backpack containing textbooks and a water bottle.',
    location: 'Subway Line 4',
    date: '2023-11-10',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    status: 'active',
    type: 'lost'
  }
];

const BrowseItems = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'lost', 'found'

  // Filter logic
  const filteredItems = MOCK_ITEMS.filter(item => {
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

            {/* Filter Dropdown (Simple Select) */}
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

        {/* Grid Display */}
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
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default BrowseItems;