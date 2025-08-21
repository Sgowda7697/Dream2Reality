import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { 
  title: "Dream → Reality | Travel Planner", 
  description: "Plan your dream vacation with AI. Get personalized destinations, flights, hotels, and detailed itineraries just like Cleartrip." 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 py-12">
          <div className="container">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">DR</span>
                  </div>
                  <span className="font-bold text-gray-800">Dream → Reality</span>
                </div>
                <p className="text-gray-600 text-sm">
                  AI-powered travel planning made simple. Transform your travel dreams into reality.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Destinations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-primary transition-colors">Popular Destinations</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Beach Vacations</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Mountain Retreats</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">City Breaks</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Services</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-primary transition-colors">Flight Booking</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Hotel Booking</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Itinerary Planning</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Travel Insurance</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="section-divider"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <p>© 2024 Dream → Reality. All rights reserved.</p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span>Powered by Next.js & AI</span>
                <span>•</span>
                <span>Built with ❤️</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}