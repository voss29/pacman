"use strict";

import GhostState from "./GhostState.mjs";
import Configuration from "../Configuration.mjs";
import GhostStateScared from "./GhostStateScared.mjs";
import GhostStateChase from "./GhostStateChase.mjs";


export default class GhostStateScatter extends GhostState {


    constructor(duration_in_turns, ghost) {
        super(duration_in_turns, ghost);
        super.setBaseStyleClass(ghost.getBaseMovementStyleClass());
        super.setSpriteDisplayPriority(Configuration.GHOST_STATE_SCATTER_SPRITE_DISPLAY_PRIORITY);
    }


    getSubsequentState() {
        return new GhostStateChase(20, super.getGhost());
    }


    getStyleClass() {
        let base_style_class = super.getBaseStyleClass();
        let direction_name = super.getGhost().getCurrentMovementDirectionName();
        return `${base_style_class}_${direction_name}`;
    }


    isHostileTowardsPacman() {
        return true;
    }


    isKillable() {
        return false;
    }


    executeMovementPattern() {
        let ghost = super.getGhost();
        let current_position_id = ghost.getCurrentPosition().getID();
        let next_position = this.calculateNextPosition(current_position_id);
        ghost.setNextPosition(next_position);
    }


    scare() {
        let ghost = super.getGhost();
        ghost.setState(new GhostStateScared(30, ghost));
    }


    kill() {
        // ghosts can only be killed when scared
    }


    // scatter state movement pattern
    calculateNextPosition(current_position_id) {
        let ghost = super.getGhost();
        let routing = ghost.getRouting();
        let scatter_position_id = ghost.getScatterID();
        return routing.calculateNextPositionOnShortestPath(current_position_id, scatter_position_id);
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
            ghost.setMovementDirectionName(Configuration.DIRECTION_NAME_DOWN);
        }
    }


    handlePacmanCollisionOnNextPosition() {
        let ghost = super.getGhost();
        if (ghost.isNextPositionActorCharacter(Configuration.PACMAN_CHARACTER)) {
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