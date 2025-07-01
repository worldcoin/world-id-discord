import { routes } from '@/utils/routes'
import { redirect } from 'next/navigation'

const Home = () => {
  redirect(routes.admin())
}

export default Home
