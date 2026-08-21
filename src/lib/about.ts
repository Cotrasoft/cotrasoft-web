import type { SupportedLang } from "../consts";
import { ENTITY_VALUES } from "./legal";

export interface AboutEntityField {
  label: string;
  value: string;
}

export interface AboutServiceItem {
  name: string;
  blurb: string;
}

export interface AboutDoc {
  title: string;
  description: string;
  lead: string;
  storyHeading: string;
  storyParagraphs: string[];
  servicesHeading: string;
  servicesParagraphs: string[];
  serviceItems: AboutServiceItem[];
  servicesMoreLabel: string;
  entityHeading: string;
  entityDescription: string;
  entityFields: AboutEntityField[];
  ctaHeading: string;
  ctaText: string;
  ctaJoinLabel: string;
  ctaContactLabel: string;
  ctaContactHref: string;
}

export const aboutDocs: Record<SupportedLang, AboutDoc> = {
  es: {
    title: "Quiénes somos - Cotrasoft",
    description:
      "Cotrasoft es una cooperativa multiactiva de trabajadores de software de Bogotá, Colombia: historia, servicios y datos registrales de la entidad.",
    lead: "Cotrasoft es una cooperativa multiactiva de aporte y crédito de trabajadores de software colombiana, inscrita el 11 de diciembre de 2024 con registro S0065848 y con domicilio en Bogotá D.C. Somos más de 40 asociados que desarrollamos, diseñamos y gestionamos proyectos de software juntos, como empresa asociativa sin ánimo de lucro.",
    storyHeading: "De dónde venimos",
    storyParagraphs: [
      "Cotrasoft nació en 2024, cuando más de 40 personas con experiencia en los distintos roles de los proyectos de software —desarrollo, diseño, producto, calidad, infraestructura y gestión— decidimos constituir una cooperativa. Queríamos un espacio donde el talento tecnológico se valore con participación real y no solamente con un salario.",
      "Constituir la cooperativa tomó meses de asambleas, estatutos y trámites, con el acompañamiento del ecosistema de economía solidaria colombiano. Desde entonces trabajamos en proyectos reales para clientes reales: las decisiones técnicas, comerciales y humanas se toman entre todos, y los excedentes pertenecen a los asociados que los generan.",
    ],
    servicesHeading: "Qué hacemos",
    servicesParagraphs: [
      "Operamos como un equipo senior de desarrollo potenciado con IA, organizado en sprints de dos semanas con alcances claros y resultados predecibles, desde Colombia para clientes en Colombia y Estados Unidos.",
    ],
    serviceItems: [
      {
        name: "Rescate de MVP",
        blurb:
          "Auditamos, corregimos e instrumentamos tu producto en un sprint de dos semanas para eliminar riesgos de lanzamiento.",
      },
      {
        name: "Desarrollo acelerado",
        blurb:
          "Equipos de desarrolladores senior colombianos que comprimen ciclos de desarrollo con seguridad integrada y propiedad total del código.",
      },
      {
        name: "Consultoría técnica",
        blurb:
          "Evaluación de arquitectura, identificación de cuellos de botella y hoja de ruta técnica alineada con tus objetivos de negocio.",
      },
    ],
    servicesMoreLabel: "Conoce el detalle de cada servicio y nuestro proceso",
    entityHeading: "Datos de la entidad",
    entityDescription:
      "Estos son los datos registrales con los que identificamos a Cotrasoft ante clientes, aliados y entidades públicas.",
    entityFields: [
      { label: "Razón social", value: ENTITY_VALUES.name },
      { label: "Sigla", value: ENTITY_VALUES.sigla },
      { label: "NIT", value: ENTITY_VALUES.nit },
      { label: "Inscripción", value: ENTITY_VALUES.registration },
      { label: "Fecha de inscripción", value: ENTITY_VALUES.registrationDate },
      { label: "Dirección", value: ENTITY_VALUES.address },
      { label: "Municipio", value: ENTITY_VALUES.municipality },
      { label: "Correo electrónico", value: ENTITY_VALUES.email },
    ],
    ctaHeading: "Trabaja con nosotros o únete",
    ctaText:
      "La puerta está abierta, ya sea para confiarnos un proyecto o para sumarte como asociado.",
    ctaJoinLabel: "Quiero asociarme",
    ctaContactLabel: "Escríbenos",
    ctaContactHref: `mailto:${ENTITY_VALUES.email}`,
  },
  en: {
    title: "About Us - Cotrasoft",
    description:
      "Cotrasoft is a multi-active cooperative of software workers based in Bogotá, Colombia: our story, our services and the entity's registry information.",
    lead: "Cotrasoft is a Colombian multi-active savings and credit cooperative of software workers, registered on December 11, 2024 under registry S0065848 and domiciled in Bogotá D.C. We are 40+ members who develop, design and manage software projects together, as a non-profit associative enterprise.",
    storyHeading: "Where we come from",
    storyParagraphs: [
      "Cotrasoft was born in 2024, when more than 40 people with experience across every role in software projects —development, design, product, quality, infrastructure and management— decided to incorporate a cooperative. We wanted a place where tech talent is valued with real ownership, not just a salary.",
      "Incorporating the cooperative took months of assemblies, bylaws and paperwork, supported by Colombia's solidarity-economy ecosystem. Since then we have shipped real projects for real clients: technical, business and human decisions are made together, and surpluses belong to the members who generate them.",
    ],
    servicesHeading: "What we do",
    servicesParagraphs: [
      "We operate as a senior AI-augmented development team organized in two-week sprints with clear scopes and predictable outcomes, working from Colombia for clients in Colombia and the United States.",
    ],
    serviceItems: [
      {
        name: "MVP rescue",
        blurb:
          "We audit, fix and instrument your product in a two-week sprint to eliminate launch risks.",
      },
      {
        name: "Accelerated development",
        blurb:
          "Teams of senior Colombian developers who compress development cycles with security built in and full code ownership.",
      },
      {
        name: "Technical consulting",
        blurb:
          "Architecture assessment, bottleneck identification and a technical roadmap aligned with your business goals.",
      },
    ],
    servicesMoreLabel: "See the details of each service and our process",
    entityHeading: "Entity information",
    entityDescription:
      "This is the registry information we use to identify Cotrasoft to clients, partners and public entities.",
    entityFields: [
      { label: "Legal name", value: ENTITY_VALUES.name },
      { label: "Acronym", value: ENTITY_VALUES.sigla },
      { label: "Tax ID (NIT)", value: ENTITY_VALUES.nit },
      { label: "Registration", value: ENTITY_VALUES.registration },
      { label: "Registration date", value: ENTITY_VALUES.registrationDate },
      { label: "Address", value: ENTITY_VALUES.address },
      { label: "City", value: ENTITY_VALUES.municipality },
      { label: "Email", value: ENTITY_VALUES.email },
    ],
    ctaHeading: "Work with us or become a member",
    ctaText:
      "The door is open, whether you want to trust us with a project or join as a member.",
    ctaJoinLabel: "I want to join",
    ctaContactLabel: "Write to us",
    ctaContactHref: `mailto:${ENTITY_VALUES.email}`,
  },
};
