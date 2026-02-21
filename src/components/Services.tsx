import { motion } from 'framer-motion'
import {
  FiLifeBuoy,
  FiZap,
  FiCompass,
  FiCheck,
  FiArrowRight
} from 'react-icons/fi'

const services = [
  {
    icon: FiLifeBuoy,
    title: 'Rescate de MVP',
    description:
      'Tu MVP fue construido con IA o por un equipo junior y tiene deuda técnica crítica. En un sprint de 2 semanas auditamos, corregimos e instrumentamos tu código para eliminar riesgos de lanzamiento.',
    deliverables: [
      'Auditoría completa del código',
      'PRs fusionados con correcciones',
      'Runbook de operaciones',
      'Memo de decisión go/no-go'
    ]
  },
  {
    icon: FiZap,
    title: 'Desarrollo Acelerado',
    description:
      'Equipos de desarrolladores senior colombianos, aumentados con modelos de IA de última generación, comprimen ciclos de desarrollo. Software usable entregado en días con seguridad integrada y propiedad total del código.',
    deliverables: [
      'Alcances claros y cronogramas predecibles',
      'Seguridad integrada desde el día uno',
      'Propiedad total del código fuente',
      'Soporte post-entrega incluido'
    ]
  },
  {
    icon: FiCompass,
    title: 'Consultoría Técnica',
    description:
      'Evaluamos tu arquitectura actual, identificamos cuellos de botella y diseñamos una hoja de ruta técnica alineada con tus objetivos de negocio. Decisiones informadas respaldadas por experiencia cooperativa.',
    deliverables: [
      'Evaluación de arquitectura',
      'Hoja de ruta técnica',
      'Recomendaciones priorizadas',
      'Sesiones de transferencia de conocimiento'
    ]
  }
]

const phases = [
  {
    step: '01',
    title: 'Descubrimiento',
    days: 'Días 1-2',
    description:
      'Auditoría técnica, definición de alcance y priorización de riesgos con tu equipo.'
  },
  {
    step: '02',
    title: 'Ejecución',
    days: 'Días 3-7',
    description:
      'Desarrollo intensivo con entregas diarias, revisión de código y despliegue continuo.'
  },
  {
    step: '03',
    title: 'Validación',
    days: 'Días 8-9',
    description:
      'Pruebas de integración, revisión de seguridad y aseguramiento de calidad.'
  },
  {
    step: '04',
    title: 'Entrega',
    days: 'Día 10',
    description:
      'Despliegue a producción, documentación completa y transferencia de conocimiento.'
  }
]

const Services = () => {
  return (
    <section id="servicios" className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 gradient-text">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Equipos senior potenciados con IA que entregan software funcional en días, no meses.
            Sprints estructurados con alcances claros y resultados predecibles.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
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
                  {service.deliverables.map((item) => (
                    <li key={item} className="flex items-start space-x-2">
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
              Nuestro Proceso
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sprints de 2 semanas con fases claras y entregables definidos
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
            <span>Agenda una Consulta</span>
            <FiArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
