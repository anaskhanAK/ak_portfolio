import { lazy, Suspense, useEffect } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig } from 'motion/react'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { Work } from './sections/Work'
import { Systems } from './sections/Systems'
import { Approach } from './sections/Approach'
import { Stack } from './sections/Stack'
import { Experience } from './sections/Experience'
import { ResumeSection } from './sections/ResumeSection'
import { Contact } from './sections/Contact'
import { useCaseStudyRoute } from './hooks/useHashRoute'
import { projectBySlug } from './data/projects'

const CaseStudy = lazy(() => import('./components/CaseStudy'))
const loadMotionFeatures = () => import('./lib/motionFeatures').then((r) => r.default)

export default function App() {
  const { slug, open, close } = useCaseStudyRoute()
  const project = slug ? projectBySlug[slug] : undefined

  useEffect(() => {
    document.title = project
      ? `${project.short} case study | Anas Khan`
      : 'Anas Khan | AI & Full Stack Engineer'
  }, [project])

  return (
    <LazyMotion features={loadMotionFeatures} strict>
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-on-ink"
      >
        Skip to content
      </a>
      <div inert={project ? true : undefined}>
      <Nav />
      <main id="main">
        <Hero onOpenProject={open} />
        <Work onOpenProject={open} />
        <Systems onOpenProject={open} />
        <Approach onOpenProject={open} />
        <Stack onOpenProject={open} />
        <Experience onOpenProject={open} />
        <ResumeSection />
        <Contact />
      </main>
      <Footer />
      </div>
      <Suspense fallback={null}>
        <AnimatePresence>
          {project && <CaseStudy key={project.slug} project={project} onClose={close} onNavigate={(s) => open(s, { replace: true })} />}
        </AnimatePresence>
      </Suspense>
    </MotionConfig>
    </LazyMotion>
  )
}
