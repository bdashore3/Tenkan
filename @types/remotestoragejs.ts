import RemoteStorage from 'remotestoragejs'
import { CubariObject } from './cubari'

interface Cubari {
  name: string
  builder: any
  addSeries(manga: CubariObject): Promise<void>
}

export class CubariRemoteStorage extends RemoteStorage {
  cubari: Cubari | undefined
}
