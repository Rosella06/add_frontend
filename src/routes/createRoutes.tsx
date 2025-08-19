import { createBrowserRouter } from 'react-router-dom'
import { AuthRoute } from './middlewares/authprotect'
import { LogoutAuth } from './middlewares/authLogin'
import NotFound from './notFound'
import ErrorPage from './errorPage'
import Home from '../pages/home/home'
import Layout from '../pages/main/main'

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
