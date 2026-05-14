import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { supportedLanguages, type SupportedLanguage } from '../i18n'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useParams()

  const switchLanguage = (newLang: SupportedLanguage) => {
    if (newLang === lang) return
    i18n.changeLanguage(newLang)
    navigate(`/${newLang}/${location.hash}`, { replace: true })
  }

  return (
    <div className="flex items-center space-x-1 text-sm">
      {supportedLanguages.map((lng, index) => (
        <span key={lng} className="flex items-center">
          {index > 0 && (
            <span className="text-gray-400 dark:text-gray-500 mx-1">|</span>
          )}
          <button
            onClick={() => switchLanguage(lng)}
            className={`uppercase transition-colors duration-200 ${
              lang === lng
                ? 'text-primary font-semibold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {lng}
          </button>
        </span>
      ))}
    </div>
  )
}

export default LanguageSwitcher
