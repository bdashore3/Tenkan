import dynamic from 'next/dynamic'
import SocialButton from '@/components/socialButton'
import SocialImages from '@/public/socialImages'
import AidokuWrapper from '@/components/aidokuWrapper'

const RSComponent = dynamic(() => import('../components/cubariWrapper'), { ssr: false })

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center">
      <p className="py-10 md:py-0 font-header text-center text-4xl lg:text-6xl lg:leading-relaxed font-bold tracking-wide mb-10">
        Aidoku Converter
      </p>
      <div className="bg-lightbg md:max-w-3xl xl:max-w-4xl rounded-xl px-6 lg:px-10 py-6">
        <p className="text-red-500 text-left my-3">
          If your backup is not formatted properly, check devtools to see the converter's raw
          output.
        </p>
        <div className="">
          <AidokuWrapper />
        </div>
      </div>
      <div className="inline-flex flex-col justify-center items-center mt-10">
        <ul className="flex items-center">
          <SocialButton
            name="github"
            url="https://github.com/bdashore3/cubari-importer"
            color="hover:text-orange-400"
            svgPath={SocialImages.Github}
          />
          <SocialButton
            name="discord"
            url="https://discord.gg/pswt7by"
            color="hover:text-blurple"
            svgPath={SocialImages.Discord}
          />
        </ul>
        <footer className="py-6 text-center max-w-screen">
          © 2022 Brian Dashore, pandeynmn, skittyblock
        </footer>
      </div>
    </div>
  )
}
