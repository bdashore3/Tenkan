import { MangaObject } from '@/@types/mangaObject'
import { CubariRemoteStorage } from '@/@types/remotestoragejs'

// From https://github.com/appu1232/guyamoe/blob/develop/templates/history.html
// This is to adhere to the cubari module spec
const Cubari = {
  name: 'cubari',
  builder: (p: any) => {
    p.declareType('series', {
      type: 'object',
      properties: {
        slug: {
          type: 'string'
        },
        coverUrl: {
          type: 'string'
        },
        source: {
          type: 'string'
        },
        url: {
          type: 'string'
        },
        title: {
          type: 'string'
        },
        timestamp: {
          type: 'number'
        },
        chapters: {
          type: 'array',
          default: [] // There are no chapters provided in each JSON entry
        },
        pinned: {
          type: 'boolean',
          default: false // Entries will be unpinned by default
        }
      },
      required: ['slug', 'source', 'url', 'title', 'timestamp', 'chapters', 'pinned']
    })

    return {
      exports: {
        addSeries: (manga: MangaObject) => {
          return p.storeObject('series', `/series/${manga.source}-${manga.slug}`, manga)
        }
      }
    }
  }
}

export const remoteStorage = new CubariRemoteStorage()

remoteStorage.access.claim('cubari', 'rw')
remoteStorage.addModule(Cubari)
