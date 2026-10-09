import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { 
  Cpu, 
  Target, 
  BarChart2, 
  FileText, 
  Clock, 
  Calendar, 
  Bot, 
  Activity,
  Layers
} from 'lucide-react'

export default function VisionOperatingSystem() {
  const { t } = useLanguage()
  const [activeNode, setActiveNode] = useState(0)

  const nodeIcons = [
    Target,
    BarChart2,
    FileText,
    Clock,
    Calendar,
    Bot,
    Activity
  ]

  return (
    <section className="py-24 px-6 bg-slate-50/50 dark:bg-navy-900/30 relative border-t border-slate-200/80 dark:border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400 mb-3">
            {t.vision.eyebrow}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {t.vision.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.vision.description}
          </p>
        </div>

        {/* Orbit Visualization & Interactive Nodes */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Visual Orbit Representation */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative flex h-80 w-80 sm:h-96 sm:w-96 items-center justify-center">
              {/* Outer Dashed Orbit Circle */}
              <div className="absolute inset-0 rounded-full border border-dashed border-brand-300/40 dark:border-white/15 animate-[spin_60s_linear_infinite]" />
              {/* Inner Orbit Circle */}
              <div className="absolute inset-10 rounded-full border border-slate-200 dark:border-white/10" />

              {/* Central Engine Pulse */}
              <div className="relative flex flex-col h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-brand-600 text-white shadow-2xl shadow-brand-600/50 text-center p-3 z-10">
                <Cpu className="h-7 w-7 mb-1 animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider leading-tight">
                  {t.vision.coreTitle}
                </span>
              </div>

              {/* Orbiting Satellites */}
              {t.vision.nodes.map((node, i) => {
                const angle = (i / t.vision.nodes.length) * 2 * Math.PI - Math.PI / 2
                const radius = 42 // percentage distance from center
                const left = 50 + radius * Math.cos(angle)
                const top = 50 + radius * Math.sin(angle)
                const isSelected = activeNode === i
                const Icon = nodeIcons[i] || Layers

                return (
                  <button
                    key={node}
                    onClick={() => setActiveNode(i)}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    className={`absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                      isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                    }`}
                  >
                    <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      isSelected
                        ? 'bg-brand-500 text-white ring-4 ring-brand-300/30'
                        : 'bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                    }`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span className={`text-[10px] font-bold text-center whitespace-nowrap px-2 py-0.5 rounded-full ${
                      isSelected 
                        ? 'bg-brand-600 text-white' 
                        : 'bg-white/80 dark:bg-navy-950/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/10'
                    }`}>
                      {node}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Explanation Grid */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">
              Integrated Operating Components
            </div>

            {t.vision.nodes.map((node, idx) => {
              const Icon = nodeIcons[idx] || Layers
              const isSelected = activeNode === idx
              return (
                <div
                  key={node}
                  onClick={() => setActiveNode(idx)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-600/15 border-brand-300 dark:border-brand-500/40 text-brand-700 dark:text-brand-300'
                      : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold">{node}</span>
                  </div>

                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                    Node 0{idx + 1}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
