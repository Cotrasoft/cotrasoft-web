import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { supportedLanguages } from '../i18n'

const BASE_URL = 'https://cotrasoft.co'

const SEOHead = () => {
  const { t } = useTranslation()
  const { lang } = useParams()

  useEffect(() => {
    document.title = t('meta.title')
    document.documentElement.lang = lang || 'es'

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', t('meta.description'))
    }

    // Manage hreflang and canonical links
    const managedLinks = document.querySelectorAll('link[data-i18n]')
    managedLinks.forEach((link) => link.remove())

    // Canonical
    const canonical = document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = `${BASE_URL}/${lang}/`
    canonical.setAttribute('data-i18n', 'true')
    document.head.appendChild(canonical)

    // Hreflang for each language
    supportedLanguages.forEach((lng) => {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = lng
      link.href = `${BASE_URL}/${lng}/`
      link.setAttribute('data-i18n', 'true')
      document.head.appendChild(link)
    })

    // x-default hreflang
    const xDefault = document.createElement('link')
    xDefault.rel = 'alternate'
    xDefault.hreflang = 'x-default'
    xDefault.href = `${BASE_URL}/es/`
    xDefault.setAttribute('data-i18n', 'true')
    document.head.appendChild(xDefault)

    return () => {
      document.querySelectorAll('link[data-i18n]').forEach((link) => link.remove())
    }
  }, [t, lang])

  return null
}

export default SEOHead
