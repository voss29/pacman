"use strict";

class View {
   
   
   constructor(board_container_id, score_id, life_id) {
      this.board_container = document.getElementById(board_container_id);
      this.score_display = document.getElementById(score_id);
      this.life_display = document.getElementById(life_id);
   }


   initialize(board_position_array, ghost_door_direction_map) {
      this.clearBoard();
      this.setContainerDimension(board_position_array);
      this.addBackgroundElements(board_position_array, ghost_door_direction_map);
      this.addForegroundElements(board_position_array);
   }


   update(board_position, style_class, score, number_of_lifes) {
      this.updateBoard(board_position, style_class);
      this.updateScore(score);
      this.updateLifeBar(number_of_lifes);
   }
   

   printMessage(message) {
      window.alert(message);
   }


   clearBoard() {
      this.score_display.innerHTML = "";
      this.life_display.innerHTML = "";
      while (this.board_container.firstChild) {
         this.board_container.removeChild(this.board_container.firstChild);
      }
      
   }


   // requires the same column count for all rows!
   setContainerDimension(board) {
      this.board_container.style.height = `${board.length * Configuration.dimension_background_div_in_px}px`;
      this.board_container.style.width = `${board[0].length * Configuration.dimension_background_div_in_px}px`;
   }


   addBackgroundElements(board, ghost_door_direction_map) {
      let outer_div = null;
      let id_div = '';
      let style_class = '';
      let current_position = null;

      for (let y = 0; y < board.length; y++) {
         for (let x = 0; x < board[y].length; x++) {
            current_position = board[y][x];
            id_div = this.getDivID(current_position, Configuration.suffix_background_div);
            outer_div = this.createDiv(id_div);
            style_class = Configuration.getBackgroundStyleClass(current_position.getCharacter(),
                                                                current_position.getID(),
                                                                ghost_door_direction_map);
            outer_div.setAttribute('class', style_class);
            this.board_container.appendChild(outer_div);
         }
      }
   }
   

   addForegroundElements(board) {
      let outer_div = null;
      let inner_div = null;
      let id_div = '';
      let style_class = '';
      let current_position = null;
      
      for (let y = 0; y < board.length; y++) {
         for (let x = 0; x < board[y].length; x++) {
            current_position = board[y][x];
            id_div = this.getDivID(current_position, Configuration.suffix_background_div);
            outer_div = document.getElementById(id_div);
            id_div = this.getDivID(current_position, Configuration.suffix_foreground_div);
            inner_div = this.createDiv(id_div);
            style_class = Configuration.getForegroundStyleClass(current_position.getCharacter());
            inner_div.setAttribute('class', style_class);
            outer_div.appendChild(inner_div);
         }
      }
   }


   updateBoard(position, style_class) {
         let id_div = this.getDivID(position, Configuration.suffix_foreground_div);
         document.getElementById(id_div).setAttribute('class', style_class);
   }

   
   updateScore(score) {
      this.score_display.innerHTML = `score: ${score}`;
   }
   
   
   updateLifeBar(number_of_lifes) {
      this.life_display.innerHTML = `lifes: ${number_of_lifes}`;
   }
   
   
   createDiv(id) {
      let element = document.createElement('div');
      element.setAttribute('id', id);
      return element;
   }
   
   
   getDivID(position, suffix) {
      return `${position.getX().toString()}_${position.getY().toString()}_${suffix}`;
   }
   
   
}