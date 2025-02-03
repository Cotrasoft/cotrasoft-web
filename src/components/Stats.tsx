import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { FiUsers, FiCheckCircle, FiClock, FiSmile } from 'react-icons/fi'

const stats = [
  {
    icon: FiUsers,
    value: 50,
    label: 'Desarrolladores',
    suffix: '+'
  },
  {
    icon: FiCheckCircle,
    value: 200,
    label: 'Proyectos Exitosos',
    suffix: '+'
  },
  {
    icon: FiClock,
    value: 100,
    label: 'Años de Experiencia',
    suffix: '+'
  },
  {
    icon: FiSmile,
    value: 98,
    label: 'Satisfacción del Cliente',
    suffix: '%'
  }
]

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true })

  useEffect(() => {
    if (inView) {
      let startTime: number
      let animationFrame: number

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = timestamp - startTime
        const duration = 2000 // 2 seconds

        const currentCount = Math.min(
          Math.floor((progress / duration) * value),
          value
        )
        setCount(currentCount)

        if (progress < duration) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
      }
    }
  }, [inView, value])

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-bold">
      {count}
      {suffix}
    </span>
  )
}

const Stats = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-primary via-secondary to-accent">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center text-white"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-8 h-8 opacity-80" />
                </div>
                <Counter value={stat.value} suffix={stat.suffix} />
                <div className="mt-2 text-lg opacity-80">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Stats
