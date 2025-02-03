import { motion } from 'framer-motion'
import { FiExternalLink, FiStar } from 'react-icons/fi'

const projects = [
  {
    title: 'Sistema de Gestión Financiera',
    description: 'Plataforma integral para gestión de finanzas empresariales',
    image: 'https://picsum.photos/seed/1/600/400',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    metrics: {
      performance: '45% más rápido',
      satisfaction: '98% satisfacción',
      users: '10k+ usuarios'
    },
    testimonial: {
      content: 'La solución superó nuestras expectativas en todos los aspectos.',
      author: 'María González',
      role: 'CTO, FinTech Solutions'
    }
  },
  {
    title: 'App de Comercio Electrónico',
    description: 'Aplicación móvil para comercio electrónico B2B',
    image: 'https://picsum.photos/seed/2/600/400',
    tags: ['React Native', 'Firebase', 'Stripe'],
    metrics: {
      performance: '99.9% uptime',
      satisfaction: '4.8/5 estrellas',
      users: '50k+ descargas'
    },
    testimonial: {
      content: 'Incrementamos nuestras ventas en un 200% desde el lanzamiento.',
      author: 'Carlos Ruiz',
      role: 'CEO, MegaStore'
    }
  },
  {
    title: 'Plataforma Educativa',
    description: 'Sistema de gestión de aprendizaje en línea',
    image: 'https://picsum.photos/seed/3/600/400',
    tags: ['Vue.js', 'Python', 'MongoDB'],
    metrics: {
      performance: '30% mejor retención',
      satisfaction: '96% satisfacción',
      users: '100k+ estudiantes'
    },
    testimonial: {
      content: 'Transformó completamente nuestra forma de enseñar en línea.',
      author: 'Ana Martínez',
      role: 'Directora, EduTech'
    }
  }
]

const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 dark:text-white">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(project.metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-primary font-semibold">{value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {key}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-start space-x-2">
            <FiStar className="text-yellow-400 mt-1" />
            <div>
              <p className="text-gray-600 dark:text-gray-300 italic text-sm mb-2">
                "{project.testimonial.content}"
              </p>
              <div className="text-sm">
                <span className="font-semibold dark:text-white">
                  {project.testimonial.author}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {' '}
                  - {project.testimonial.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Projects = () => {
  return (
    <section id="proyectos" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">
            Proyectos Destacados
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubre cómo hemos ayudado a empresas a alcanzar sus objetivos tecnológicos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a
            href="#contacto"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Ver Más Proyectos</span>
            <FiExternalLink />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
