import { Profiler, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StyleSheetManager } from 'styled-components'
import isPropValid from '@emotion/is-prop-valid'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { I18nextProvider } from 'react-i18next'
import store from './redux/store'
import i18n from './lang/i18n'
import Routes from './routes/routes'
import './index.css'

class AppRenderer {
  private static instance: AppRenderer

  private constructor () {
    this.disableConsoleInProduction()
    this.renderApp()
    this.fullScreen()
  }

  public static getInstance (): AppRenderer {
    if (!AppRenderer.instance) {
      AppRenderer.instance = new AppRenderer()
    }
    return AppRenderer.instance
  }

  private fullScreen (): void {
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error enabling fullscreen: ${err.message}`)
        })
      } else {
        document.exitFullscreen()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'f') {
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
  }

  private disableConsoleInProduction (): void {
    if (import.meta.env.VITE_APP_NODE_ENV === 'production') {
      console.log = () => {}
      console.info = () => {}
      console.table = () => {}
      console.debug = () => {}
      console.trace = () => {}
    }
  }

  private async renderApp (): Promise<void> {
    const rootElement = document.getElementById('appWrapper')
    if (!rootElement) {
      console.error('❌ Failed to find root element: #appWrapper')
      return
    }

    const root = createRoot(rootElement)

    try {
      root.render(
        <StrictMode>
          <Profiler
            id='app'
            onRender={() =>
              // id,
              // phase,
              // actualDuration,
              // baseDuration,
              // startTime,
              // commitTime
              {
                if (import.meta.env.VITE_APP_NODE_ENV === 'development') {
                  // console.table([
                  //   {
                  //     Component: id,
                  //     Phase: phase,
                  //     'Actual Duration (ms)': actualDuration.toFixed(2),
                  //     'Base Duration (ms)': baseDuration.toFixed(2),
                  //     'Start Time (ms)': startTime.toFixed(2),
                  //     'Commit Time (ms)': commitTime.toFixed(2)
                  //   }
                  // ])
                }
              }
            }
          >
            <StyleSheetManager shouldForwardProp={isPropValid}>
              <Provider store={store}>
                <I18nextProvider i18n={i18n}>
                  <Routes />
                  <Toaster position='top-center' reverseOrder={false} />
                </I18nextProvider>
              </Provider>
            </StyleSheetManager>
          </Profiler>
        </StrictMode>
      )
    } catch (error) {
      console.error('❌ Failed to load Routes:', error)
    }
  }
}

AppRenderer.getInstance()
