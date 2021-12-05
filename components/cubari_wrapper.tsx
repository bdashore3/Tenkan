import React, { ChangeEvent, useEffect, useState } from 'react'
import Widget from 'remotestorage-widget'
import { remoteStorage, RS_PATH } from '@/lib/remoteStorage'

const testJson = [
  {
    title: 'Solo Leveling',
    url: '/read/mangadex/32d76d19-8a05-4db0-9fc2-e0b0648fe9d0',
    slug: '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0',
    coverUrl:
      'https://uploads.mangadex.org/covers/32d76d19-8a05-4db0-9fc2-e0b0648fe9d0/f5873770-80a4-470e-a11c-63b709d87eb3.jpg',
    chapters: [],
    timestamp: 1638611431120,
    pinned: false,
    source: 'mangadex'
  },
  {
    title: 'Gokushufudou: The Way of the House Husband',
    url: '/read/mangadex/89daf9dc-075a-4aa5-873a-cc76bb287108',
    slug: '89daf9dc-075a-4aa5-873a-cc76bb287108',
    coverUrl:
      'https://uploads.mangadex.org/covers/89daf9dc-075a-4aa5-873a-cc76bb287108/932c8815-c321-4bb9-9818-8cca56c1eb44.jpg',
    chapters: [],
    timestamp: 1638611431120,
    pinned: false,
    source: 'mangadex'
  },
  {
    title: 'Beware the Villainess!',
    url: '/read/mangadex/85b51b37-0ce6-4144-a19b-6b064bc2c2ae',
    slug: '85b51b37-0ce6-4144-a19b-6b064bc2c2ae',
    coverUrl:
      'https://uploads.mangadex.org/covers/85b51b37-0ce6-4144-a19b-6b064bc2c2ae/2379e0f5-ee9b-45c4-b1b2-43283360d5ca.png',
    chapters: [],
    timestamp: 1638611431120,
    pinned: false,
    source: 'mangadex'
  },
  {
    title: 'Descent of the Demon Master',
    url: '/read/mangasee/Descent-of-the-Demonic-Master',
    slug: 'Descent-of-the-Demonic-Master',
    coverUrl: 'https://cover.nep.li/cover/Descent-of-the-Demonic-Master.jpg',
    chapters: [],
    timestamp: 1638611431120,
    pinned: false,
    source: 'mangasee'
  },
  {
    title: 'Call of the Night',
    url: '/read/mangasee/Yofukashi-no-Uta',
    slug: 'Yofukashi-no-Uta',
    coverUrl: 'https://cover.nep.li/cover/Yofukashi-no-Uta.jpg',
    chapters: [],
    timestamp: 1638611431120,
    pinned: false,
    source: 'mangasee'
  },
  {
    title: 'See No Evil',
    url: '/read/mangasee/See-No-Evil',
    slug: 'See-No-Evil',
    coverUrl: 'https://cover.nep.li/cover/See-No-Evil.jpg',
    chapters: [],
    timestamp: 1638611431120,
    pinned: false,
    source: 'mangasee'
  },
  {
    title: 'Kaguya-sama - Love Is War',
    url: '/read/mangasee/Kaguya-Wants-To-Be-Confessed-To',
    slug: 'Kaguya-Wants-To-Be-Confessed-To',
    coverUrl: 'https://cover.nep.li/cover/Kaguya-Wants-To-Be-Confessed-To.jpg',
    chapters: [],
    timestamp: 1638611431120,
    pinned: false,
    source: 'mangasee'
  },
  {
    title: 'Tensei Shitara Slime Datta Ken',
    url: '/read/mangadex/e78a489b-6632-4d61-b00b-5206f5b8b22b',
    slug: 'e78a489b-6632-4d61-b00b-5206f5b8b22b',
    coverUrl:
      'https://uploads.mangadex.org/covers/e78a489b-6632-4d61-b00b-5206f5b8b22b/7c9e3cca-f83c-48a7-8a08-9e2bd61c0391.jpg',
    chapters: [],
    timestamp: 1638611431120,
    pinned: false,
    source: 'mangaDex'
  }
]

export default function CubariWrapper() {
  //const [file, setFile] = useState()

  useEffect(() => {
    new Widget(remoteStorage).attach('rs-widget')
  }, [])

  async function addFile() {
    for (const manga of testJson) {
      // @ts-ignore
      await remoteStorage.cubari.addSeries(
        manga.slug,
        manga.coverUrl,
        manga.source,
        manga.url,
        manga.title,
        undefined,
        undefined
      )
    }
  }

  function seeStorage() {
    // @ts-ignore
    console.log(remoteStorage.cubari)
  }

  function fileChanged(event: ChangeEvent<HTMLInputElement>) {
    console.log('Files were changed')

    if (event.target.files == null) {
      console.log('Files were null')

      return
    }

    let fr = new FileReader()

    fr.onload = (e) => {
      if (e.target == null) {
        return
      }

      console.log(JSON.parse(e.target.result as string))
    }

    prompt('Hello')

    console.log(fr.readAsText(event.target.files[0]))
  }

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center tracking-wide border-solid border-2 border-green-500">
      <div id="rs-widget"></div>
      <button type="button" onClick={addFile}>
        Add a file
      </button>
      <button type="button" onClick={seeStorage}>
        See storage
      </button>
      <input type="file" accept="application/json" onChange={fileChanged} />
    </div>
  )
}
