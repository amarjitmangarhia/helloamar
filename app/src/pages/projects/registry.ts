import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

// slug -> real project page. A slug that is not listed here shows the "being built" placeholder.
// Add one line per project as it is finished.
export const projectPages: Record<string, LazyExoticComponent<ComponentType>> = {
  'particle-type': lazy(() => import('./ParticleTypePage')),
  'weather-globe': lazy(() => import('./WeatherGlobePage')),
  pyramid: lazy(() => import('./PyramidPage')),
  'the-deep': lazy(() => import('./DeepPage')),
}
