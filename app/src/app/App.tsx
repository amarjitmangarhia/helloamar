import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { TopNav } from '../components/TopNav'
import { ScrollToHash } from '../components/ScrollToHash'
import Home from '../pages/Home'

// Each project route is lazy-loaded so the home page never downloads other scenes.
const Projects = lazy(() => import('../pages/Projects'))
const ProjectPage = lazy(() => import('../pages/ProjectPage'))
const Contact = lazy(() => import('../pages/ContactPage'))

export function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <TopNav />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
