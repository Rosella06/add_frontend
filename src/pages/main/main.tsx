import { Outlet } from 'react-router-dom'
import Navbar from '../../components/navigation/navbar'

const Layout = () => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className='p-4 sm:p-6 lg:p-8'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
