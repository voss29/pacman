"use strict";

import GhostDoorDirectionMapper from "./GhostDoorDirectionMapper.mjs";
import LevelInitializer from "./LevelInitializer.mjs";
import Configuration from "./Configuration.mjs";
import Teleporter from "./Teleporter.mjs";
import Utility from "./Utility.mjs";
import Board from "./Board.mjs";

/*  
    =================================================================================================================
    Represents the current state of the level.
    Holds references to Board (model), Pacmans, Ghosts and Teleporter. 
    Mediates between its associated game elements.
    Offers high level methods to class Game.js.
    =================================================================================================================
*/


export default class Level {


    constructor(game, level_text) {
        this.game = game;
        this.board = new Board(level_text);
        this.teleporters = [];
        this.pacmans = [];
        this.ghosts = [];
        this.available_points = 0;
        this.total_pacman_lifes = 0;
        this.score = 0;
        this.update_requests = [];
    }


    initialize() {
        let teleporter_positions = this.board.getTeleporterPositions();
        let pacman_positions = this.board.getInitialPacmanPositions();
        this.teleporters = LevelInitializer.initializeTeleporters(teleporter_positions);
        this.pacmans = LevelInitializer.initializePacmans(pacman_positions, this);

        let ghost_positions = this.board.getInitialGhostPositions();
        let scatter_positions = this.board.getGhostScatterPositions();
        let spawn_positons = this.board.getOptionalGhostSpawnPositions();
        let accessible_position_list = this.board.buildAccessibleBoardPositionList();
        let neighbor_id_list = this.buildAccessibleNeighborIdList();
        this.ghosts = LevelInitializer.initializeGhosts(ghost_positions,
                                                        scatter_positions,
                                                        spawn_positons,
                                                        accessible_position_list,
                                                        neighbor_id_list,
                                                        this);
                                                        
        this.board.setCharactersOfScatterPositionsTo(Configuration.point_character);
        this.board.setCharactersOfOptionalSpawnPositionsTo(Configuration.empty_tile_character);
        
        this.score = Configuration.initial_score;
        this.available_points = this.countAvailablePoints();
        this.total_pacman_lifes = this.countInitialPacmanLifes();
    }


    executeTurn() {
        this.moveActors(this.pacmans);
        if (this.isWon() === false && this.isLost() === false) {
            this.moveActors(this.ghosts);
        }
    }    


    scareLivingGhosts() {
        for (let ghost of this.ghosts) {
            if (ghost.getStateName() !== Configuration.ghost_state_dead_name) {
                ghost.scare();
            } 
        }
    }


    killGhost(position_id) {
        this.killActor(this.ghosts, position_id);
    }


    killPacman(position_id) {
        this.killActor(this.pacmans, position_id);
    }


    incrementScoreBy(value) {
        this.score += value;
    }

    
    decrementAvailablePoints() {
        this.available_points--;
    }


    decrementTotalPacmanLifes() {
        this.total_pacman_lifes--;
    }


    update() {
        for (let request of this.update_requests) {
            this.board.setPosition(request.getPosition());
            this.game.updateView(request.getPosition(), 
                                 request.getStyleClass(), 
                                 this.score, 
                                 this.total_pacman_lifes);
        }
        this.update_requests = [];
    }


    setNextPacmanDirection(direction_name) {
        for (let pacman of this.pacmans) {
           pacman.setMovementDirectionName(direction_name);
        }
    } 


    resetTurnMovementStatusOfActors(actors) {
        for (let actor of actors) {
            actor.setTurnMovementStatus(false);
        }
    }


    getBoardPositionAt(x, y) {
        return this.board.getPosition(x, y);
    }


    getBoardPositionArray() {
        return this.board.buildBoardPositionArray();
    }


    getPacmanIDs() {
        let ids = [];
        for (let pacman of this.pacmans) {
            ids.push(pacman.getCurrentPosition().getID());
        }
        return ids;
    }


    getStateNamesOfGhostsAt(position_id) {
        let output = [];
        let ghost_state = "";
        for (let ghost of this.ghosts) {
            if (ghost.getCurrentPosition().getID() === position_id) {
                ghost_state = ghost.getStateName();
                if (!output.includes(ghost_state)) {
                    output.push(ghost_state);
                }
            }
        }
        return output;
    }


    getTurnCompletionStatusForActor(actor_character, actor_id) {
        let result = true;
        let actors = (actor_character === Configuration.pacman_character) ? this.pacmans : this.ghosts;
        for (let actor of actors) {
            if (actor.getCurrentPosition().getID() === actor_id) {
                result = actor.getTurnMovementStatus();
                break;
            }
        }
        return result;
    }


    getTeleportDestination(position) {
        let destination = null;
        for (let teleporter of this.teleporters) {
            if (teleporter.isTeleporterFor(position)) {
                destination = teleporter.getDestinationPositionFor(position);
                break;
            }
        }
        return destination;
    }


    isWon() {
        return this.available_points === 0;
    }


    isLost() {
        return this.total_pacman_lifes === 0;
    }
   

    isBoardElementTeleporter(element) {
        return Teleporter.isElementTeleporter(element);
    }


    addUpdateRequest(request) {
        this.update_requests.push(request);
    }


    removeDeadPacmanAt(position_id) {
        for (let pacman of this.pacmans) {
            if (pacman.getCurrentPosition().getID() === position_id) {
                Utility.removeElementFrom(this.pacmans, pacman);
            }
        }  
    }


    buildAccessibleNeighborIdList() {
        let neighbor_id_list = this.board.buildAccessibleNeighborIdList();
        this.addTeleportersToNeighborIDList(neighbor_id_list);
        return neighbor_id_list;
    }


    addTeleportersToNeighborIDList(neighbor_id_list) {
        for (let teleporter of this.teleporters) {
            neighbor_id_list[teleporter.getIDPosition1()].push(teleporter.getIDPosition2());
            neighbor_id_list[teleporter.getIDPosition2()].push(teleporter.getIDPosition1());
        }
    }


    buildGhostDoorDirectionMap() {
        let ghost_door_positions = this.board.getGhostDoorPositions();
        return GhostDoorDirectionMapper.buildMap(ghost_door_positions, this);
    }


    buildAccessibleNeighborList(xPosition, yPosition) {
        return this.board.buildAccessibleNeighborList(xPosition, yPosition);
    }


    countAvailablePoints() {
        let point_characters = [Configuration.point_character, Configuration.powerup_character];
        return this.board.countOccurrencesOfCharacters(point_characters);
    }


    countInitialPacmanLifes() {
        return this.pacmans.length * Configuration.initial_pacman_lifes;
    } 


    countScaredGhosts() {
        let counter = 0;
        for (let ghost of this.ghosts) {
            if (ghost.getStateName() === Configuration.ghost_state_flee_name) {
                counter++;
            }
        }
        return counter;
    }


    moveActors(actors) {
        let unmoved_actors = [...actors];
        while (unmoved_actors.length > 0) {
            for (let actor of unmoved_actors) {
                if (actor.getTurnMovementStatus() == false) {
                    if (actor.move()) {
                        Utility.removeElementFrom(unmoved_actors, actor);
                    }
                }
            }
        }
        this.resetTurnMovementStatusOfActors(actors);
    }


    killActor(actors, position_id) {
        for (let actor of actors) {
            if (actor.getCurrentPosition().getID() === position_id) {
                actor.kill();
            }
        }
    }


}