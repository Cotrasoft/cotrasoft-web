import { motion } from 'framer-motion'
import {
  FiUsers,
  FiTrendingUp,
  FiBook,
  FiLifeBuoy,
  FiGlobe,
  FiHeart
} from 'react-icons/fi'

const benefits = [
  {
    icon: FiUsers,
    title: 'Comunidad Colaborativa',
    description: 'Forma parte de una red de desarrolladores talentosos y apasionados'
  },
  {
    icon: FiTrendingUp,
    title: 'Crecimiento Profesional',
    description: 'Oportunidades de desarrollo y aprendizaje continuo'
  },
  {
    icon: FiBook,
    title: 'Recursos de Aprendizaje',
    description: 'Acceso a cursos, workshops y materiales educativos'
  },
  {
    icon: FiLifeBuoy,
    title: 'Soporte Mutuo',
    description: 'Mentorías y apoyo técnico de la comunidad'
  },
  {
    icon: FiGlobe,
    title: 'Proyectos Globales',
    description: 'Participa en proyectos internacionales desafiantes'
  },
  {
    icon: FiHeart,
    title: 'Beneficios Cooperativos',
    description: 'Participación en ganancias y toma de decisiones'
  }
]

const Benefits = () => {
  return (
    <section id="beneficios" className="section-padding bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">
            Beneficios para Miembros
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Únete a nuestra cooperativa y disfruta de ventajas exclusivas diseñadas para impulsar tu carrera
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white">
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
            <span>Descubre Más Beneficios</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Benefits
