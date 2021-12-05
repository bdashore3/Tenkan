import React, { ChangeEvent, useEffect, useState } from 'react'
import Widget from 'remotestorage-widget'
import { remoteStorage } from '@/lib/remoteStorage'
import testJson from '@/tests/testInput'

export default function CubariWrapper() {
  useEffect(() => {
    new Widget(remoteStorage).attach('rs-widget')
  }, [])

  function addFile() {
    for (const manga of testJson) {
      remoteStorage.cubari?.addSeries(manga)
    }
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

    fr.readAsText(event.target.files[0])
  }

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center tracking-wide border-solid border-2 border-green-500">
      <div id="rs-widget"></div>
      <button type="button" onClick={addFile}>
        Add a file
      </button>
      <input type="file" accept="application/json" onChange={fileChanged} />
    </div>
  )
}
