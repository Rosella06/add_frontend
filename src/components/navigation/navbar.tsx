import { NavLink, Link } from 'react-router-dom'
import { BiArchive } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { cookieOptions, cookies } from '../../constants/utils/utilsConstants'
import { useTranslation } from 'react-i18next'
import ConfirmModal, { ConfirmModalRef } from '../modal/ConfirmModal'
import { useRef } from 'react'
import Logo from '../../assets/images/add-512.png'
import { FaFileContract, FaPrescriptionBottleAlt } from 'react-icons/fa'
import { GiMedicinePills, GiVendingMachine } from 'react-icons/gi'
import { IoIosPersonAdd, IoMdLogOut } from 'react-icons/io'
import { HiOutlineClipboardList } from 'react-icons/hi'
import { IoSettingsOutline } from 'react-icons/io5'
import { Role } from '../../types/user.type'

const Navbar = () => {
  const { t } = useTranslation()
  const { cookieDecode } = useSelector((state: RootState) => state.utils)
  const confirmModalRef = useRef<ConfirmModalRef>(null)

  const menuItems = [
    { name: t('itemDispense'), path: '/', icon: FaFileContract },
    { name: t('itemRefill'), path: '/refill', icon: FaPrescriptionBottleAlt },
    { name: t('itemDrugs'), path: '/drugs', icon: GiMedicinePills },
    { name: t('itemInventory'), path: '/inventory', icon: BiArchive },
    { name: t('itemMachine'), path: '/machine', icon: GiVendingMachine },
    { name: t('itemUser'), path: '/user', icon: IoIosPersonAdd },
    { name: t('itemReport'), path: '/report', icon: HiOutlineClipboardList },
    { name: t('itemSettings'), path: '/settings', icon: IoSettingsOutline }
  ]

  const getRoleName = (role: Role | undefined) => {
    switch (role) {
      case 'ADMIN':
        return t('roleADMIN')
      case 'USER':
        return t('roleUSER')
      case 'HEAD_PHARMACIST':
        return t('roleHEAD_PHARMACIST')
      case 'PHARMACIST':
        return t('rolePHARMACIST')
      case 'ASSISTANT':
        return t('roleASSISTANT')
      default:
        return t('roleSUPER')
    }
  }

  return (
    <nav className='bg-base-100/30 backdrop-blur-xl shadow-sm border-b border-base-200 sticky top-0 left-0 z-50'>
      <div className='flex flex-col gap-7 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-32 items-center justify-between'>
          <div className='flex-shrink-0'>
            <Link to='/' className='text-4xl font-bold text-base-content'>
              <div className='avatar'>
                <div className='w-24 rounded-3xl'>
                  <img src={Logo} />
                </div>
              </div>
            </Link>
          </div>

          <div className='dropdown dropdown-end'>
            <label
              tabIndex={0}
              className='btn btn-ghost h-auto focus:bg-transparent p-0 rounded-3xl avatar'
            >
              <div className='w-18 rounded-3xl ring-2 ring-offset-2 ring-primary'>
                <img
                  src={import.meta.env.VITE_APP_IMG + cookieDecode?.userImage}
                  alt='User Avatar'
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className='menu menu-sm dropdown-content !rounded-[24px] mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52'
            >
              <li className='h-12'>
                <div className='flex gap-1.5 items-center justify-between h-12 rounded-[16px]'>
                  <span className='text-base font-medium max-w-[72px] truncate'>
                    {cookieDecode?.displayName}
                  </span>
                  <span className='badge badge-ghost text-xs'>
                    {getRoleName(cookieDecode?.userRole)}
                  </span>
                </div>
              </li>
              <div className='divider my-1 before:h-[1px] after:h-[1px]'></div>
              <li className='h-12'>
                <span
                  className='flex items-center text-base font-medium text-red-500 h-12 hover:bg-red-500/30 rounded-[16px]'
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
                  <IoMdLogOut size={24} />
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
                <div className='tooltip tooltip-bottom' data-tip={item.name}>
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex flex-col items-center justify-center gap-3 p-3 rounded-lg w-30 transition-colors ease-linear duration-200
                      ${
                        isActive
                          ? 'text-primary'
                          : 'text-slate-500 hover:text-slate-700'
                      }`
                      }
                    >
                      <item.icon size={64} />

                      <span className='text-xl font-medium truncate block max-w-[128px]'>
                        {item.name}
                      </span>
                    </NavLink>
                  </li>
                </div>
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
