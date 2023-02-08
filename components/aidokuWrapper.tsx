import { ChangeEvent, useEffect, useState, useRef } from 'react'
import pako from 'pako'
import * as Paperback from '@/lib/backups/paperback/Paperback'
import * as Tachiyomi from 'tachiyomi-aidoku-converter';

interface AidokuResult {
  backup: unknown;
  dateString: string;
  missingSources?: string[];
}

export default function AidokuWrapper() {
  const [conversionSuccess, setConversionSuccess] = useState<boolean>(false)
  const [aidokuJson, setAidokuJson] = useState<string>('{}')
  const [newBackupName, setNewBackupName] = useState<string>('Aidoku.json')
  const [consoleOutput, setConsoleOutput] = useState<Array<string>>(['> Ready.'])
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

    setConsoleOutput(['> Starting...'])

    if (event.target.files == null) {
      setConsoleOutput((consoleOutput) => [
        ...consoleOutput,
        '> ERROR: No files were provided! Try reuploading?'
      ])
      console.log()

      return
    }

    // We know that files isn't null at this point
    setConsoleOutput((consoleOutput) => [
      ...consoleOutput,
      `> Your old backup name is: ${event.target.files![0].name}`
    ])

    let fr = new FileReader()

    fr.onload = async (e) => {
      if (e.target == null) {
        setConsoleOutput((consoleOutput) => [
          ...consoleOutput,
          '> ERROR: Something went wrong when parsing your backup, try uploading again.'
        ])
        return
      }

      let backupResult: AidokuResult;
      if (event.target.id === 'uploadPaperback') {
        backupResult = Paperback.toAidoku(new TextDecoder().decode(e.target.result as ArrayBuffer))

        setAidokuJson(JSON.stringify(backupResult.backup))
      } else if (event.target.id === 'uploadTachiyomi') {
        const data = pako.inflate(e.target.result as ArrayBuffer)
        backupResult = Tachiyomi.toAidoku(data)
        
        setAidokuJson(JSON.stringify(backupResult.backup, (_, v) => {
          const date = Date.parse(v);
          // Matches only what Date.toJSON() would return
          if (isNaN(date) || !(v.constructor === String && v.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/))) {
            return v;
          }
          return Math.floor(date / 1000);
        }))
      } else {
        setConsoleOutput((consoleOutput) => [
          ...consoleOutput,
          '> ERROR: Something went wrong when parsing your backup, try uploading again.'
        ])
        return
      }
      setNewBackupName(`Aidoku-${backupResult.dateString}.json`)

      setConsoleOutput((consoleOutput) => [
        ...consoleOutput,
        '> Conversion successful.',
        `  Your new backup name is: Aidoku-${backupResult.dateString}.json`
      ])

      if (backupResult.missingSources) {
        setConsoleOutput((consoleOutput) => [
          ...consoleOutput,
          `> NOTE: We couldn't convert manga from ${backupResult.missingSources!.length} sources.`,
          `  This is not an error; we probably didn't write converters for them.`,
          '  Here are their IDs:',
          ...backupResult.missingSources!.map((source) => `    - ${source}`)
        ])
      }
      getBlobLink()
      setConversionSuccess(true)
    }

    fr.readAsArrayBuffer(event.target.files[0])
  }

  // Fetch blob link for downloading
  function getBlobLink(): string {
    const blob = new Blob([aidokuJson], { type: 'application/json' })
    return URL.createObjectURL(blob)
  }

  return (
    <div className="flex flex-col relative items-center justify-content-center">
      <p className="pb-5">To get started, upload a backup from one of the below manga apps</p>
      <div>
        <label
          htmlFor="uploadPaperback"
          className="border-solid border-2 text-lg border-red-300 p-2 rounded-md cursor-pointer hover:bg-red-300 hover:text-black duration-200 m-2">
          <strong>Paperback</strong>
        </label>
        <input
          type="file"
          id="uploadPaperback"
          accept="application/json"
          className="hidden"
          onChange={fileChanged}
        />
        <label
          htmlFor="uploadTachiyomi"
          className="border-solid border-2 text-lg border-blue-500 p-2 rounded-md cursor-pointer hover:bg-blue-500 hover:text-black duration-200 m-2">
          <strong>Tachiyomi</strong>
        </label>
        <input
          type="file"
          id="uploadTachiyomi"
          accept=".gz"
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
      {conversionSuccess && (
        <button className="border-solid border-2 text-lg border-white p-2 rounded-md cursor-pointer hover:bg-white hover:text-black duration-200">
          <a href={getBlobLink()} download={newBackupName}>
            Download
          </a>
        </button>
      )}
    </div>
  )
}
