'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Map, Cube, Brain, Zap, Globe, AlertTriangle, CheckCircle } from 'lucide-react'

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms analyze satellite imagery to identify mining activities with 94%+ accuracy.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Map,
      title: 'Geospatial Intelligence',
      description: 'Interactive mapping with real-time mining detection and legal boundary analysis for comprehensive monitoring.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Cube,
      title: '3D Terrain Analysis',
      description: 'Immersive 3D visualization of mining pits with detailed depth, volume, and slope analysis.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Shield,
      title: 'Legal Compliance',
      description: 'Automated classification of mining activities as legal or illegal based on regulatory boundaries.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Zap,
      title: 'Real-time Monitoring',
      description: 'Continuous satellite surveillance with instant alerts for unauthorized mining activities.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Worldwide monitoring capabilities with support for multiple satellite data sources and regions.',
      color: 'from-cyan-500 to-blue-500',
    },
  ]

  return (
    <section id="features" ref={ref} className="py-24 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Advanced Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Cutting-edge technology for comprehensive mining detection and environmental monitoring.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Legal Mining</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Mining activities within permitted boundaries and regulatory compliance.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-400">0.253 km detected</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Illegal Mining</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Unauthorized mining activities detected outside legal boundaries.
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-400">0.204 km detected</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


