import { motion } from 'framer-motion'
import {
  FiCode,
  FiDatabase,
  FiGlobe,
  FiSmartphone,
  FiCloud,
  FiShield
} from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

const featureIcons = [FiCode, FiSmartphone, FiDatabase, FiCloud, FiGlobe, FiShield]

const FeatureCard = ({ feature, index, icon: Icon }: {
  feature: { title: string; description: string }
  index: number
  icon: React.ElementType
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass-card p-6 card-hover"
    >
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
    </motion.div>
  )
}

const Features = () => {
  const { t } = useTranslation()

  const items = t('features.items', { returnObjects: true }) as Array<{
    title: string
    description: string
  }>

  return (
    <section id="servicios" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-4 gradient-text"
          >
            {t('features.heading')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            {t('features.subheading')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} icon={featureIcons[index]} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
