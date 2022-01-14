import React from "react"
import { PlayerContainer } from "./PlayerContainer"
import { ScoreContainer } from "./ScoreContainer"

export const AppContainer = () => {

    return (
        <div className="app_container">
            <PlayerContainer />
            <ScoreContainer />
        </div>
    )
}
