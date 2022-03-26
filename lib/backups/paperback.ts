import { CubariObject } from '@/@types/cubari'
import { PBBackup } from '@/@types/paperback'

// By nmn
export function convertPaperback(rawJson: string): Array<CubariObject> {
  const mangaArray: Array<CubariObject> = []
  const obj: PBBackup = JSON.parse(rawJson)

  // Set ==  faster
  const paperbackIdSet: Set<string> = new Set<string>()

  /* 
      Adding internal paperback id from library to check against in sourceMangas
      Sourcemangas also contains additional mangas from section like history
  */
  for (const item of obj.library) {
    paperbackIdSet.add(item.manga.id)
  }

  for (const item of obj.sourceMangas) {
    let baseUrl = ''

    switch (item.sourceId.toLowerCase()) {
      case 'mangadex':
        baseUrl = '/read/mangadex/'
        break
      case 'mangalife':
        item.sourceId = 'mangasee'
      case 'mangasee':
        baseUrl = '/read/mangasee/'
        break
      default:
        continue
    }

    // If manga not from library then don't add it
    if (!paperbackIdSet.has(item.manga.id)) {
      continue
    }

    // Search the parent backup for chapters and map marked chapters to an array
    const chapterArray = obj.chapterMarkers
      .filter((x) => x.chapter.mangaId === item.mangaId)
      .map((y) => y.chapter.chapNum.toString())

    // Cubari object
    const cubariManga: CubariObject = {
      title: item.manga.titles[0],
      url: baseUrl + item.mangaId,
      slug: item.mangaId,
      coverUrl: item.manga.image,
      chapters: chapterArray ?? [],
      timestamp: Date.now(),
      pinned: true,
      source: item.sourceId.toLowerCase()
    }
    mangaArray.push(cubariManga)
  }

  return mangaArray
}
