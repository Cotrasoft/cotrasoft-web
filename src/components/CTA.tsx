import { motion } from 'framer-motion'
import { FiMail, FiMapPin } from 'react-icons/fi'

const contactInfo = [
  {
    icon: FiMail,
    label: 'Email',
    value: 'gerencia@cotrasoft.co',
    href: 'mailto:gerencia@cotrasoft.co'
  },
  {
    icon: FiMapPin,
    label: 'Ubicación',
    value: 'Colombia',
    // href: 'https://maps.google.com'
  }
]

const CTA = () => {
  return (
    <section id="unete" className="relative">
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
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Únete a Nuestra Comunidad de Desarrolladores
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Sé parte de una cooperativa innovadora donde tu talento y creatividad son valorados. Juntos construimos el futuro del desarrollo de software en Colombia.
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
                  <label className="block text-gray-700 font-medium mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Mensaje</label>
                  <textarea
                    className="input-field h-32"
                    placeholder="Cuéntanos sobre ti y tu experiencia..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary py-4 text-lg font-semibold"
                >
                  Enviar Solicitud
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
