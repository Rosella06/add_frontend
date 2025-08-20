import { useEffect, useMemo } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './createRoutes'
import { useDispatch } from 'react-redux'
import { socket } from '../services/webSocket'
import { setSocketData, setSocketId } from '../redux/actions/utilsActions'
import toast, { useToasterStore } from 'react-hot-toast'

const Routes = () => {
  const dispatch = useDispatch()
  const { toasts } = useToasterStore()

  const routerInstance = useMemo(() => router(), [])
  const routesProvider = useMemo(
    () => <RouterProvider router={routerInstance} />,
    [routerInstance]
  )
  const toastLimit = 1

  socket.on('connect', () => {
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

  return <>{routesProvider}</>
}

export default Routes
