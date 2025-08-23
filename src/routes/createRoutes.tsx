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
import Drugs from '../pages/drug/drug'
import Settings from '../pages/setting/setting'
import Profile from '../pages/setting/profile'
import Theme from '../pages/setting/theme'

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
              index: true,
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
              element: <Drugs />,
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
              path: '/report',
              element: <div>Report</div>,
              errorElement: <ErrorPage />
            },
            {
              path: '/settings',
              children: [
                {
                  index: true,
                  element: <Settings />,
                  errorElement: <ErrorPage />
                },
                {
                  path: '/settings/profile',
                  element: <Profile />,
                  errorElement: <ErrorPage />
                },
                {
                  path: '/settings/language',
                  element: <div>Language</div>,
                  errorElement: <ErrorPage />
                },
                {
                  path: '/settings/theme',
                  element: <Theme />,
                  errorElement: <ErrorPage />
                },
                {
                  path: '/settings/machine',
                  element: <div>Machine</div>,
                  errorElement: <ErrorPage />
                }
              ]
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
