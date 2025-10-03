'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Cube, RotateCcw, Grid3X3, Eye } from 'lucide-react'

export function ThreeDSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="3d" ref={ref} className="py-24 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            3D Terrain Analysis
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Immersive 3D visualization of mining pits with detailed depth and volume analysis.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 3D Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
                {/* 3D Scene Placeholder */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
                <div className="text-center z-10">
                  <Cube className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-float" />
                  <h3 className="text-xl font-semibold text-white mb-2">3D Terrain Visualization</h3>
                  <p className="text-gray-400">Interactive mining pit analysis</p>
                </div>
                
                {/* 3D Controls */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <button className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 text-white p-2 rounded-lg hover:bg-slate-700 transition-all">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 text-white p-2 rounded-lg hover:bg-slate-700 transition-all">
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button className="bg-slate-800/80 backdrop-blur-sm border border-slate-600 text-white p-2 rounded-lg hover:bg-slate-700 transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Mining Pit Markers */}
                <div className="absolute top-1/3 left-1/3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="absolute bottom-1/3 right-1/3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3D Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Pit Statistics */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pit Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Depth:</span>
                  <span className="text-white font-mono">15.2m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume:</span>
                  <span className="text-white font-mono">2.45M m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Area:</span>
                  <span className="text-white font-mono">0.457 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Slope:</span>
                  <span className="text-white font-mono">32°</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Left Click:</span>
                  <span>Rotate</span>
                </div>
                <div className="flex justify-between">
                  <span>Right Click:</span>
                  <span>Pan</span>
                </div>
                <div className="flex justify-between">
                  <span>Scroll:</span>
                  <span>Zoom</span>
                </div>
                <div className="flex justify-between">
                  <span>Middle Click:</span>
                  <span>Reset</span>
                </div>
              </div>
            </div>

            {/* Mining Markers */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Mining Markers</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Legal Mining</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">Illegal Mining</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Detection Zone</span>
                </div>
              </div>
            </div>

            {/* 3D Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all">
                  Reset View
                </button>
                <button className="w-full border border-slate-600 text-gray-300 py-2 px-4 rounded-lg font-semibold hover:bg-slate-700 transition-all">
                  Wireframe Mode
                </button>
                <button className="w-full border border-slate-600 text-gray-300 py-2 px-4 rounded-lg font-semibold hover:bg-slate-700 transition-all">
                  Export Model
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


