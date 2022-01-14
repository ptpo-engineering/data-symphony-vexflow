import React, { useEffect, useReducer } from 'react';
import { Score, Staves } from '../component/Score';
import { MidiUtils } from '../interactor/MidiUtils';

export const ScoreContainer = () => {
    const wWidth = window.innerWidth
    const marginWidth = 20

    const [state, dispatch] = useReducer(reducer, { stavesList: [] });

    type Action =
        | { type: 'append', staves: Staves, tymeSig: string, keySig: string }

    type State = {
        stavesList: { list: Staves, tymeSig: string, keySig: string }[]
    }

    function reducer(state: State, action: Action): State {
        switch (action.type) {
            case 'append':
                let newList
                if (state.stavesList.length === 0) {
                    newList = [{ list: action.staves, tymeSig: action.tymeSig, keySig: action.keySig }]
                } else {
                    newList = state.stavesList.concat([{ list: action.staves, tymeSig: action.tymeSig, keySig: action.keySig }])
                }
                return {
                    stavesList: newList
                };
        }
    }

    function splitToBulks<T>(arr: T[], bulkSize: number = 4): T[][] {
        const bulks: T[][] = [];
        for (let i = 0; i < Math.ceil(arr.length / bulkSize); i++) {
            bulks.push(arr.slice(i * bulkSize, (i + 1) * bulkSize));
        }
        return bulks;
    }

    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        MidiUtils.read("clips/all_star.mid")
            .then(midi => {
                const timeSig = MidiUtils.getTimeSig(midi)
                const keySig = MidiUtils.getKey(midi)
                const oneLineStave = MidiUtils.getStaves(midi)
                splitToBulks(oneLineStave).forEach(staves => {
                    dispatch({ type: 'append', staves: staves, tymeSig: timeSig, keySig: keySig })
                })
                return midi
            })
            .catch(error => console.error(error))
    }, [])

    return (
        <>
            {
                state.stavesList.map((stavesList, index) =>
                    <Score key={index} keySignature={stavesList.keySig} width={wWidth - marginWidth} timeSignature={stavesList.tymeSig} staves={stavesList.list} />
                )
            }
        </>
    );
}
