"use strict";

import Configuration from "../Configuration.mjs";
import Utility from "../Utility.mjs";


export default class EditorInternalLevel {


    constructor() {
        this.internal_board = [[]];
        this.scatter_positions = [];
        this.optional_spawn_positions = [];
        this.coordinates_ghost_blinky = [];
        this.coordinates_ghost_pinky = [];
        this.coordinates_ghost_clyde = [];
        this.coordinates_ghost_inky = [];
        this.mapCharacterToCoordinateList = null;
    }


    initialize(width, height) {
        this.reset();
        this.buildEmptyMap(width, height);
        this.mapCharacterToCoordinateList = {
            [Configuration.GHOST_BLINKY_CHARACTER]:     this.coordinates_ghost_blinky,
            [Configuration.GHOST_PINKY_CHARACTER]:      this.coordinates_ghost_pinky,
            [Configuration.GHOST_CLYDE_CHARACTER]:      this.coordinates_ghost_clyde,
            [Configuration.GHOST_INKY_CHARACTER]:       this.coordinates_ghost_inky
        };
    }


    getBoardCharacterAt(coordinates_string) {
        let coordinates = this.parseCoordinates(coordinates_string);
        return this.internal_board[coordinates.y][coordinates.x];
    }


    getGhostCoordinatesListFor(ghost_character) {
        let coordinates = this.mapCharacterToCoordinateList[ghost_character];
        return [...coordinates];
    }


    getGhostCounterFor(ghost_character) {
        let coordinates = this.mapCharacterToCoordinateList[ghost_character];
        return coordinates.length;
    }


    setBoardCharacter(coordinates, character) {
        this.internal_board[coordinates.y][coordinates.x] = character;
    }


    buildEmptyMap(width, height) {
        this.internal_board = [];
        let row = [];
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                row.push(Configuration.UNDEFINED_TILE_CHARACTER);
            }
            this.internal_board.push(row);
            row = [];
        }
    }


    reset() {
        this.internal_board = [[]];
        this.scatter_positions = [];
        this.optional_spawn_positions = [];
        this.coordinates_ghost_blinky = [];
        this.coordinates_ghost_pinky = [];
        this.coordinates_ghost_clyde = [];
        this.coordinates_ghost_inky = [];
    }


    update(coordinates_string, character) {
        let parsed_coordinates = this.parseCoordinates(coordinates_string);
        let current_board_character = this.getBoardCharacterAt(coordinates_string);
        this.updateGhostCoordinateLists(coordinates_string, current_board_character, character);
        this.setBoardCharacter(parsed_coordinates, character);
    }


    updateGhostCoordinateLists(coordinates_string, current_board_character, new_character) {
        if (Configuration.GHOST_CHARACTERS.includes(current_board_character)) {
            this.removeCoordinatesFromGhostList(coordinates_string, current_board_character);
        }

        if (Configuration.GHOST_CHARACTERS.includes(new_character)) {
            this.addCoordinatesToGhostList(coordinates_string, new_character);
        }
    }


    addCoordinatesToGhostList(coordinates, ghost_character) {
        let ghost_coordinates = this.mapCharacterToCoordinateList[ghost_character];
        ghost_coordinates.push(coordinates);
    }


    addScatterPosition(ghost_character, coordinates) {
        this.removeScatterPositionFor(ghost_character);
        let position_object = this.buildScatterSpawnPositionObject(ghost_character, coordinates);
        this.scatter_positions.push(position_object);
    }


    addOptionalSpawnPosition(ghost_character, coordinates) {
        this.removeSpawnPositionFor(ghost_character);
        let position_object = this.buildScatterSpawnPositionObject(ghost_character, coordinates);
        this.optional_spawn_positions.push(position_object);
    }


    removeScatterPositionFor(ghost_character) {
        for (let scatter_position of this.scatter_positions) {
            if (scatter_position.ghost === ghost_character) {
                Utility.removeElementFrom(this.scatter_positions, scatter_position);
            }
        }
    }


    removeSpawnPositionFor(ghost_character) {
        for (let optional_spawn_position of this.optional_spawn_positions) {
            if (optional_spawn_position.ghost === ghost_character) {
                Utility.removeElementFrom(this.optional_spawn_positions, optional_spawn_position);
            }
        }
    }


    buildScatterSpawnPositionObject(ghost_character, coordinates) {
        let parsed_coordinates = this.parseCoordinates(coordinates);
        let output_object = {};
        output_object.ghost = ghost_character;
        output_object.x = parsed_coordinates.x;
        output_object.y = parsed_coordinates.y;
        return output_object;
    }


    buildLevelJSONString() {
        let json_object = {};
        json_object.board = this.internal_board;
        json_object.scatter_positions = this.scatter_positions;
        json_object.optional_spawns = this.optional_spawn_positions;
        return JSON.stringify(json_object);
    }


    removeCoordinatesFromGhostList(coordinates, ghost_character) {
        let ghost_coordinates = this.mapCharacterToCoordinateList[ghost_character];
        Utility.removeElementFrom(ghost_coordinates, coordinates);
    }


    parseCoordinates(coordinates) {
        let parsed_input = coordinates.replace('(', '');
        parsed_input = parsed_input.replace(')', '');
        parsed_input = parsed_input.split(',');
        let x = parseInt(parsed_input[0]);
        let y = parseInt(parsed_input[1]);
        return {'x': x, 'y': y};
    }

    
}