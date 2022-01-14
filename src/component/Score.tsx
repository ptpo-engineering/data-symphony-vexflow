import React, { useRef, useEffect, RefObject, LegacyRef } from 'react'
import Vex, { Flow } from 'vexflow'

const VF = Vex.Flow
const { Formatter, Renderer, Stave, StaveNote } = VF

const clefWidth = 30;
const timeWidth = 30;

export type Staves = any[][]

export type ScoreProps = {
  staves: Staves,
  clef?: string,
  timeSignature?: string,
  width?: number,
  height?: number,
  keySignature?: string,
}

export const Score = ({
  staves,
  clef = 'treble',
  timeSignature = '4/4',
  width = 450,
  height = 150,
  keySignature,
}: ScoreProps): JSX.Element => {

  const thisRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<Vex.Flow.Renderer>()

  useEffect(() => {

    if (rendererRef.current == null) {
      rendererRef.current = new Renderer(
        thisRef.current!,
        Renderer.Backends.SVG
      )
    }
    const renderer = rendererRef.current
    renderer.resize(width, height)
    const context = renderer.getContext()
    context.setFont('Arial', 10).setBackgroundFillStyle('#eed')
    const clefAndTimeWidth = (clef ? clefWidth : 0) + (timeSignature ? timeWidth : 0);
    const staveWidth = (width - clefAndTimeWidth) / staves.length

    let currX = 0
    staves.forEach((notes, i) => {
      const stave = new Stave(currX, 0, staveWidth)
      if (i === 0) {
        stave.setWidth(staveWidth + clefAndTimeWidth)
        clef && stave.addClef(clef);
        timeSignature && stave.addTimeSignature(timeSignature);
        keySignature && stave.addKeySignature(keySignature)
      }
      currX += stave.getWidth()
      stave.setContext(context).draw()

      const processedNotes = notes
        .map(note => {
          let duration = 'q'
          let dot = false
          let key
          if (typeof note === 'string') {
            key = note
          } else {
            key = note[0] as string
            duration = note[1]
            if (duration.includes('.')) {
              dot = true
            }
            duration = duration.replace('d', '').replace('t', '').replace('n', '').replace('.', '')
          }
          const staveNote = new StaveNote({
            keys: [key],
            duration: String(duration)
          })
          if (dot) {
            staveNote.addDotToAll()
          }
          return staveNote
        })

      Formatter.FormatAndDraw(context, stave, processedNotes, {
        auto_beam: true, align_rests: false
      })
    })
  }, [staves])

  return (
    <div ref={thisRef} />
  )
}
