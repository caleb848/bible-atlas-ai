import '@fontsource-variable/inter'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/newsreader/wght-italic.css'
import './styles/index.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'

// The first paint shows the delivered page without entrance animations (see index.css); from the
// reader's first interaction on, screens animate in as they open.
const enableEntrances = () => {
  document.documentElement.classList.remove('first-paint')
  for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const) window.removeEventListener(type, enableEntrances)
}
for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const) window.addEventListener(type, enableEntrances, { passive: true })

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path)
const prerendered = container.dataset.prerenderedPath

// Pages are pre-rendered at build time. Hydrate when this HTML was rendered for this address;
// otherwise (an unknown address served the home page, or the dev server) render from scratch.
if (prerendered !== undefined && normalize(prerendered) === normalize(window.location.pathname)) {
  hydrateRoot(container, app)
} else {
  container.replaceChildren()
  createRoot(container).render(app)
}
