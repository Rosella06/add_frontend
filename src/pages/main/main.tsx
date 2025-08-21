import { Outlet } from 'react-router-dom'
import Navbar from '../../components/navigation/navbar'

const Layout = () => {
  return (
    <div className='min-h-dvh flex flex-col bg-base-200'>
      <Navbar />
      <main className='flex-1 flex flex-col p-4 sm:p-6 lg:p-8'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
