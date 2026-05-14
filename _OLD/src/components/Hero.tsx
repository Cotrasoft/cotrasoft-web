import { motion } from 'framer-motion'
import { FiCode, FiDatabase, FiLayout } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  const stats = [
    { label: t('hero.stats.credits') },
    { label: t('hero.stats.education') },
    { label: t('hero.stats.community') },
  ]

  return (
    <section aria-labelledby="hero-heading" className="py-24 relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600">
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
          <h1 id="hero-heading" className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('hero.heading')}
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t('hero.subheading')}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <a
              href="https://app.cotrasoft.co/registro"
              className="inline-block px-8 py-4 rounded-full bg-white text-primary-800 font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl text-lg sm:text-xl"
            >
              {t('hero.cta')}
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
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 text-white"
            >
              <div className="text-3xl font-bold mb-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
