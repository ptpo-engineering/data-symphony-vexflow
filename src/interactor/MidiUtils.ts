import { Midi, Track } from '@tonejs/midi'
import * as Tone from 'tone'
import { Staves } from '../component/Score'

export class MidiUtils {

    static getKey(midi: Midi): string {
        return midi.header.keySignatures[0].key
    }

    static getStaves(midi: Midi, octaveShift: number = 1): Staves {
        console.log(midi)
        Tone.Transport.bpm.value = midi.header.tempos[0].bpm
        const staves: any[][] = []
        midi.tracks[0].notes.forEach(midiNote => {
            const bar = Math.floor(midiNote.bars)
            let stave = staves[bar]
            const key = `${midiNote.pitch}/${midiNote.octave + octaveShift}`
            const note = [key, Tone.Time(midiNote.duration).toNotation()]
            if (stave === undefined) {
                stave = [note]
            } else {
                stave.push(note)
            }
            staves[bar] = stave
        })
        for (let i = 0; i < staves.length; i++) {
            if (staves[i] === undefined) {
                staves[i] = [['b/4', 'wr']]
            }
        }
        return staves
    }

    static getTimeSig(midi: Midi): string {
        const ts = midi.header.timeSignatures[0].timeSignature
        return `${ts[0]}/${ts[1]}`
    }

    static async read(url: string): Promise<Midi> {
        return await Midi.fromUrl(url)
    }

    static play(track: Track): Tone.PolySynth {
        const now = Tone.now() + 0.5;
        const synth = new Tone.PolySynth(Tone.Synth, {
            envelope: {
                attack: 0.02,
                decay: 0.1,
                sustain: 0.3,
                release: 1,
            },
        }).toDestination();
        const fun = async () => {
            track.notes.forEach((note) => {
                synth.triggerAttackRelease(
                    note.name,
                    note.duration,
                    note.time + now,
                    note.velocity
                );
            });
        }
        fun()
        return synth
    }
}
