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
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90" />

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
              className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl"
            >
              <form className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/20"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/20"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Mensaje</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/20 h-32"
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
