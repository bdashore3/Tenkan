import RemoteStorage from 'remotestoragejs'

export const RS_PATH = 'cubari'

// From https://github.com/appu1232/guyamoe/blob/develop/templates/history.html
// This is to adhere to the cubari module spec
export const remoteStorage = (() => {
  const Model = {
    name: RS_PATH,
    builder: (p: any) => {
      const SERIES_META = 'series'
      const REPLACEMENT_STR = '{SOURCE_SLUG_REPLACEMENT}'
      const SERIES_META_PATH_BASE = 'series/'
      const SERIES_META_PATH = `${SERIES_META_PATH_BASE}${REPLACEMENT_STR}`

      p.declareType(SERIES_META, {
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
            default: [] // Note that these aren't validated by our schema handler
          },
          pinned: {
            type: 'boolean',
            default: false // Thus it's documenting only; handle it
          }
        },
        required: ['slug', 'source', 'url', 'title', 'timestamp', 'chapters', 'pinned']
      })

      let firstPartyValidator = (source: string) => {
        return source === 'manga' || source === 'series' || source === 'default'
      }

      let pathBuilder = (path: string, slug: string, source: string) => {
        if (!source) source = 'default'
        if (firstPartyValidator(source)) source = 'default'
        source = source.replace(' ', '_')
        return path.replace(REPLACEMENT_STR, `${source}-${slug}`)
      }

      let seriesBuilder = (
        slug: string,
        coverUrl: string,
        source: string,
        url: string,
        title: string,
        pinned: boolean,
        chapters: any
      ) => {
        source = source.replace(' ', '_')
        if (firstPartyValidator(source)) {
          source = 'default'
          pinned = true // First party chapters always pinned
        }
        return {
          slug: slug,
          coverUrl: coverUrl || '',
          source: source,
          url: url,
          title: title,
          timestamp: Date.now(),
          chapters: chapters || [],
          pinned: pinned === undefined ? false : pinned
        }
      }

      return {
        exports: {
          addSeries: (
            slug: string,
            coverUrl: string,
            source: string,
            url: string,
            title: string,
            pinned: boolean,
            chapters: any
          ) => {
            let toStore = seriesBuilder(slug, coverUrl, source, url, title, pinned, chapters)
            return p.storeObject(SERIES_META, pathBuilder(SERIES_META_PATH, slug, source), toStore)
          }
        }
      }
    }
  }

  let remoteStorage = new RemoteStorage({ cache: true, modules: [Model] })

  remoteStorage.access.claim(RS_PATH, 'rw')
  remoteStorage.caching.enable(`/${RS_PATH}/`)

  return remoteStorage
})()
