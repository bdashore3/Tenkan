import React, { ChangeEvent, useEffect, useState } from 'react'
import Widget from 'remotestorage-widget'
import { remoteStorage } from '@/lib/remoteStorage'
import testJson from '@/tests/testInput'
import { convertPaperback } from '@/lib/backups/paperback'

export default function CubariWrapper() {
  useEffect(() => {
    new Widget(remoteStorage).attach('rs-widget')
  }, [])

  function addFile() {
    for (const manga of testJson) {
      console.log(remoteStorage.cubari?.addSeries(manga))
    }
  }

  function fileChanged(event: ChangeEvent<HTMLInputElement>) {
    console.log('Files were changed')

    if (event.target.files == null) {
      console.log('Files were null')

      return
    }

    let fr = new FileReader()

    fr.onload = async (e) => {
      if (e.target == null) {
        return
      }

      const convertedBackup = convertPaperback(e.target.result as string)

      for (const manga of convertedBackup) {
        console.log(`Uploading series ${manga.title}`)
        try {
          await remoteStorage.cubari?.addSeries(manga)
        } catch (error) {
          console.log(error)
        }
      }

      console.log('Upload complete. Any errors are listed in the console.')
    }

    fr.readAsText(event.target.files[0])
  }

  return (
    <div className="flex flex-col relative min-w-screen items-center justify-content-center">
      <p>To get started, connect your RemoteStorage account.</p>
      <div id="rs-widget" className="mb-5"></div>
      <p>Upload a backup from one of the manga apps below</p>
      <div>
        <button
          type="button"
          className="border-solid border-2 border-black p-2 rounded-md cursor-pointer hover:bg-black hover:text-white duration-200 m-2"
          onClick={addFile}>
          File addition test
        </button>
        <label
          htmlFor="upload"
          className="border-solid border-2 text-lg border-red-300 p-2 rounded-md cursor-pointer hover:bg-red-300 hover:text-black duration-200 m-2">
          <strong>Paperback</strong>
        </label>
        <input
          type="file"
          id="upload"
          accept="application/json"
          className="hidden"
          onChange={fileChanged}
        />
      </div>
    </div>
  )
}
