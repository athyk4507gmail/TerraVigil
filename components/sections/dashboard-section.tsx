'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, MapPin, AlertTriangle, CheckCircle } from 'lucide-react'

export function DashboardSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const stats = [
    { label: 'Total Mining Area', value: '0.457 km', change: '+12%', color: 'text-blue-400' },
    { label: 'Legal Mining', value: '0.253 km', change: '55%', color: 'text-green-400' },
    { label: 'Illegal Mining', value: '0.204 km', change: '45%', color: 'text-red-400' },
    { label: 'Detection Accuracy', value: '94.2%', change: '+2.1%', color: 'text-cyan-400' },
  ]

  return (
    <section id="dashboard" ref={ref} className="py-24 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Intelligence Dashboard
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time monitoring and analysis of mining activities with comprehensive statistics and insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-sm text-gray-400">{stat.change}</span>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <div className={`text-sm font-medium ${stat.color}`}>
                  {stat.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Location Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-16"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-6 lg:mb-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Detection Zone</h3>
                <p className="text-gray-400">Coordinates: -33.4489° S, -70.6693° W</p>
                <p className="text-gray-400">Location: Santiago, Chile</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                View on Map
              </button>
              <button className="border border-slate-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all">
                Export Data
              </button>
            </div>
          </div>
        </motion.div>

        {/* Status Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-green-400">Legal Mining</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Mining activities within permitted boundaries and regulatory compliance.
            </p>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-red-400">Illegal Mining</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Unauthorized mining activities detected outside legal boundaries.
            </p>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-400">Monitoring Status</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Continuous satellite monitoring with 24/7 surveillance capabilities.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


