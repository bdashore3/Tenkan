import dynamic from 'next/dynamic'
import SocialButton from '@/components/socialButton'
import SocialImages from '@/public/socialImages'

const RSComponent = dynamic(() => import('../components/cubariWrapper'), { ssr: false })

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen justify-center">
      <p className="font-header text-center text-4xl lg:text-6xl lg:leading-relaxed font-bold tracking-wide">
        Cubari Importer
      </p>
      <div className="mt-16">
        <RSComponent />
      </div>
      <div className="text-center text-red-500">
        NOTE: This importer does work, but the website won't give any output! Use at your own risk.
        <br />
        <br />
        Please use devtools to see the uploader's output. If you get a bunch of errors, try
        resynchronizing or wait a minute and try again.
        <br />
        <br />
        To see your files, use{' '}
        <a
          href="https://inspektor.5apps.com"
          target="_blank"
          className="underline text-red-500 visited:text-red-300">
          inspektor
        </a>
      </div>
      <div className="inline-flex flex-col justify-center items-center mt-10">
        <ul className="flex items-center">
          <SocialButton
            name="github"
            url="https://github.com/bdashore3/cubari-importer"
            color="hover:text-green-500"
            svgPath={SocialImages.Github}
          />
          <SocialButton
            name="discord"
            url="https://discord.gg/pswt7by"
            color="hover:text-blurple"
            svgPath={SocialImages.Discord}
          />
        </ul>
        <footer className="mt-6 text-center max-w-screen">© 2021 Brian Dashore, pandeynmn</footer>
      </div>
    </div>
  )
}
