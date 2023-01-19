import {Footer} from 'common/Footer'
import {Header} from 'common/Header'
import {InfoLine} from 'common/InfoLine'
import {Layout} from 'common/Layout'
import {signIn} from 'next-auth/react'
import {memo, useCallback} from 'react'
import {About} from './About'
import {Benefits} from './Benefits'
import {Intro} from './Intro'
import {Join} from './Join'
import {NoCaptcha} from './NoCaptcha'

export const Home = memo(function Home() {
  const handleInstall = useCallback(async () => {
    await signIn('discord', {callbackUrl: '/admin'})
  }, [])

  return (
    <Layout>
      <div className="grid grid-rows-auto/fr/auto min-h-screen">
        <Header />
        <Intro onInstall={handleInstall} />

        <InfoLine
          className="mt-16 md:mt-0"
          text="Welcome to the Discord Bouncer, if you want to use this in your server to verify humanness, follow these instructions to get started."
        />
      </div>
      <About />
      {/* FIXME: Update text on orb card */}
      {/* <Methods /> */}
      <NoCaptcha onInstall={handleInstall} />
      <Benefits />
      <Join onInstall={handleInstall} />
      <InfoLine className="mt-32 md:mt-64" text="This project is open sourced and anyone can contribute to it." />
      <Footer />
    </Layout>
  )
})
