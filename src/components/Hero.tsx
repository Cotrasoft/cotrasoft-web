import { motion } from 'framer-motion'
import { FiCode, FiDatabase, FiLayout } from 'react-icons/fi'

const FloatingElement = ({ icon: Icon, delay }: { icon: React.ElementType; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay,
      duration: 0.5,
      y: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }}
    className="absolute text-white/30 text-4xl sm:text-6xl"
  >
    <Icon />
  </motion.div>
)

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4">
          <FloatingElement icon={FiCode} delay={0} />
        </div>
        <div className="absolute top-1/4 right-1/4">
          <FloatingElement icon={FiDatabase} delay={0.2} />
        </div>
        <div className="absolute bottom-1/4 left-1/3">
          <FloatingElement icon={FiLayout} delay={0.4} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            Excelencia en Desarrollo{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
              Cooperativo
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Uniendo talento y tecnología para crear soluciones innovadoras en un ambiente colaborativo
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <a
              href="#unete"
              className="inline-block btn-primary text-lg sm:text-xl"
            >
              Únete a Nuestra Cooperativa
            </a>
          </motion.div>
        </motion.div>

        {/* Glass Card Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { label: 'Desarrolladores', value: '50+' },
            { label: 'Proyectos Completados', value: '200+' },
            { label: 'Años de Experiencia', value: '100+' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 text-white"
            >
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-white/80">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
