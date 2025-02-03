import { motion } from 'framer-motion'
import {
  FiCode,
  FiDatabase,
  FiGlobe,
  FiSmartphone,
  FiCloud,
  FiShield
} from 'react-icons/fi'

const features = [
  {
    icon: FiCode,
    title: 'Desarrollo Web',
    description: 'Creación de aplicaciones web modernas y responsivas con las últimas tecnologías'
  },
  {
    icon: FiSmartphone,
    title: 'Desarrollo Móvil',
    description: 'Aplicaciones nativas y multiplataforma para iOS y Android'
  },
  {
    icon: FiDatabase,
    title: 'Bases de Datos',
    description: 'Diseño e implementación de bases de datos escalables y seguras'
  },
  {
    icon: FiCloud,
    title: 'Cloud Computing',
    description: 'Soluciones en la nube utilizando AWS, Azure y Google Cloud'
  },
  {
    icon: FiGlobe,
    title: 'APIs y Microservicios',
    description: 'Desarrollo de APIs RESTful y arquitecturas de microservicios'
  },
  {
    icon: FiShield,
    title: 'Seguridad',
    description: 'Implementación de mejores prácticas de seguridad y protección de datos'
  }
]

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const Icon = feature.icon

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
            Nuestros Servicios
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            Ofrecemos una amplia gama de servicios de desarrollo para satisfacer todas tus necesidades tecnológicas
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
