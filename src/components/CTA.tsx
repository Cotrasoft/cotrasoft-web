import { motion } from 'framer-motion'
import { FiMail, FiMapPin } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

const CTA = () => {
  const { t } = useTranslation()

  const contactInfo = [
    {
      icon: FiMail,
      label: 'Email',
      value: t('cta.contact.email'),
      href: `mailto:${t('cta.contact.email')}`
    },
    {
      icon: FiMapPin,
      label: t('cta.contact.location'),
      value: t('cta.contact.location'),
    }
  ]

  return (
    <section id="unete" aria-labelledby="cta-heading" className="relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600" />

      {/* Content */}
      <div className="relative section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main CTA */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold mb-6">
                {t('cta.heading')}
              </h2>
              <p className="text-xl mb-8 text-white/90">
                {t('cta.description')}
              </p>
              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon
                  return (
                    <motion.a
                      key={info.label}
                      href={info.href}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors duration-300"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{info.value}</span>
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-8 shadow-xl"
            >
              <form className="space-y-6">
                <div>
                  <label htmlFor="cta-fullname" className="block text-gray-700 font-medium mb-2">{t('cta.form.fullName')}</label>
                  <input
                    id="cta-fullname"
                    type="text"
                    className="input-field"
                    placeholder={t('cta.form.fullNamePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="cta-email" className="block text-gray-700 font-medium mb-2">{t('cta.form.email')}</label>
                  <input
                    id="cta-email"
                    type="email"
                    className="input-field"
                    placeholder={t('cta.form.emailPlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="cta-message" className="block text-gray-700 font-medium mb-2">{t('cta.form.message')}</label>
                  <textarea
                    id="cta-message"
                    className="input-field h-32"
                    placeholder={t('cta.form.messagePlaceholder')}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary py-4 text-lg font-semibold"
                >
                  {t('cta.form.submit')}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA
