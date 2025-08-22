import { createBrowserRouter } from 'react-router-dom'
import { AuthRoute } from './middlewares/authprotect'
import { LogoutAuth } from './middlewares/authLogin'
import NotFound from './notFound'
import ErrorPage from './errorPage'
import Home from '../pages/home/home'
import Layout from '../pages/main/main'
import Machine from '../pages/machine/machine'
import Inventory from '../pages/inventories/inventories'
import Stock from '../pages/stock/stock'
import User from '../pages/user/user'

const router = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <AuthRoute />,
      children: [
        {
          path: '/',
          element: <Layout />,
          errorElement: <ErrorPage />,
          children: [
            {
              path: '/',
              element: <Home />,
              errorElement: <ErrorPage />
            },
            {
              path: '/refill',
              element: <Stock />,
              errorElement: <ErrorPage />
            },
            {
              path: '/drugs',
              element: <div>Drug</div>,
              errorElement: <ErrorPage />
            },
            {
              path: '/inventory',
              element: <Inventory />,
              errorElement: <ErrorPage />
            },
            {
              path: '/machine',
              element: <Machine />,
              errorElement: <ErrorPage />
            },
            {
              path: '/user',
              element: <User />,
              errorElement: <ErrorPage />
            },
            {
              path: '/settings',
              element: <div>Settings</div>,
              errorElement: <ErrorPage />
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      element: <LogoutAuth />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

export { router }
