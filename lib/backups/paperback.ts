import { MangaObject } from '@/@types/mangaObject'
import { PBBackup } from '@/@types/paperback'

// By nmn
export function convertPaperback(rawJson: string): Array<MangaObject> {
  const mangaArray: Array<MangaObject> = []
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

    // Cubari object
    const cubariManga: MangaObject = {
      title: item.manga.titles[0],
      url: baseUrl + item.mangaId,
      slug: item.mangaId,
      coverUrl: item.manga.image,
      chapters: [],
      timestamp: Date.now(),
      pinned: false,
      source: item.sourceId.toLowerCase()
    }
    mangaArray.push(cubariManga)
  }

  //console.log('Completed\nGo to output/output.json');
  return mangaArray
}
