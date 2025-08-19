import { NavLink, Link } from 'react-router-dom'
import { BiSolidDownArrow } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { t } = useTranslation()
  const { cookieDecode } = useSelector((state: RootState) => state.utils)

  const menuItems = [
    { name: 'Dispense', path: '/dispense', icon: BiSolidDownArrow },
    { name: 'Refill', path: '/refill', icon: BiSolidDownArrow },
    { name: 'Drugs', path: '/drugs', icon: BiSolidDownArrow },
    { name: 'Inventory', path: '/inventory', icon: BiSolidDownArrow },
    { name: 'Machine', path: '/machine', icon: BiSolidDownArrow },
    { name: 'User', path: '/user', icon: BiSolidDownArrow },
    { name: 'Settings', path: '/settings', icon: BiSolidDownArrow }
  ]

  return (
    <nav className='bg-white shadow-sm border-b border-slate-200'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          {/* ส่วนที่ 1: โลโก้ */}
          <div className='flex-shrink-0'>
            <Link to='/' className='text-2xl font-bold text-slate-800'>
              ADD
            </Link>
          </div>

          {/* ส่วนที่ 2: เมนูหลัก (แสดงบนจอขนาดกลางขึ้นไป) */}
          <div className='hidden md:block'>
            <ul className='flex items-center space-x-2'>
              {menuItems.map(item => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    // ใช้ฟังก์ชันใน className เพื่อเช็ค `isActive`
                    className={({ isActive }) =>
                      `flex flex-col items-center justify-center gap-1 p-3 rounded-lg w-20 h-20 transition-colors duration-200
                      ${
                        isActive
                          ? 'bg-blue-50 text-blue-600' // <-- สไตล์ของเมนูที่ถูกเลือก
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800' // <-- สไตล์ปกติ
                      }`
                    }
                  >
                    <item.icon className='h-6 w-6' />
                    <span className='text-xs font-medium'>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ส่วนที่ 3: โปรไฟล์ผู้ใช้ (Dropdown) */}
          <div className='dropdown dropdown-end'>
            <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
              <div className='w-12 rounded-full ring-2 ring-offset-2 ring-blue-500'>
                <img
                  src={import.meta.env.VITE_APP_IMG + cookieDecode?.userImage}
                  alt='User Avatar'
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li className='p-2'>
                <p className='font-bold'>{cookieDecode?.displayName}</p>
                <span className='badge badge-ghost'>
                  {cookieDecode?.userRole}
                </span>
              </li>
              <li className='mt-2'>
                <span
                  className='text-red-500 hover:bg-red-50'
                  onClick={() => {
                    cookies.remove('tokenObject', cookieOptions)
                    cookies.update()
                    window.location.href = '/login'
                  }}
                >
                  <BiSolidDownArrow className='h-4 w-4' />
                  {t('logoutButton')}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
