import {
  AidokuBackup,
  Chapter as AidokuChapter,
  Library as AidokuLibrary,
  Manga as AidokuManga,
  History as AidokuHistory
} from '@/@types/aidoku'
import { PBBackup } from '@/@types/paperback'

interface AidokuResult {
  backup: AidokuBackup
  dateString: string
}

// From https://github.com/pandeynmn/paperback-aidoku-converter
export default function toAidoku(rawJson: string): AidokuResult {
  const dateString = new Date(Date.now()).toISOString().split('T')[0]
  const pbObj: PBBackup = JSON.parse(rawJson)
  const categories: Set<string> = new Set<string>()
  for (const item of pbObj.library) {
      for (const i of item.libraryTabs) {
          categories.add(i.name)
      }
  }
  const aidokuObject: AidokuBackup = {
    history: [],
    manga: [],
    chapters: [],
    library: [],
    sources: [],
    date: 0,
    name: `Paperback Backup v2 [MIGRATE]`,
    version: 'pb-aidoku-v2',
    categories: Array.from(categories)
  }

  const paperbackIdSet: Set<string> = new Set<string>()
  const paperbackIdTabDic: Record<string, string[]> = {}
  const mangaIdSet: Set<string> = new Set<string>()
  const aidokuSourcesSet: Set<string> = new Set<string>()

  aidokuObject.date = pbObj.date + 978307200 // convert apple format to epoch

  for (const item of pbObj.library) {
    paperbackIdSet.add(item.manga.id)
    paperbackIdTabDic[item.manga.id] = item.libraryTabs.map((obj) => obj.name)
  }

  for (const item of pbObj.sourceMangas) {
    if (!paperbackIdSet.has(item.manga.id)) {
      continue
    }
    const sourceId = item.sourceId + " [MIGRATE ME]"
    mangaIdSet.add(item.mangaId)
    aidokuSourcesSet.add(sourceId)

    const categories = paperbackIdTabDic[item.manga.id] ?? []

    const aidokuLibraryItem: AidokuLibrary = {
      mangaId: item.mangaId ?? '',
      lastUpdated: 0,
      categories: [],
      dateAdded: 0,
      sourceId: sourceId,
      lastOpened: 0
    }

    const aidokuMangaItem: AidokuManga = {
      id: item.mangaId ?? '',
      lastUpdate: 0,
      author: item.manga.author,
      url: '',
      nsfw: item.manga.hentai ? 2 : 0,
      tags: [],
      title: item.manga.titles[0],
      sourceId: sourceId,
      desc: item.manga.desc,
      cover: item.manga.image,
      viewer: 0,
      status: getStatus(item.manga.status ?? '')
    }
    aidokuObject.library.push(aidokuLibraryItem)
    aidokuObject.manga.push(aidokuMangaItem)
  }

  for (const item of pbObj.chapterMarkers) {
    if (!item.chapter) {
      continue
    }
    if (!mangaIdSet.has(item.chapter.mangaId)) {
      continue
    }
    const sourceId = item.chapter.sourceId + " [MIGRATE ME]"
    aidokuSourcesSet.add(sourceId)

    const sourceOrder = new Int16Array(1)
    sourceOrder[0] = Math.abs(item.chapter.sortingIndex)

    const aidokuChapterItem: AidokuChapter = {
      volume: (item.chapter.volume > 0 ? item.chapter.volume : -1) ?? -1,
      mangaId: item.chapter.mangaId ?? '',
      lang: item.chapter.langCode ?? '',
      id: item.chapter.id ?? '',
      scanlator: item.chapter.group ?? '',
      title: item.chapter.name ?? '',
      sourceId: sourceId,
      dateUploaded: item.chapter.time + 978307200,
      chapter: item.chapter.chapNum ?? -1,
      sourceOrder: sourceOrder[0] ?? 0
    }
    const aidokuHistoryItem: AidokuHistory = {
      progress: item.lastPage,
      mangaId: item.chapter.mangaId ?? '',
      chapterId: item.chapter.id ?? '',
      completed: item.completed,
      sourceId: sourceId,
      dateRead: item.time + 978307200
    }
    aidokuObject.chapters.push(aidokuChapterItem)
    aidokuObject.history.push(aidokuHistoryItem)
  }

  aidokuObject.sources = Array.from(aidokuSourcesSet)

  return {
    backup: aidokuObject,
    dateString: dateString
  }
}

function getStatus(status: string): number {
    switch (status.toLowerCase()) {
        case 'ongoing':
            return 1
        case 'completed':
            return 2
        case 'abandoned':
            return 3
        case 'hiatus':
            return 4
        case 'unknown':
            return 0
        default:
            return 1
    }
}
