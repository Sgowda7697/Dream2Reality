"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Plane, Hotel, Calendar, Clock, AlertCircle, Star, ArrowRight } from "lucide-react";
import DestinationCard from "@/components/DestinationCard";
import Itinerary from "@/components/Itinerary";
import type { TPlanResponse } from "@/lib/schema";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TPlanResponse | null>(null);
  const [stage, setStage] = useState<"start"|"options"|"itinerary">("start");
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setPlan(null);
    setError(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input })
      });
      const data: TPlanResponse | {error:string} = await res.json();
      if ((data as any).error) throw new Error((data as any).error);
      setPlan(data as TPlanResponse);
      setStage("options");
    } catch (e:any) {
      setError(e.message || "Failed to generate plan");
    } finally { 
      setLoading(false); 
    }
  }

  function selectDestination(name: string) {
    if (!plan) return;
    setPlan({ ...plan, chosenDestination: name });
    setStage("itinerary");
  }

  const samplePrompts = [
    "Beach vacation with water sports, 5 days, Goa",
    "Royal palaces and culture, 3 days, Rajasthan", 
    "Mountain adventure and trekking, 4 days, Himachal"
  ];

  return (
    <div className="w-full">
      {/* Hero Section - Cleartrip Style */}
      <section className="hero-section relative flex items-center justify-center text-center text-white">
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='tropical' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff6b35;stop-opacity:0.8'/%3E%3Cstop offset='50%25' style='stop-color:%233742fa;stop-opacity:0.6'/%3E%3Cstop offset='100%25' style='stop-color:%23ff4757;stop-opacity:0.8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23tropical)'/%3E%3Cpath d='M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`
          }}
        />
        
        <div className="relative z-10 container px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Your Dream Vacation<br />
              <span className="text-orange-300">Starts Here</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Describe your perfect getaway and let AI create your personalized travel plan
            </p>
            
            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="search-container max-w-3xl mx-auto"
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2 text-left">
                  Where do you want to go?
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <textarea 
                    className="input pl-12 min-h-[100px] resize-none text-gray-700"
                    placeholder="e.g., A beach escape with nightlife and surfing, 4-5 days, medium budget, from Bangalore"
                    value={input} 
                    onChange={e=>setInput(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <motion.button 
                  disabled={loading || !input.trim()} 
                  onClick={generate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner" />
                      Crafting your perfect trip...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search Destinations
                    </>
                  )}
                </motion.button>
                
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((prompt, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setInput(prompt)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-sample"
                    >
                      Try Sample {i + 1}
                    </motion.button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="error-message mt-4 flex items-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-12 space-y-16">
        {/* Destination Results */}
        <AnimatePresence>
          {stage !== "start" && plan && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="heading-secondary">Perfect Destinations for You</h2>
                <p className="text-gray-600">We found these amazing places that match your preferences</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {plan.destinationOptions.map((destination, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                  >
                    <DestinationCard 
                      name={destination.name} 
                      summary={destination.summary}
                      tags={destination.tags}
                      onSelect={() => selectDestination(destination.name)} 
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Travel Details Section */}
        <AnimatePresence>
          {plan?.chosenDestination && (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="heading-secondary">{plan.chosenDestination} Travel Package</h2>
                <p className="text-gray-600">Flights, hotels, and everything you need for your trip</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Flights Section */}
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="travel-section"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Available Flights</h3>
                      <p className="text-gray-600 text-sm">Best deals for your travel dates</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {plan.flights.length ? plan.flights.map((flight, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="card p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Plane className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">
                                {flight.from} → {flight.to}
                              </div>
                              <div className="text-sm text-gray-600">{flight.airline}</div>
                            </div>
                          </div>
                          <div className="price-tag">₹{flight.price.toLocaleString()}</div>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        <Plane className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>No flights available for this destination</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Hotels Section */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="travel-section"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Hotel className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Recommended Hotels</h3>
                      <p className="text-gray-600 text-sm">Comfortable stays within your budget</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {plan.hotels.length ? plan.hotels.map((hotel, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="card p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                              <Hotel className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{hotel.name}</div>
                              {hotel.area && <div className="text-sm text-gray-600">{hotel.area}</div>}
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(4)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                                <Star className="w-3 h-3 text-gray-300" />
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="price-tag">₹{hotel.pricePerNight.toLocaleString()}</div>
                            <div className="text-xs text-gray-600 mt-1">per night</div>
                          </div>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-8 text-gray-500">
                        <Hotel className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>No hotels available for this destination</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Itinerary Section */}
        <AnimatePresence>
          {plan?.itinerary?.length ? (
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="heading-secondary">Your Complete Itinerary</h2>
                <p className="text-gray-600">Day-by-day guide to make the most of your trip</p>
              </div>
              <Itinerary days={plan.itinerary as any} />
            </motion.section>
          ) : null}
        </AnimatePresence>

        {/* Call to Action */}
        {!plan && (
          <section className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Plan Your Dream Vacation?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered their perfect destinations with our AI-powered travel planner.
            </p>
            <button className="btn btn-primary px-8 py-4 text-lg" onClick={() => document.querySelector('textarea')?.focus()}>
              Start Planning Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </section>
        )}
      </div>
    </div>
  );
}