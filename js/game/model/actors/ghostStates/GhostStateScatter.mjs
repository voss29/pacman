'use strict';

import GhostState from './GhostState.mjs';
import Configuration from '../../../../global/Configuration.mjs';
import GhostStateScaredStart from './GhostStateScaredStart.mjs';
import GhostStateChase from './GhostStateChase.mjs';


export default class GhostStateScatter extends GhostState {


    constructor(ghost) {
        super(ghost);
        super.setName(Configuration.nameGhostStateScatter);
        super.setSpriteDisplayPriority(Configuration.ghostStateScaredSpriteDisplayPriority);
        super.setDurationInTurns(Configuration.turnDurationGhostStateScatter);
    }


    getSubsequentState() {
        return new GhostStateChase(super.getGhost());
    }


    isHostileTowardsPacman() {
        return true;
    }


    isKillable() {
        return false;
    }


    executeMovementPattern() {
        let ghost = super.getGhost();
        let currentPositionId = ghost.getCurrentPosition().id;
        let nextPosition = this.calculateNextPosition(currentPositionId);
        ghost.nextPosition = nextPosition;
    }


    scare() {
        let ghost = super.getGhost();
        ghost.setState(new GhostStateScaredStart(ghost));
    }


    kill() {
        // ghosts can only be killed when scared
    }


    // scatter state movement pattern
    calculateNextPosition(currentPositionId) {
        let ghost = super.getGhost();
        let routing = ghost.getRouting();
        let scatterPositionId = ghost.getScatterID();
        return routing.calculateNextPositionOnShortestPath(currentPositionId, scatterPositionId);
    }


    handleTeleporterCollision() {
        const ghost = super.getGhost();
        if (ghost.isCurrentPositionTeleporter()) {

            // ghost has the option to move over teleporters without teleporting
            if (ghost.isNextPositionEqualToTeleportDestination()) {
                ghost.teleportationStatus = true;
            } else {
                ghost.teleportationStatus = false;
            }

        } else {
            ghost.teleportationStatus = false;
        }
    }


    handleScatterPositionCollision() {
        let ghost = super.getGhost();
        if (ghost.getCurrentPosition().id === ghost.getScatterID()) {
            ghost.nextPosition = ghost.getCurrentPosition();
            ghost.movementDirectionName = Configuration.directionNameDown;
        }
    }


    handlePacmanCollisionOnNextPosition() {
        let ghost = super.getGhost();
        if (ghost.isNextPositionActorCharacter(Configuration.pacmanCharacter)) {
            ghost.killPacman(ghost.getNextPosition().id);
        }
    }


    handleInaccessibleTileCollision() {
        // collision is not possible, because state movement pattern is based on the routing table 
        // for all ACCESSIBLE positions        
    }


    handleSpawnCollision() {
        // spawn position can not be equal to scatter position
    }


}