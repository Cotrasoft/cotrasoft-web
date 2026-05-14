import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

const Footer = () => {
  const { t } = useTranslation()
  const { lang } = useParams()

  const navLinks = [
    { label: t('footer.links.services'), href: `/${lang}/#servicios` },
    { label: t('footer.links.benefits'), href: `/${lang}/#beneficios` },
    { label: t('footer.links.join'), href: 'https://app.cotrasoft.co/registro' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <a href={`/${lang}/`} className="flex items-center space-x-2 mb-4">
              <img src="/assets/cotrasoft_logo.svg" alt="Cotrasoft" className="h-8 w-8" />
              <span className="text-xl font-bold text-white">cotrasoft</span>
            </a>
            <p className="text-sm text-gray-400">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label={t('footer.navLabel')}>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">{t('footer.contact.heading')}</h3>
            <address className="not-italic text-sm text-gray-400 space-y-1">
              <p>
                <a href={`mailto:${t('footer.contact.email')}`} className="hover:text-white transition-colors duration-200">
                  {t('footer.contact.email')}
                </a>
              </p>
              <p>{t('footer.contact.location')}</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Cotrasoft. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}

export default Footer
