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
  const aidokuObject: AidokuBackup = {
    history: [],
    manga: [],
    chapters: [],
    library: [],
    sources: [],
    date: 0,
    name: `Paperback Backup ${dateString}`,
    version: 'pb-aidoku-v0.0.1'
  }

  const pbObj: PBBackup = JSON.parse(rawJson)
  const paperbackIdSet: Set<string> = new Set<string>()
  const mangaIdSet: Set<string> = new Set<string>()
  const aidokuSourcesSet: Set<string> = new Set<string>()

  aidokuObject.date = pbObj.date + 978307200 // convert apple format to epoch

  for (const item of pbObj.library) {
    paperbackIdSet.add(item.manga.id)
  }

  for (const item of pbObj.sourceMangas) {
    if (!paperbackIdSet.has(item.manga.id)) {
      continue
    }
    const sourceId = getAidokuSourceId(item.sourceId)
    if (sourceId === '_unknown') {
      continue
    }
    if (item.mangaId.length < 10 && sourceId == 'multi.mangadex') {
      // console.error( `OLD MangaDex ID MIGRTE: ${item.mangaId} - ${item.manga.titles[0]}`)
      continue
    }
    mangaIdSet.add(item.mangaId)
    aidokuSourcesSet.add(sourceId)

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
      viewer: Number(item.manga.additionalInfo.views ?? '0'),
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
    const sourceId = getAidokuSourceId(item.chapter.sourceId)
    if (sourceId === '_unknown') {
      continue
    }
    if (item.chapter.mangaId.length < 10 && sourceId == 'multi.mangadex') {
      continue
    }
    aidokuSourcesSet.add(sourceId)

    const sourceOrder = new Int16Array(1)
    sourceOrder[0] = Math.abs(item.chapter.sortingIndex)

    const aidokuChapterItem: AidokuChapter = {
      volume: item.chapter.volume ?? '',
      mangaId: item.chapter.mangaId ?? '',
      lang: item.chapter.langCode ?? '',
      id: item.chapter.id ?? '',
      scanlator: item.chapter.group ?? '',
      title:
        item.chapter.name == '' ? 'Chapter ' + item.chapter.chapNum.toString() : item.chapter.name,
      sourceId: sourceId,
      dateUploaded: item.chapter.time + 978307200,
      chapter: item.chapter.chapNum ?? 0,
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

function getAidokuSourceId(sourceId: string): string {
  switch (sourceId.toLowerCase()) {
    case 'mangalife':
    case 'mangasee':
      return 'en.nepnep'
    case 'mangadex':
      return 'multi.mangadex'
    case 'mangafox':
        return 'en.mangafox'
    default:
      return '_unknown'
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
