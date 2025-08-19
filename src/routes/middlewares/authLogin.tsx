import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import Login from '../../pages/login/login'

export const LogoutAuth = () => {
  const { cookieEncode } = useSelector((state: RootState) => state.utils)

  if (cookieEncode !== undefined) {
    return <Navigate to='/' />
  }

  return <Login />
}
