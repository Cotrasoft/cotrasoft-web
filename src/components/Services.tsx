import { motion } from 'framer-motion'
import {
  FiLifeBuoy,
  FiZap,
  FiCompass,
  FiCheck,
  FiArrowRight
} from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

const serviceIcons = [FiLifeBuoy, FiZap, FiCompass]
const serviceKeys = ['rescue', 'accelerated', 'consulting'] as const

const Services = () => {
  const { t } = useTranslation()

  const services = serviceKeys.map((key, i) => ({
    icon: serviceIcons[i],
    title: t(`services.${key}.title`),
    description: t(`services.${key}.description`),
    deliverables: t(`services.${key}.deliverables`, { returnObjects: true }) as string[],
  }))

  const phases = (t('services.process.phases', { returnObjects: true }) as Array<{
    title: string
    days: string
    description: string
  }>).map((phase, i) => ({
    step: String(i + 1).padStart(2, '0'),
    ...phase,
  }))

  return (
    <section id="servicios" aria-labelledby="services-heading" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 id="services-heading" className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">
            {t('services.heading')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('services.subheading')}
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white dark:bg-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-700">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold dark:text-white">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <FiCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 gradient-text">
              {t('services.process.heading')}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('services.process.subheading')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-6 rounded-xl bg-white dark:bg-gray-700/50"
              >
                <span className="text-5xl font-bold text-primary-200 dark:text-primary-800">
                  {phase.step}
                </span>
                <h4 className="text-lg font-semibold dark:text-white mt-2 mb-1">
                  {phase.title}
                </h4>
                <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-primary-50 text-primary mb-3">
                  {phase.days}
                </span>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {phase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="#unete"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>{t('services.cta')}</span>
            <FiArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
