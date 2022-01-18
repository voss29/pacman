"use strict";

export default class Configuration {
   
   // Direction names
   static direction_name_up = "up";
   static direction_name_right = "right";
   static direction_name_down = "down";
   static direction_name_left = "left";

   
   // Game settings
   static initial_score = 0;
   static score_value_per_point = 10;
   static score_value_per_powerup = 50;
   static score_value_per_eaten_ghost = 200;
   static initial_pacman_lifes = 1;
   static initial_pacman_direction = Configuration.direction_name_right;
   static initial_ghosts_direction = Configuration.direction_name_down;

   static initial_ghosts_direction = "down";
   static interval_delay_in_milliseconds = 500;
   static default_level = '###########################\n'+
                          '#8ooooooooooo#ooooooooooo9#\n' +
                          '#o####o#####o#o#####o####o#\n' +
                          '#O####o#####o#o#####o####O#\n' +
                          '#ooooooooooooooooooooooooo#\n' +
                          '#o####o#o#########o#o####o#\n' +
                          '#oooooo#ooooo#ooooo#oooooo#\n' +
                          '######o#####o#o#####o######\n' +
                          '######o#xxxxxbxxxxx#o######\n' +
                          '######o#x####d####x#o######\n' +
                          '1xxxxxoxx#Bxxxxxx#xxoxxxxx1\n' +
                          '######o#x#########x#o######\n' +
                          '######o#xxxxxxxxxxx#o######\n' +
                          '######o#x#########x#o######\n' +
                          '#oooooooooooo#oooooooooooo#\n' +
                          '#o####o#####o#o#####o####o#\n' +
                          '#Oooo#ooooooopooooooo#oooO#\n' +
                          '####o#o#o#########o#o#o####\n' +
                          '#oooooo#ooooo#ooooo#oooooo#\n' +
                          '#o##########o#o##########o#\n' +
                          '#7ooooooooooooooooooooooo6#\n' +
                          '###########################\n';
   

                        
   // Internal and css representation of different game elements
   static id_unaccessible_board_element = -1;   // must be < 0

   static wall_character = "#";
   static empty_tile_character = "x";
   static ghost_door_character = "d";
   static teleporter_1_tile_character = "1";
   static teleporter_2_tile_character = "2";
   static teleporter_3_tile_character = "3";
   static pacman_character = "p";
   static ghost_blinky_character = "b";
   static ghost_blinky_spawn_character = "B";
   static point_character = "o";
   static powerup_character = "O";
   static scatter_point_character_blinky = "9";
   static scatter_point_character_pinky = "8";
   static scatter_point_character_inky = "7";
   static scatter_point_character_clyde = "6";

   static ghost_state_dead_name = "dead";
   static ghost_state_flee_name = "flee";
   static ghost_state_chase_name = "chase";
   static ghost_state_scatter_name = "scatter";
   static ghost_state_respawn_name = "respawn";
   
   static wall_background_css_class = "wall_tile";
   static empty_background_css_class = "empty_tile";
   static ghost_door_background_css_class = "ghost_door";
   static teleporter_1_background_css_class = "teleporter_1_tile";
   static teleporter_2_background_css_class = "teleporter_2_tile";
   static teleporter_3_background_css_class = "teleporter_3_tile";

   static pacman_foreground_css_class = "pacman";
   static ghost_blinky_movement_foreground_css_class = "ghost_blinky_movement";
   static ghost_blinky_respawn_foreground_css_class = "ghost_blinky_respawn"
   static ghost_scared_foreground_css_class = "ghost_scared";
   static ghost_dead_foreground_css_class = "ghost_dead";
   static point_foreground_css_class = "point";
   static powerup_foreground_css_class = "powerup";
   static empty_foreground_css_class = "empty_foreground";

   static ghost_door_direction_suffix_diagonal = "crossing";
   static ghost_door_direction_suffix_horizontal = "horizontal";
   static ghost_door_direction_suffix_vertical = "vertical";


   // Settings for view.js
   static suffix_foreground_div = "fg";
   static suffix_background_div = "bg";
   static dimension_background_div_in_px = 30;


   // Key Codes for pacman movement
   // Source http://www.javascriptkeycode.com 
   static key_code_left_arrow = 37;
   static key_code_up_arrow = 38;
   static key_code_right_arrow = 39;
   static key_code_down_arrow = 40;
   static key_code_a = 65;
   static key_code_d = 68;
   static key_code_s = 83;
   static key_code_w = 87;

   
   // Code for board parsing
   // Source: https://www.ascii-code.com/
   static linefeed_code = 10;


   // NEW
   static max_respawn_stage = 4;


}