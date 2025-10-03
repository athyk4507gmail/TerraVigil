'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Shield, Map, Cube, Brain } from 'lucide-react'

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const stats = [
    { icon: Shield, value: '94.2%', label: 'Detection Accuracy', color: 'text-blue-400' },
    { icon: Map, value: '0.457 km', label: 'Total Mining Area', color: 'text-green-400' },
    { icon: Cube, value: '2.45M m³', label: 'Volume Analyzed', color: 'text-purple-400' },
    { icon: Brain, value: '24/7', label: 'AI Monitoring', color: 'text-cyan-400' },
  ]

  return (
    <section ref={ref} className="py-16 bg-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                className={`text-3xl font-bold ${stat.color} mb-2`}
              >
                {stat.value}
              </motion.div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


