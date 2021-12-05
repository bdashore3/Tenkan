import Head from 'next/head'
import dynamic from 'next/dynamic'

const RSComponent = dynamic(() => import('../components/cubari_wrapper'), { ssr: false })

export default function Home() {
  return <RSComponent />
}
