import {memo} from 'react'

export const Home = memo(function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-500 text-5xl">Discord Bouncer</p>
    </div>
  )
})
