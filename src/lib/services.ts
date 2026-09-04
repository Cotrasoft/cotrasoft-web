import type { SupportedLang } from "../consts";

export interface Service {
  title: string;
  description: string;
  deliverables: string[];
}

export interface Phase {
  title: string;
  days: string;
  description: string;
}

export interface ServicesContent {
  heading: string;
  subheading: string;
  cta: string;
  rescue: Service;
  accelerated: Service;
  consulting: Service;
  process: {
    heading: string;
    subheading: string;
    phases: Phase[];
  };
}

export const servicesContent: Record<SupportedLang, ServicesContent> = {
  es: {
    heading: "Nuestros servicios",
    subheading:
      "Equipos senior potenciados con IA que entregan software funcional en días, no meses. Sprints estructurados con alcances claros y resultados predecibles.",
    cta: "Agenda una consulta",
    rescue: {
      title: "Rescate de MVP",
      description:
        "Tu MVP fue construido con IA o por un equipo junior y tiene deuda técnica crítica. En un sprint de 2 semanas auditamos, corregimos e instrumentamos tu código para eliminar riesgos de lanzamiento.",
      deliverables: [
        "Auditoría completa del código",
        "PRs fusionados con correcciones",
        "Runbook de operaciones",
        "Memo de decisión go/no-go",
      ],
    },
    accelerated: {
      title: "Desarrollo acelerado",
      description:
        "Equipos de desarrolladores senior colombianos, aumentados con modelos de IA de última generación, comprimen ciclos de desarrollo. Software usable entregado en días con seguridad integrada y propiedad total del código.",
      deliverables: [
        "Alcances claros y cronogramas predecibles",
        "Seguridad integrada desde el día uno",
        "Propiedad total del código fuente",
        "Soporte post-entrega incluido",
      ],
    },
    consulting: {
      title: "Consultoría técnica",
      description:
        "Evaluamos tu arquitectura actual, identificamos cuellos de botella y diseñamos una hoja de ruta técnica alineada con tus objetivos de negocio. Decisiones informadas respaldadas por experiencia cooperativa.",
      deliverables: [
        "Evaluación de arquitectura",
        "Hoja de ruta técnica",
        "Recomendaciones priorizadas",
        "Sesiones de transferencia de conocimiento",
      ],
    },
    process: {
      heading: "Nuestro proceso",
      subheading:
        "Sprints de 2 semanas con fases claras y entregables definidos",
      phases: [
        {
          title: "Descubrimiento",
          days: "Días 1-2",
          description:
            "Auditoría técnica, definición de alcance y priorización de riesgos con tu equipo.",
        },
        {
          title: "Ejecución",
          days: "Días 3-7",
          description:
            "Desarrollo intensivo con entregas diarias, revisión de código y despliegue continuo.",
        },
        {
          title: "Validación",
          days: "Días 8-9",
          description:
            "Pruebas de integración, revisión de seguridad y aseguramiento de calidad.",
        },
        {
          title: "Entrega",
          days: "Día 10",
          description:
            "Despliegue a producción, documentación completa y transferencia de conocimiento.",
        },
      ],
    },
  },
  en: {
    heading: "Our services",
    subheading:
      "Senior teams powered by AI delivering functional software in days, not months. Structured sprints with clear scopes and predictable outcomes.",
    cta: "Schedule a consultation",
    rescue: {
      title: "MVP rescue",
      description:
        "Your MVP was built with AI or by a junior team and has critical technical debt. In a 2-week sprint we audit, fix, and instrument your code to eliminate launch risks.",
      deliverables: [
        "Complete code audit",
        "Merged PRs with fixes",
        "Operations runbook",
        "Go/no-go decision memo",
      ],
    },
    accelerated: {
      title: "Accelerated development",
      description:
        "Teams of senior Colombian developers, augmented with cutting-edge AI models, compress development cycles. Usable software delivered in days with built-in security and full code ownership.",
      deliverables: [
        "Clear scopes and predictable timelines",
        "Built-in security from day one",
        "Full source code ownership",
        "Post-delivery support included",
      ],
    },
    consulting: {
      title: "Technical consulting",
      description:
        "We evaluate your current architecture, identify bottlenecks, and design a technical roadmap aligned with your business goals. Informed decisions backed by cooperative expertise.",
      deliverables: [
        "Architecture assessment",
        "Technical roadmap",
        "Prioritized recommendations",
        "Knowledge transfer sessions",
      ],
    },
    process: {
      heading: "Our process",
      subheading: "2-week sprints with clear phases and defined deliverables",
      phases: [
        {
          title: "Discovery",
          days: "Days 1-2",
          description:
            "Technical audit, scope definition, and risk prioritization with your team.",
        },
        {
          title: "Execution",
          days: "Days 3-7",
          description:
            "Intensive development with daily deliveries, code review, and continuous deployment.",
        },
        {
          title: "Validation",
          days: "Days 8-9",
          description:
            "Integration testing, security review, and quality assurance.",
        },
        {
          title: "Delivery",
          days: "Day 10",
          description:
            "Production deployment, complete documentation, and knowledge transfer.",
        },
      ],
    },
  },
};
