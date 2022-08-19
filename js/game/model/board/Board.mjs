'use strict';

import Configuration from '../../../global/Configuration.mjs';
import BoardParser from './BoardParser.mjs';
import Directions from '../Directions.mjs';


export default class Board {

   #board = [];
   #initialPacmanPositionList = [];
   #initialGhostPositionList = [];
   #teleporterPositionList = [];
   #bonusSpawnPositionList = [];
   #ghostScatterPositionList = [];
   #ghostOptionalSpawnPositionList = [];


   constructor(levelJson) {
      new BoardParser(this).parse(levelJson);
   }


   setBoard(board) {
      this.#board = board;
   }


   setInitialPacmanPositions(positionList) {
      this.#initialPacmanPositionList = positionList;
   }


   setInitialGhostPositions(positionList) {
      this.#initialGhostPositionList = positionList;
   }


   setTeleporterPositions(positionList) {
      this.#teleporterPositionList = positionList;
   }


   setBonusSpawnPositions(positionList) {
      this.#bonusSpawnPositionList = positionList;
   }


   setGhostScatterPositions(positionList) {
      this.#ghostScatterPositionList = positionList;
   }


   setGhostOptionalSpawnPositions(positionList) {
      this.#ghostOptionalSpawnPositionList = positionList;
   }


   updateActorLayerPosition(x, y, character) {
      const internalPosition = this.#board[y][x];
      internalPosition.setActorCharacter(character);
   }


   updateElementLayerPosition(x, y, character) {
      const internalPosition = this.#board[y][x];
      internalPosition.setElementCharacter(character);
   }


   getPosition(x, y) {
      return this.#board[y][x].clone();
   }


   getInitialPacmanPositions() {
      return this.#initialPacmanPositionList;
   }


   getInitialGhostPositions() {
      return this.#initialGhostPositionList;
   }


   getTeleporterPositions() {
      return this.#teleporterPositionList;
   }


   getBonusSpawnPositions() {
      return this.#bonusSpawnPositionList;
   }


   getGhostScatterPositions() {
      return this.#ghostScatterPositionList;
   }


   getOptionalGhostSpawnPositions() {
      return this.#ghostOptionalSpawnPositionList;
   }


   buildBoardPositionArray() {
      const outputList = [];
      let row = [];
      for (let y = 0; y < this.#board.length; y++) {
         for (let x = 0; x < this.#board[y].length; x++) {
            row.push(this.getPosition(x, y));
         }
         outputList.push(row);
         row = [];
      }
      return outputList;
   }


   buildAccessibleBoardPositionList() {
      const outputList = [];
      for (let y = 0; y < this.#board.length; y++) {
         for (let x = 0; x < this.#board[y].length; x++) {
            if (this.isAccessibleAt(x, y)) {
               outputList.push(this.getPosition(x, y));
            }
         }
      }
      return outputList;
   }


   buildAccessibleNeighborIdList() {
      const outputList = [];
      let idList = [];
      for (let y = 0; y < this.#board.length; y++) {
         for (let x = 0; x < this.#board[y].length; x++) {
            if (this.isAccessibleAt(x, y)) {
               for(let position of this.buildAccessibleNeighborList(x, y)) {
                  idList.push(position.getID());
               }
               outputList.push(idList);
               idList = [];
            }
         }
      }
      return outputList;
   }


   buildAccessibleNeighborList(xPosition, yPosition) {
      const neighborPositionList = [];

      for (let i = Directions.getMinDirectionID(); i <= Directions.getMaxDirectionID(); i++) {
         const direction = Directions.getDirectionByID(i);
         const neighborX = xPosition + direction.x;
         const neighborY = yPosition + direction.y;
         if (this.isIndexOnBoard(neighborX, neighborY) && this.isAccessibleAt(neighborX, neighborY)) {
            neighborPositionList.push(this.getPosition(neighborX, neighborY));
         }
      }
      return neighborPositionList;
   }


   isAccessibleAt(x, y) {
      return this.#board[y][x].getID() !== Configuration.idInaccessibleBoardTiles;
   }


   isIndexOnBoard(x, y) {
      return 0 <= y && y < this.#board.length &&
             0 <= x && x < this.#board[y].length;
   }


   countOccurrencesOfCharacters(characters) {
      let counter = 0;
      for (let y = 0; y < this.#board.length; y++) {
         for (let x = 0; x < this.#board[y].length; x++) {
            for (let character of characters) {
               if (this.#board[y][x].getActorLayerCharacter() === character ||
                   this.#board[y][x].getElementLayerCharacter() === character) {
                  counter++;
                  break;
               }
            }
         }
      }
      return counter;
   }
   
   
}