"use strict";

import GhostState from "./GhostState.mjs";
import Configuration from "./Configuration.mjs";
import GhostStateChase from "./GhostStateChase.mjs";


export default class GhostStateScatter extends GhostState {


    constructor(duration_in_turns, ghost) {
        super(duration_in_turns, ghost);
        super.setName(Configuration.ghost_state_scatter_name);
        super.setBaseStyleClass(ghost.getBaseStyleClass());
        super.setSpriteDisplayPriority(Configuration.GHOST_STATE_SCATTER_SPRITE_DISPLAY_PRIORITY);
    }


    executeStateMovementPattern() {
        let ghost = super.getGhost();
        let current_position_id = ghost.getCurrentPosition().getID();
        let next_position = this.calculateNextPosition(current_position_id);
        ghost.moveToPosition(next_position.getX(), next_position.getY());
    }


    // scatter state movement pattern
    calculateNextPosition(current_position_id) {
        let ghost = super.getGhost();
        let routing = ghost.getRouting();
        let scatter_position_id = ghost.getScatterID();
        return routing.calculateNextPositionOnShortestPath(current_position_id, scatter_position_id);
    }


    getSubsequentState() {
        return new GhostStateChase(20, super.getGhost());
    }


    getStyleClass() {
        return `${super.getBaseStyleClass()}_${super.getGhost().getMovementDirectionName()}`;
    }


    handlePacmanCollisionOnCurrentPosition() {
        // since pacmans move first, this collision (pacman moving to a position occupied by a ghost)
        // is handled by the method Pacman.handleGhostCollision()
    }


    handleTeleportation() {
        let ghost = super.getGhost();
        if (ghost.isCurrentPositionTeleporter()) {

            // ghost has the option to move over teleporters without teleporting
            if (ghost.isNextPositionEqualToTeleportDestination()) {

                // after teleportation ghost sprite should display the direction of the next move
                let after_teleportation_position_id = ghost.getNextPosition().getID();
                let next__after_teleportation_position = this.calculateNextPosition(after_teleportation_position_id);
                ghost.updateMovementDirection(ghost.getNextPosition(), next__after_teleportation_position);
                ghost.setTeleportationStatus(true);
            } 

        } else {
            ghost.setTeleportationStatus(false);
        }
    }


    handleScatterPositionCollision() {
        let ghost = super.getGhost();
        if (ghost.getCurrentPosition().getID() === ghost.getScatterID()) {
            ghost.setNextPosition(ghost.getCurrentPosition());
        }
    }


    handlePacmanCollisionOnNextPosition() {
        let ghost = super.getGhost();
        if (ghost.isNextBoardPositionEqual(Configuration.pacman_character)) {
            ghost.killPacman(ghost.getNextPosition().getID());
        }
    }


    handleWallCollision() {
        // wall collision is not possible, because state movement pattern is based on the routing table 
        // for all ACCESSIBLE positions
    }


    handleSpawnCollision() {
        // spawn position can not be equal to scatter position
    }


}