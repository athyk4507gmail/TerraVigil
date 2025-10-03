'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Upload, Shield, AlertTriangle, CheckCircle, FileText, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AnalysisSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="analysis" ref={ref} className="py-24 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            AI Mining Analysis
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Upload satellite imagery for advanced AI-powered mining detection and legal compliance analysis.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Upload Satellite Imagery</h3>
              <p className="text-gray-400">Select a satellite image to begin AI-powered mining detection and analysis.</p>
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium text-gray-400">Satellite Image File</label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Drag and drop your image here, or click to browse</p>
                <p className="text-sm text-gray-500">Supports .TIF, .TIFF, .JPG, .PNG files</p>
                <input type="file" accept=".tif,.tiff,.jpg,.jpeg,.png" className="hidden" />
              </div>
            </div>

            {/* Analysis Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition-all"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Detect Mining Activity</h4>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Basic AI detection to identify potential mining areas and calculate total coverage.
                </p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <Zap className="w-4 h-4 mr-2" />
                  Start Detection
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-6 cursor-pointer hover:border-red-400 transition-all"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Detect Legal/Illegal Mining</h4>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Advanced analysis to classify mining activities as legal or illegal based on boundary data.
                </p>
                <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Analyze Compliance
                </Button>
              </motion.div>
            </div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-slate-900/50 rounded-xl p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-400">Analysis Progress</span>
                <span className="text-sm text-blue-400">0%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300" style={{ width: '0%' }}></div>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-900/20 border border-green-500/30 rounded-xl p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h4 className="text-lg font-semibold text-green-400">Analysis Complete</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-green-300 text-sm">Total Area</p>
                  <p className="text-green-400 text-xl font-semibold">0.457 km</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-green-300 text-sm">Features</p>
                  <p className="text-green-400 text-xl font-semibold">2</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <p className="text-green-300 text-sm">Confidence</p>
                  <p className="text-green-400 text-xl font-semibold">94.2%</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  📍 View on Map
                </Button>
                <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                  View 3D Terrain
                </Button>
                <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


