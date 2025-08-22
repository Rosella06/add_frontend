import { NavLink, Link } from 'react-router-dom'
import { BiSolidDownArrow } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { useTranslation } from 'react-i18next'
import ConfirmModal, { ConfirmModalRef } from '../modal/ConfirmModal'
import { useRef } from 'react'
import Logo from '../../assets/images/add-512.png'

const Navbar = () => {
  const { t } = useTranslation()
  const { cookieDecode } = useSelector((state: RootState) => state.utils)
  const confirmModalRef = useRef<ConfirmModalRef>(null)

  const menuItems = [
    { name: t('itemDispense'), path: '/', icon: BiSolidDownArrow },
    { name: t('itemRefill'), path: '/refill', icon: BiSolidDownArrow },
    { name: t('itemDrugs'), path: '/drugs', icon: BiSolidDownArrow },
    { name: t('itemInventory'), path: '/inventory', icon: BiSolidDownArrow },
    { name: t('itemMachine'), path: '/machine', icon: BiSolidDownArrow },
    { name: t('itemUser'), path: '/user', icon: BiSolidDownArrow },
    { name: t('itemSettings'), path: '/settings', icon: BiSolidDownArrow }
  ]

  return (
    <nav className='bg-base-100 shadow-sm border-b border-base-200 sticky top-0 left-0 z-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex-shrink-0'>
            <Link to='/' className='text-4xl font-bold text-base-content'>
              <div className='avatar'>
                <div className='w-15 rounded'>
                  <img src={Logo} />
                </div>
              </div>
            </Link>
          </div>

          <div className='dropdown dropdown-end'>
            <label
              tabIndex={0}
              className='btn btn-ghost h-auto focus:bg-transparent p-0 rounded-full avatar'
            >
              <div className='w-12 rounded-full ring-2 ring-offset-2 ring-primary'>
                <img
                  src={import.meta.env.VITE_APP_IMG + cookieDecode?.userImage}
                  alt='User Avatar'
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content !rounded-[24px] mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <div className='flex gap-1.5 items-start justify-between rounded-[16px]'>
                  <span className='text-base font-medium max-w-[72px] truncate'>
                    {cookieDecode?.displayName}
                  </span>
                  <span className='badge badge-ghost text-xs'>
                    {cookieDecode?.userRole}
                  </span>
                </div>
              </li>
              <li className='mt-2'>
                <span
                  className='text-base font-medium text-red-500 hover:bg-red-50 rounded-[16px]'
                  onClick={async () => {
                    const confirmed = await confirmModalRef.current?.show({
                      title: t('logOutTitle'),
                      description: t('logOutDescription'),
                      buttonConfirmText: t('logoutButton'),
                      type: 'warning'
                    })

                    if (confirmed) {
                      cookies.remove('tokenObject', cookieOptions)
                      cookies.update()
                      window.location.href = '/login'
                    }
                  }}
                >
                  <BiSolidDownArrow className='h-4 w-4' />
                  {t('logoutButton')}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className='flex justify-center'>
          <div className='hidden md:block'>
            <ul className='flex items-center space-x-2'>
              {menuItems.map(item => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex flex-col items-center justify-center gap-2 p-3 rounded-lg w-30 h-30 transition-colors ease-linear duration-200
                      ${
                        isActive
                          ? 'text-primary'
                          : 'text-slate-500 hover:text-slate-700'
                      }`
                    }
                  >
                    <item.icon size={32} />
                    <span className='text-base font-medium'>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ConfirmModal ref={confirmModalRef} />
    </nav>
  )
}

export default Navbar
