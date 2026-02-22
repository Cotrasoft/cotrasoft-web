import { motion } from 'framer-motion'
import { FiExternalLink, FiStar } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

interface ProjectItem {
  title: string
  description: string
  metrics: {
    performance: string
    satisfaction: string
    users: string
  }
  testimonial: {
    content: string
    author: string
    role: string
  }
}

const projectImages = [
  'https://picsum.photos/seed/1/600/400',
  'https://picsum.photos/seed/2/600/400',
  'https://picsum.photos/seed/3/600/400',
]

const projectTags = [
  ['React', 'Node.js', 'PostgreSQL'],
  ['React Native', 'Firebase', 'Stripe'],
  ['Vue.js', 'Python', 'MongoDB'],
]

const ProjectCard = ({ project, index }: { project: ProjectItem; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={projectImages[index]}
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
          {projectTags[index].map((tag) => (
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
  const { t } = useTranslation()

  const items = t('projects.items', { returnObjects: true }) as ProjectItem[]

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
            {t('projects.heading')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('projects.subheading')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
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
            <span>{t('projects.cta')}</span>
            <FiExternalLink />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
