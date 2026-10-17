/**
 * Server entry for build-time pre-rendering (`npm run build`): renders the app for one path, so
 * every page arrives as finished HTML and the first paint never waits for JavaScript.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App'
import { setServerPath } from './lib/router/router'

export function render(pathname: string): string {
  setServerPath(pathname)
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
