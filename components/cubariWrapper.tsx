import React, { ChangeEvent, useEffect, useState, useRef } from 'react'
import Widget from 'remotestorage-widget'
import { remoteStorage } from '@/lib/remoteStorage'
import * as Paperback from '@/lib/backups/paperback/Paperback'

export default function CubariWrapper() {
  useEffect(() => {
    new Widget(remoteStorage).attach('rs-widget')
  }, [])

  const [consoleOutput, setConsoleOutput] = useState<Array<string>>(['> Ready'])
  const consoleEndRef = useRef<HTMLDivElement | null>(null)
  const scrollToBottom = () => {
    consoleEndRef.current?.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'start'
    })
  }

  useEffect(scrollToBottom, [consoleOutput])

  function fileChanged(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault()

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

      const convertedBackup = Paperback.toCubari(e.target.result as string)

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
        scrollToBottom()
      }

      setConsoleOutput((consoleOutput) => [
        ...consoleOutput,
        '\n',
        'Upload complete. Any other errors are listed in the devtools console.',
        '\n',
        'Please use inspektor or cubari to see if your manga uploaded properly.'
      ])
      console.log('Upload complete. Any errors are listed here.')
    }

    fr.readAsText(event.target.files[0])
  }

  return (
    <div className="flex flex-col relative items-center justify-content-center">
      <p className="text-lg">To get started, connect your RemoteStorage account.</p>
      <div id="rs-widget"></div>
      <p className="pb-5">Upload a backup from one of the below manga apps</p>
      <div>
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
      <h1 className="text-2xl pt-8">Console</h1>
      <ul className="bg-darkbg scrollbar-thin scrollbar-thumb-whitesmoke scrollbar-thumb-rounded scrollbar-track-darkbg my-3 h-52 w-full whitespace-pre-line overflow-y-scroll">
        {consoleOutput.map((output, index) => (
          <li key={index}>{output}</li>
        ))}
        <div ref={consoleEndRef} />
      </ul>
    </div>
  )
}
