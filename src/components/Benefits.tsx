import { motion } from 'framer-motion'
import {
  FiUsers,
  FiTrendingUp,
  FiBook,
  FiLifeBuoy,
  FiGlobe,
  FiHeart
} from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

const benefitIcons = [FiUsers, FiTrendingUp, FiBook, FiLifeBuoy, FiGlobe, FiHeart]

const Benefits = () => {
  const { t } = useTranslation()

  const items = t('benefits.items', { returnObjects: true }) as Array<{
    title: string
    description: string
  }>

  return (
    <section id="beneficios" aria-labelledby="benefits-heading" className="section-padding bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 id="benefits-heading" className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">
            {t('benefits.heading')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('benefits.subheading')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((benefit, index) => {
            const Icon = benefitIcons[index]
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-700">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="ml-4 text-xl font-semibold dark:text-white">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 ml-16">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>

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
            <span>{t('benefits.cta')}</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Benefits
