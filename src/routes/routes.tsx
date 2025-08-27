import { useEffect, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './createRoutes'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../services/webSocket'
import { setSocketData, setSocketId } from '../redux/actions/utilsActions'
import toast, { useToasterStore } from 'react-hot-toast'
import { RootState } from '../redux/reducers/rootReducer'
import { useTranslation } from 'react-i18next'

const Routes = () => {
  const dispatch = useDispatch()
  const { currentLang, themeMode } = useSelector(
    (state: RootState) => state.utils
  )
  const { toasts } = useToasterStore()
  const { i18n } = useTranslation()

  const routerInstance = useMemo(() => router(), [])
  const routesProvider = useMemo(
    () => <RouterProvider router={routerInstance} />,
    [routerInstance]
  )
  const toastLimit = 1

  socket.on('connect', () => {
    console.log('Socket Connected, ID:', socket.id)
    dispatch(setSocketId(socket.id))
  })

  socket.on('drug_dispensed', response => {
    dispatch(setSocketData(response))
  })

  useEffect(() => {
    toasts
      .filter(toasts => toasts.visible)
      .filter((_, index) => index >= toastLimit)
      .forEach(toasts => toast.dismiss(toasts.id))
  }, [toasts])

  useEffect(() => {
    i18n.changeLanguage(currentLang)
  }, [currentLang, i18n])

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.setAttribute('data-theme', themeMode)
  }, [themeMode])

  useEffect(() => {
    const handleOnline = () => {
      console.info('[Network] back online')
      window.location.href = '/'
    }
    const handleOffline = () => {
      console.info('[Network] offline detected')
      window.location.href = '/offline.html'
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return <>{routesProvider}</>
}

export default Routes
