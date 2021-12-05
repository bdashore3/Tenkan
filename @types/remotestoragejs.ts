import RemoteStorage from 'remotestoragejs'
import { MangaObject } from './mangaObject'

interface Cubari {
  name: string
  builder: any
  addSeries(manga: MangaObject): void
}

export class CubariRemoteStorage extends RemoteStorage {
  cubari: Cubari | undefined
}
