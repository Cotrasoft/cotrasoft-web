import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { supportedLanguages } from '../i18n'

const BASE_URL = 'https://cotrasoft.co'

function setMeta(attr: string, attrValue: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${attrValue}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, attrValue)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  el.setAttribute('data-seo', 'true')
}

function injectJsonLd(id: string, data: object) {
  let script = document.querySelector(`script[data-seo-ld="${id}"]`) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-ld', id)
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

const SEOHead = () => {
  const { t } = useTranslation()
  const { lang } = useParams()
  const currentLang = lang || 'es'
  const ogLocale = currentLang === 'en' ? 'en_US' : 'es_CO'
  const altLocale = currentLang === 'en' ? 'es_CO' : 'en_US'

  useEffect(() => {
    const pageUrl = `${BASE_URL}/${currentLang}/`

    // Basic meta
    document.title = t('meta.title')
    document.documentElement.lang = currentLang

    setMeta('name', 'description', t('meta.description'))
    setMeta('name', 'keywords', t('meta.keywords'))
    setMeta('name', 'author', 'Cotrasoft')
    setMeta('name', 'robots', 'index, follow')

    // Open Graph
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', pageUrl)
    setMeta('property', 'og:title', t('meta.ogTitle'))
    setMeta('property', 'og:description', t('meta.ogDescription'))
    setMeta('property', 'og:image', `${BASE_URL}/cotrasoft_logo.svg`)
    setMeta('property', 'og:image:alt', t('meta.ogImageAlt'))
    setMeta('property', 'og:site_name', 'Cotrasoft')
    setMeta('property', 'og:locale', ogLocale)
    setMeta('property', 'og:locale:alternate', altLocale)

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', t('meta.ogTitle'))
    setMeta('name', 'twitter:description', t('meta.ogDescription'))
    setMeta('name', 'twitter:image', `${BASE_URL}/cotrasoft_logo.svg`)
    setMeta('name', 'twitter:image:alt', t('meta.ogImageAlt'))

    // Managed links (canonical + hreflang)
    document.querySelectorAll('link[data-i18n]').forEach((link) => link.remove())

    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = pageUrl
    canonical.setAttribute('data-i18n', 'true')
    document.head.appendChild(canonical)

    supportedLanguages.forEach((lng) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = lng
      link.href = `${BASE_URL}/${lng}/`
      link.setAttribute('data-i18n', 'true')
      document.head.appendChild(link)
    })

    const xDefault = document.createElement('link')
    xDefault.rel = 'alternate'
    xDefault.hreflang = 'x-default'
    xDefault.href = `${BASE_URL}/es/`
    xDefault.setAttribute('data-i18n', 'true')
    document.head.appendChild(xDefault)

    // --- JSON-LD Structured Data ---

    // Organization
    const organization = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Cotrasoft',
      url: BASE_URL,
      logo: `${BASE_URL}/cotrasoft_logo.svg`,
      email: 'gerencia@cotrasoft.co',
      description: t('meta.description'),
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CO',
      },
      knowsLanguage: ['es', 'en'],
      areaServed: [
        { '@type': 'Country', name: 'Colombia' },
        { '@type': 'Country', name: 'United States' },
      ],
    }
    injectJsonLd('organization', organization)

    // WebSite
    const website = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Cotrasoft',
      url: BASE_URL,
      inLanguage: currentLang,
      publisher: { '@id': `${BASE_URL}/#organization` },
    }
    injectJsonLd('website', website)

    // Services
    const serviceData = [
      { key: 'rescue', name: t('services.rescue.title'), description: t('services.rescue.description') },
      { key: 'accelerated', name: t('services.accelerated.title'), description: t('services.accelerated.description') },
      { key: 'consulting', name: t('services.consulting.title'), description: t('services.consulting.description') },
    ]

    const services = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: serviceData.map((svc, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: svc.name,
          description: svc.description,
          provider: { '@id': `${BASE_URL}/#organization` },
        },
      })),
    }
    injectJsonLd('services', services)

    // FAQPage
    const faqItems = t('meta.faq', { returnObjects: true }) as Array<{ question: string; answer: string }>
    if (Array.isArray(faqItems) && faqItems.length > 0) {
      const faqPage = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
      injectJsonLd('faq', faqPage)
    }

    return () => {
      document.querySelectorAll('link[data-i18n]').forEach((link) => link.remove())
      document.querySelectorAll('[data-seo-ld]').forEach((el) => el.remove())
    }
  }, [t, lang, currentLang, ogLocale, altLocale])

  return null
}

export default SEOHead
