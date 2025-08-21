"use client";
import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight, Clock } from "lucide-react";

export default function DestinationCard({ name, summary, tags, onSelect }:{
  name: string; summary?: string; tags?: string[]; onSelect?: ()=>void;
}){
  // Generate a beautiful background based on destination name
  const getDestinationImage = (name: string) => {
    const destinations: Record<string, string> = {
      'Goa': `linear-gradient(135deg, rgba(255, 107, 53, 0.7), rgba(0, 0, 0, 0.4)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='beach' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff6b35;stop-opacity:0.9'/%3E%3Cstop offset='50%25' style='stop-color:%2300d4ff;stop-opacity:0.7'/%3E%3Cstop offset='100%25' style='stop-color:%23ff4757;stop-opacity:0.8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23beach)'/%3E%3Cpath d='M0,150 Q100,100 200,150 T400,150 L400,300 L0,300 Z' fill='%23ffffff' fill-opacity='0.2'/%3E%3Ccircle cx='320' cy='80' r='30' fill='%23ffdd59' opacity='0.8'/%3E%3C/svg%3E")`,
      'Mysore': `linear-gradient(135deg, rgba(147, 51, 234, 0.7), rgba(0, 0, 0, 0.4)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='palace' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffd700;stop-opacity:0.8'/%3E%3Cstop offset='50%25' style='stop-color:%23ff6b35;stop-opacity:0.7'/%3E%3Cstop offset='100%25' style='stop-color:%23e74c3c;stop-opacity:0.8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23palace)'/%3E%3Crect x='150' y='80' width='100' height='140' fill='%23ffffff' fill-opacity='0.3'/%3E%3Cpolygon points='150,80 200,40 250,80' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
      'Rajasthan': `linear-gradient(135deg, rgba(255, 193, 7, 0.8), rgba(0, 0, 0, 0.4)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='desert' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ffc107;stop-opacity:0.9'/%3E%3Cstop offset='50%25' style='stop-color:%23ff6b35;stop-opacity:0.7'/%3E%3Cstop offset='100%25' style='stop-color:%23dc3545;stop-opacity:0.8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23desert)'/%3E%3Cpath d='M0,200 Q100,160 200,200 T400,200 L400,300 L0,300 Z' fill='%23f4a261' fill-opacity='0.6'/%3E%3Cpath d='M50,150 Q150,100 250,150 T400,150 L400,200 L0,200 Z' fill='%23e76f51' fill-opacity='0.4'/%3E%3C/svg%3E")`,
      'Himachal': `linear-gradient(135deg, rgba(34, 197, 94, 0.7), rgba(0, 0, 0, 0.4)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='mountain' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2322c55e;stop-opacity:0.8'/%3E%3Cstop offset='50%25' style='stop-color:%233b82f6;stop-opacity:0.7'/%3E%3Cstop offset='100%25' style='stop-color:%236366f1;stop-opacity:0.8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23mountain)'/%3E%3Cpolygon points='0,200 100,100 200,150 300,80 400,120 400,300 0,300' fill='%23ffffff' fill-opacity='0.2'/%3E%3Cpolygon points='80,120 150,60 220,100 280,50 350,80 400,0 400,120' fill='%23ffffff' fill-opacity='0.3'/%3E%3C/svg%3E")`
    };

    return destinations[name] || `linear-gradient(135deg, rgba(59, 130, 246, 0.7), rgba(0, 0, 0, 0.4)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='default' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%233b82f6;stop-opacity:0.8'/%3E%3Cstop offset='50%25' style='stop-color:%238b5cf6;stop-opacity:0.7'/%3E%3Cstop offset='100%25' style='stop-color:%23ec4899;stop-opacity:0.8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='300' fill='url(%23default)'/%3E%3C/svg%3E")`;
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="destination-card group cursor-pointer"
      onClick={onSelect}
      style={{
        backgroundImage: getDestinationImage(name),
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="destination-card-content">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Destination</span>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30 group-hover:bg-white/30 transition-colors"
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="mt-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-orange-100 transition-colors">
            {name}
          </h3>
          
          {summary && (
            <p className="text-white/90 text-sm mb-4 leading-relaxed group-hover:text-white transition-colors">
              {summary}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <motion.span 
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="badge"
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Plan your trip</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow group-hover:bg-orange-50"
            >
              Select
            </motion.button>
          </div>
        </div>

        {/* Cleartrip-style bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}