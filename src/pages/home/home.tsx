import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers/rootReducer'
import { useEffect } from 'react'

const Home = () => {
  const { socketId } = useSelector((state: RootState) => state.utils)

  useEffect(() => {
    if (socketId === undefined) return

    console.log('SocketID: ', socketId)
  }, [socketId])

  return (
    <div className='flex flex-col gap-3'>
      <span>Home</span>
    </div>
  )
}

export default Home
