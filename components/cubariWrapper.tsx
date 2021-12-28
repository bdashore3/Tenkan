import React, { ChangeEvent, useEffect, useState } from 'react'
import Widget from 'remotestorage-widget'
import { remoteStorage } from '@/lib/remoteStorage'
import testJson from '@/tests/testInput'
import { convertPaperback } from '@/lib/backups/paperback'

export default function CubariWrapper() {
  const [consoleOutput, setConsoleOutput] = useState<Array<string>>(['> Ready'])

  useEffect(() => {
    new Widget(remoteStorage).attach('rs-widget')
  }, [])

  function addFile() {
    for (const manga of testJson) {
      setConsoleOutput((consoleOutput) => [...consoleOutput, 'New Output!'])
      console.log(`Website showing: ${consoleOutput}`)
      console.log(remoteStorage.cubari?.addSeries(manga))
    }
  }

  function fileChanged(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault()

    // Initalize the console output
    setConsoleOutput(['Starting...'])

    if (event.target.files == null) {
      setConsoleOutput((consoleOutput) => [
        ...consoleOutput,
        'ERROR: No files were provided! Try reuploading?'
      ])
      console.log()

      return
    }

    // We know that files isn't null at this point
    setConsoleOutput((consoleOutput) => [
      ...consoleOutput,
      `Your backup name is: ${event.target.files![0].name}`
    ])

    let fr = new FileReader()

    fr.onload = async (e) => {
      if (e.target == null) {
        setConsoleOutput((consoleOutput) => [
          ...consoleOutput,
          'ERROR: Something went wrong when parsing your backup, try uploading again.'
        ])
        return
      }

      const convertedBackup = convertPaperback(e.target.result as string)

      for (const manga of convertedBackup) {
        try {
          await remoteStorage.cubari?.addSeries(manga)

          setConsoleOutput((consoleOutput) => [
            ...consoleOutput,
            `> Uploaded series ${manga.title}`
          ])
          console.log(`Uploaded series ${manga.title}`)
        } catch (error) {
          setConsoleOutput((consoleOutput) => [...consoleOutput, error as string])

          console.log(error)
        }
      }

      setConsoleOutput((consoleOutput) => [
        ...consoleOutput,
        '\n',
        'Upload complete. Any other errors are listed in the devtools console.',
        '\n',
        'Please use inspektor or cubari to see if your manga uploaded properly.'
      ])
      console.log('Upload complete. Any errors are listed in the console.')
    }

    fr.readAsText(event.target.files[0])
  }

  return (
    <div className="flex flex-col relative items-center justify-content-center">
      <p className="text-lg">To get started, connect your RemoteStorage account.</p>
      <div id="rs-widget"></div>
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
      <h1 className="text-2xl p-3">Console</h1>
      <div className="bg-darkbg scrollbar-thin scrollbar-thumb-whitesmoke scrollbar-track-darkbg my-3 h-52 w-full whitespace-pre-line overflow-y-scroll">
        <ul>
          {consoleOutput.map((output, index) => (
            <li key={index}>{output}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
