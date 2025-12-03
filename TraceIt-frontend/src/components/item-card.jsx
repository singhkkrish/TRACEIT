import React from 'react';
import { MapPin, Calendar, Tag } from "lucide-react";

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  // 'pending' status has been removed
  claimed: {
    label: "Claimed",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

const ItemCard = ({ item, type }) => {
  // Fallback to active if status is unrecognized
  const statusStyle = statusConfig[item.status] || statusConfig.active;
  
  // Safe date formatting
  const formattedDate = (() => {
    const d = new Date(item.date);
    if (isNaN(d)) return item.date || '';
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  })();

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-black/20 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyle.className}`}>
            {statusStyle.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
            {item.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Tag className="h-3.5 w-3.5" />
            <span>{item.category}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
          {item.description}
        </p>

        <div className="space-y-2 pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-black/60 flex-shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-black/60 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Footer / Action Button */}
      <div className="p-5 pt-0 mt-auto">
        <button
          disabled={item.status === "claimed"}
          className={`w-full py-2.5 rounded-xl font-medium transition-colors ${
            type === "lost" 
              ? "bg-black text-white hover:bg-gray-800" 
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          } ${item.status === "claimed" ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {item.status === "claimed" 
            ? "Item Claimed" 
            : (type === "lost" ? "View Details" : "Claim This Item")
          }
        </button>
      </div>
    </div>
  );
};

export default ItemCard;