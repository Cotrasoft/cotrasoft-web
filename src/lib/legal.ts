import type { SupportedLang } from '../consts';

export interface LegalSection {
	heading: string;
	paragraphs: string[];
}

export interface LegalEntityField {
	label: string;
	value: string;
}

export interface LegalEntity {
	heading: string;
	description: string;
	fields: LegalEntityField[];
}

export interface LegalDoc {
	title: string;
	description: string;
	lastUpdatedLabel: string;
	lastUpdated: string;
	entity: LegalEntity;
	sections: LegalSection[];
}

export interface LegalContent {
	terms: LegalDoc;
	privacy: LegalDoc;
}

export type LegalSlug = 'terms' | 'privacy';

export const legalSlugs: Record<SupportedLang, Record<LegalSlug, string>> = {
	es: { terms: 'terminos', privacy: 'privacidad' },
	en: { terms: 'terms', privacy: 'privacy' },
};

const ENTITY_VALUES = {
	name: 'Cooperativa Multiactiva de Aporte y Crédito de Trabajadores de Software Cotrasoft',
	sigla: 'COTRASOFT',
	nit: '901897192',
	registration: 'S0065848',
	registrationDate: '11 de diciembre de 2024',
	address: 'Cl 22 B No. 54 21 To 3 Ap 601',
	municipality: 'Bogotá D.C.',
	email: 'cotrasoft@gmail.com',
} as const;

