'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Map, Layers, Navigation, Target } from 'lucide-react'

export function MapSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="map" ref={ref} className="py-24 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Geospatial Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive mapping with real-time mining detection and legal boundary analysis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
                {/* Map Placeholder */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
                <div className="text-center z-10">
                  <Map className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Interactive Map</h3>
                  <p className="text-gray-400">Santiago, Chile Mining Zone</p>
                </div>
                
                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <button className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 text-white p-2 rounded-lg hover:bg-slate-700 transition-all">
                    <Layers className="w-4 h-4" />
                  </button>
                  <button className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 text-white p-2 rounded-lg hover:bg-slate-700 transition-all">
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>

                {/* Location Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Location Details */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Detection Zone</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Latitude:</span>
                  <span className="text-white">-33.4489° S</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Longitude:</span>
                  <span className="text-white">-70.6693° W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Country:</span>
                  <span className="text-white">Chile</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Region:</span>
                  <span className="text-white">Santiago</span>
                </div>
              </div>
            </div>

            {/* Mining Areas Legend */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Mining Areas</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-300">All Mining</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-300">Legal Mining</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-300">Illegal Mining</span>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Map Controls</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all">
                  📍 Locate Detection
                </button>
                <button className="w-full border border-slate-600 text-gray-300 py-2 px-4 rounded-lg font-semibold hover:bg-slate-700 transition-all">
                  Satellite View
                </button>
                <button className="w-full border border-slate-600 text-gray-300 py-2 px-4 rounded-lg font-semibold hover:bg-slate-700 transition-all">
                  Terrain View
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


