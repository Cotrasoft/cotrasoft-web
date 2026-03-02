import { useEffect } from 'react'
import { Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supportedLanguages, type SupportedLanguage } from './i18n'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
// import Features from './components/Features'
// import Stats from './components/Stats'
// import Projects from './components/Projects'
import Services from './components/Services'
import Benefits from './components/Benefits'
// import CTA from './components/CTA'
import Footer from './components/Footer'
import SEOHead from './components/SEOHead'

function LanguageRedirect() {
  const { i18n } = useTranslation()
  const location = useLocation()

  const detected = i18n.language?.substring(0, 2) as SupportedLanguage
  const lang = supportedLanguages.includes(detected) ? detected : 'es'

  return <Navigate to={`/${lang}/${location.hash}`} replace />
}

function LocalizedApp() {
  const { lang } = useParams()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  useEffect(() => {
    if (!lang || !supportedLanguages.includes(lang as SupportedLanguage)) {
      navigate('/es/', { replace: true })
      return
    }
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
    document.documentElement.lang = lang
  }, [lang, i18n, navigate])

  if (!lang || !supportedLanguages.includes(lang as SupportedLanguage)) {
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SEOHead />
      <Navbar />
      <main>
        <Hero />
        {/* <Features /> */}
        {/* <Stats /> */}
        <Services />
        <Benefits />
        {/* <Projects /> */}
        {/* <CTA /> */}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/:lang/*" element={<LocalizedApp />} />
      <Route path="/" element={<LanguageRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