export const legal: Record<SupportedLang, LegalContent> = {
	es: {
		terms: {
			title: 'Términos de Servicio',
			description:
				'Condiciones que rigen el uso del sitio web cotrasoft.co y de los servicios informativos de Cotrasoft.',
			lastUpdatedLabel: 'Última actualización',
			lastUpdated: '15 de agosto de 2026',
			entity: {
				heading: 'Entidad responsable',
				description:
					'Los presentes términos se suscriben con la siguiente entidad, en adelante “COTRASOFT”.',
				fields: [
					{ label: 'Razón social', value: ENTITY_VALUES.name },
					{ label: 'Sigla', value: ENTITY_VALUES.sigla },
					{ label: 'NIT', value: ENTITY_VALUES.nit },
					{ label: 'Inscripción', value: ENTITY_VALUES.registration },
					{ label: 'Fecha de inscripción', value: ENTITY_VALUES.registrationDate },
					{ label: 'Dirección', value: ENTITY_VALUES.address },
					{ label: 'Municipio', value: ENTITY_VALUES.municipality },
					{ label: 'Correo electrónico', value: ENTITY_VALUES.email },
				],
			},
			sections: [
				{
					heading: '1. Aceptación de los términos',
					paragraphs: [
						'Al acceder o utilizar el sitio web cotrasoft.co, usted acepta de manera voluntaria y sin reservas los presentes Términos de Servicio. Si no está de acuerdo con alguna de estas condiciones, le solicitamos abstenerse de usar el sitio.',
						'Estos términos podrán ser actualizados en cualquier momento. Las modificaciones entrarán en vigor a partir de su publicación en esta página, por lo que recomendamos revisarla periódicamente.',
					],
				},
				{
					heading: '2. Naturaleza de la entidad',
					paragraphs: [
						'COTRASOFT es una cooperativa multiactiva de aporte y crédito, empresa asociativa sin ánimo de lucro, de responsabilidad limitada, con número de asociados y capital social variable e ilimitado, con domicilio principal en la ciudad de Bogotá D.C., República de Colombia, y duración indefinida.',
						'Su objeto social es servir de instrumento empresarial para prestar apoyo y contribuir al mejoramiento integral de sus asociados y de la comunidad en general a través del impulso del sector tecnológico.',
					],
				},
				{
					heading: '3. Uso del sitio',
					paragraphs: [
						'cotrasoft.co es un sitio de carácter informativo que presenta los servicios y beneficios de la cooperativa. La plataforma transaccional de asociados se encuentra en app.cotrasoft.co y se rige por sus propios términos y condiciones.',
						'El usuario se compromete a hacer un uso lícito y adecuado del sitio, absteniéndose de realizar acciones que puedan dañar, inutilizar, sobrecargar o deteriorar el sitio, así como de intentar acceder de manera no autorizada a sus sistemas.',
					],
				},
				{
					heading: '4. Propiedad intelectual',
					paragraphs: [
						'Todos los contenidos del sitio, incluidos textos, logotipos, gráficos, imágenes y elementos de diseño, son propiedad de COTRASOFT o de sus respectivos titulares y se encuentran protegidos por las normas de propiedad intelectual vigentes.',
						'Queda prohibida su reproducción, distribución o transformación total o parcial sin autorización previa y escrita de COTRASOFT.',
					],
				},
				{
					heading: '5. Enlaces a terceros',
					paragraphs: [
						'El sitio puede contener enlaces a sitios web de terceros. COTRASOFT no controla ni se hace responsable del contenido, las políticas de privacidad o las prácticas de dichos sitios.',
					],
				},
				{
					heading: '6. Limitación de responsabilidad',
					paragraphs: [
						'El contenido del sitio se proporciona con fines informativos y COTRASOFT no garantiza que esté libre de errores u omisiones. En la medida permitida por la ley, COTRASOFT no será responsable por daños directos o indirectos derivados del uso o de la imposibilidad de uso del sitio.',
					],
				},
				{
					heading: '7. Ley aplicable y jurisdicción',
					paragraphs: [
						'Los presentes términos se rigen por las leyes de la República de Colombia. Cualquier controversia derivada del uso del sitio será sometida a la jurisdicción ordinaria colombiana, con domicilio en la ciudad de Bogotá D.C.',
					],
				},
				{
					heading: '8. Contacto',
					paragraphs: [
						'Para cualquier consulta relacionada con estos Términos de Servicio, puede comunicarse con nosotros al correo electrónico indicado en la sección de la entidad responsable.',
					],
				},
			],
		},
		privacy: {
			title: 'Política de Privacidad',
			description:
				'Cómo COTRASOFT recopila, usa y protege los datos personales de los usuarios de cotrasoft.co.',
			lastUpdatedLabel: 'Última actualización',
			lastUpdated: '15 de agosto de 2026',
			entity: {
				heading: 'Responsable del tratamiento',
				description:
					'El responsable del tratamiento de los datos personales es la siguiente entidad.',
				fields: [
					{ label: 'Razón social', value: ENTITY_VALUES.name },
					{ label: 'Sigla', value: ENTITY_VALUES.sigla },
					{ label: 'NIT', value: ENTITY_VALUES.nit },
					{ label: 'Inscripción', value: ENTITY_VALUES.registration },
					{ label: 'Fecha de inscripción', value: ENTITY_VALUES.registrationDate },
					{ label: 'Dirección', value: ENTITY_VALUES.address },
					{ label: 'Municipio', value: ENTITY_VALUES.municipality },
					{ label: 'Correo electrónico', value: ENTITY_VALUES.email },
				],
			},
			sections: [
				{
					heading: '1. Datos que recopilamos',
					paragraphs: [
						'COTRASOFT puede recopilar los datos personales que usted nos suministre voluntariamente a través de los canales de contacto del sitio, tales como nombre, correo electrónico y el contenido de su mensaje.',
						'También podemos recopilar datos de carácter técnico relacionados con la navegación, como dirección IP, tipo de navegador y páginas visitadas, con fines estadísticos y de mejora del sitio.',
					],
				},
				{
					heading: '2. Finalidad del tratamiento',
					paragraphs: [
						'Los datos personales se tratan para atender las consultas y solicitudes recibidas, y para adelantar las actividades propias del objeto social de la cooperativa, tales como la vinculación y gestión de asociados, la prestación de servicios crediticios y el desarrollo de programas de formación y beneficios.',
						'Lo anterior en concordancia con el estatuto social de la cooperativa y la normatividad que rige el tratamiento de datos personales.',
					],
				},
				{
					heading: '3. Base legal',
					paragraphs: [
						'El tratamiento de datos personales se realiza con fundamento en el consentimiento del titular y en el cumplimiento de las obligaciones legales y estatutarias de la cooperativa, de conformidad con la Ley 1581 de 2012 y sus decretos reglamentarios.',
					],
				},
				{
					heading: '4. Compartir información',
					paragraphs: [
						'COTRASOFT no vende ni comercializa los datos personales. Los datos podrán ser compartidos únicamente con autoridades competentes o terceros autorizados cuando exista obligación legal o cuando sea necesario para el cumplimiento del objeto social, garantizando en todo caso su confidencialidad.',
					],
				},
				{
					heading: '5. Conservación de los datos',
					paragraphs: [
						'Los datos personales se conservarán durante el tiempo necesario para cumplir las finalidades descritas y, en todo caso, por los términos establecidos en la normatividad aplicable.',
					],
				},
				{
					heading: '6. Derechos del titular (Habeas Data)',
					paragraphs: [
						'Como titular de los datos personales, usted tiene derecho a conocer, actualizar y rectificar sus datos, a solicitar prueba de la autorización otorgada, a ser informado sobre el uso que se les ha dado, a revocar la autorización y a solicitar su supresión cuando proceda, de conformidad con la Ley 1581 de 2012.',
					],
				},
				{
					heading: '7. Seguridad de la información',
					paragraphs: [
						'COTRASOFT adopta medidas de seguridad técnicas y organizativas razonables para proteger los datos personales contra acceso no autorizado, pérdida, alteración o divulgación.',
					],
				},
				{
					heading: '8. Peticiones, quejas y reclamos',
					paragraphs: [
						'Para ejercer sus derechos o presentar consultas, quejas o reclamos relacionados con el tratamiento de sus datos personales, puede comunicarse con nosotros al correo electrónico indicado en la sección del responsable del tratamiento.',
					],
				},
			],
		},
	},
	en: {
		terms: {
			title: 'Terms of Service',
			description:
				'Terms governing the use of the cotrasoft.co website and Cotrasoft’s informational services.',
			lastUpdatedLabel: 'Last updated',
			lastUpdated: 'August 15, 2026',
			entity: {
				heading: 'Responsible entity',
				description:
					'These terms are entered into with the following entity, hereinafter “COTRASOFT”.',
				fields: [
					{ label: 'Legal name', value: ENTITY_VALUES.name },
					{ label: 'Acronym', value: ENTITY_VALUES.sigla },
					{ label: 'Tax ID (NIT)', value: ENTITY_VALUES.nit },
					{ label: 'Registration', value: ENTITY_VALUES.registration },
					{ label: 'Registration date', value: ENTITY_VALUES.registrationDate },
					{ label: 'Address', value: ENTITY_VALUES.address },
					{ label: 'City', value: ENTITY_VALUES.municipality },
					{ label: 'Email', value: ENTITY_VALUES.email },
				],
			},
			sections: [
				{
					heading: '1. Acceptance of terms',
					paragraphs: [
						'By accessing or using the cotrasoft.co website, you voluntarily and unreservedly accept these Terms of Service. If you do not agree with any of these conditions, please refrain from using the site.',
						'These terms may be updated at any time. Changes will take effect upon publication on this page, so we recommend reviewing it periodically.',
					],
				},
				{
					heading: '2. Nature of the entity',
					paragraphs: [
						'COTRASOFT is a multi-active savings and credit cooperative, a non-profit associative enterprise with limited liability, a variable and unlimited number of members and share capital, domiciled in Bogotá D.C., Republic of Colombia, with indefinite duration.',
						'Its corporate purpose is to serve as a business instrument to support and contribute to the comprehensive improvement of its members and the community in general through the promotion of the technology sector.',
					],
				},
				{
					heading: '3. Use of the site',
					paragraphs: [
						'cotrasoft.co is an informational website presenting the cooperative’s services and benefits. The member transactional platform is located at app.cotrasoft.co and is governed by its own terms and conditions.',
						'The user agrees to make lawful and appropriate use of the site, refraining from actions that may damage, disable, overload or impair the site, or attempt to gain unauthorized access to its systems.',
					],
				},
				{
					heading: '4. Intellectual property',
					paragraphs: [
						'All site content, including text, logos, graphics, images and design elements, is the property of COTRASOFT or its respective owners and is protected by applicable intellectual property laws.',
						'Its reproduction, distribution or transformation, in whole or in part, is prohibited without the prior written authorization of COTRASOFT.',
					],
				},
				{
					heading: '5. Third-party links',
					paragraphs: [
						'The site may contain links to third-party websites. COTRASOFT does not control and is not responsible for the content, privacy policies or practices of such sites.',
					],
				},
				{
					heading: '6. Limitation of liability',
					paragraphs: [
						'Site content is provided for informational purposes and COTRASOFT does not guarantee it is free of errors or omissions. To the extent permitted by law, COTRASOFT shall not be liable for direct or indirect damages arising from the use or inability to use the site.',
					],
				},
				{
					heading: '7. Governing law and jurisdiction',
					paragraphs: [
						'These terms are governed by the laws of the Republic of Colombia. Any dispute arising from the use of the site shall be submitted to the ordinary Colombian courts, with domicile in the city of Bogotá D.C.',
					],
				},
				{
					heading: '8. Contact',
					paragraphs: [
						'For any questions regarding these Terms of Service, you may contact us at the email address indicated in the responsible entity section.',
					],
				},
			],
		},
		privacy: {
			title: 'Privacy Policy',
			description:
				'How COTRASOFT collects, uses and protects the personal data of cotrasoft.co users.',
			lastUpdatedLabel: 'Last updated',
			lastUpdated: 'August 15, 2026',
			entity: {
				heading: 'Data controller',
				description: 'The controller of personal data processing is the following entity.',
				fields: [
					{ label: 'Legal name', value: ENTITY_VALUES.name },
					{ label: 'Acronym', value: ENTITY_VALUES.sigla },
					{ label: 'Tax ID (NIT)', value: ENTITY_VALUES.nit },
					{ label: 'Registration', value: ENTITY_VALUES.registration },
					{ label: 'Registration date', value: ENTITY_VALUES.registrationDate },
					{ label: 'Address', value: ENTITY_VALUES.address },
					{ label: 'City', value: ENTITY_VALUES.municipality },
					{ label: 'Email', value: ENTITY_VALUES.email },
				],
			},
			sections: [
				{
					heading: '1. Data we collect',
					paragraphs: [
						'COTRASOFT may collect the personal data you voluntarily provide through the site’s contact channels, such as name, email address and the content of your message.',
						'We may also collect technical browsing data, such as IP address, browser type and pages visited, for statistical and site-improvement purposes.',
					],
				},
				{
					heading: '2. Purpose of processing',
					paragraphs: [
						'Personal data is processed to respond to inquiries and requests received, and to carry out activities inherent to the cooperative’s corporate purpose, such as member onboarding and management, the provision of credit services and the development of training and benefit programs.',
						'The foregoing is in accordance with the cooperative’s bylaws and the regulations governing personal data processing.',
					],
				},
				{
					heading: '3. Legal basis',
					paragraphs: [
						'Personal data processing is based on the data subject’s consent and on compliance with the cooperative’s legal and statutory obligations, in accordance with Law 1581 of 2012 and its regulatory decrees.',
					],
				},
				{
					heading: '4. Sharing information',
					paragraphs: [
						'COTRASOFT does not sell or market personal data. Data may be shared only with competent authorities or authorized third parties when required by law or necessary to fulfill the corporate purpose, ensuring confidentiality at all times.',
					],
				},
				{
					heading: '5. Data retention',
					paragraphs: [
						'Personal data will be retained for as long as necessary to fulfill the described purposes and, in any case, for the periods established by applicable regulations.',
					],
				},
				{
					heading: '6. Data subject rights (Habeas Data)',
					paragraphs: [
						'As the data subject, you have the right to know, update and rectify your data, to request proof of the granted authorization, to be informed about how it has been used, to revoke the authorization and to request its deletion when applicable, in accordance with Law 1581 of 2012.',
					],
				},
				{
					heading: '7. Information security',
					paragraphs: [
						'COTRASOFT adopts reasonable technical and organizational security measures to protect personal data against unauthorized access, loss, alteration or disclosure.',
					],
				},
				{
					heading: '8. Requests, complaints and claims',
					paragraphs: [
						'To exercise your rights or submit inquiries, complaints or claims related to the processing of your personal data, you may contact us at the email address indicated in the data controller section.',
					],
				},
			],
		},
	},
};
