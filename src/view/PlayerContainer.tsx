import React, { useState } from "react"
import { MidiUtils } from "../interactor/MidiUtils"
import * as Tone from "tone"
import { Button } from "rebass"

export const PlayerContainer = () => {

    const [playing, setPlaying] = useState(false)

    const play = async () => {
        const currentMidi = await MidiUtils.read("clips/all_star.mid")
        const synths: Tone.PolySynth[] = []

        if (!playing && currentMidi) {
            setPlaying(true)
            synths.push(MidiUtils.play(currentMidi.tracks[0]))
        } else {
            setPlaying(false)
            //dispose the synth and make a new one
            while(synths.length > 0) {
                const synth = synths.shift()
                synth?.disconnect()
            }
        }
    }

    return (
        <>
            <Button variant='primary' bg='blue' onClick={play}>Play</Button>
        </>
    )
}
