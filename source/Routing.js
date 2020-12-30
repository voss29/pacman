"use strict";

class Routing {
	
	
	constructor(game) {
		this.game = game;
		this.field_node_map = this.game.field.getFieldNodeMap();
		this.routing_algorithm = new RoutingAlgorithm(this.field_node_map);
		this.routing_table = this.routing_algorithm.buildRoutingTable();
	}
	
	
	calculateNextPosition(ghost_xPosition, ghost_yPosition) {
		var start_node = this.getRoutingNodeForGhost(ghost_xPosition, ghost_yPosition);
		var end_node = this.selectClosestPacmanNode(start_node);
		var next_position = this.selectFirstNodeOfShortestPath(start_node, end_node);
		return {xPosition: next_position.xPosition, yPosition: next_position.yPosition};
	}
	
	
	getRoutingNodeForGhost(x, y) {
		var ghost_id = this.getFieldNodeId(x, y);
		return this.routing_table[ghost_id][ghost_id];
	}
	
	
	selectClosestPacmanNode(start_node) {
		var min_cost_end_node = undefined;
		var current_end_node = undefined;
		
		for (var pacman of this.game.pacmans) {
			current_end_node = this.getRoutingNodeForPacman(start_node.id, pacman.xPosition, pacman.yPosition);
		
			if (min_cost_end_node == undefined || 
					current_end_node.getPathCost() < min_cost_end_node.getPathCost() ||
					current_end_node.getPathCost() == Infinity) {
					min_cost_end_node = current_end_node;
			}
		}
		
		return min_cost_end_node;
	}
	
	
	selectFirstNodeOfShortestPath(start_node, end_node) {	
		var current_end_node = end_node;
		while (current_end_node.getPredecessorId() != start_node.id) {
			current_end_node = this.routing_table[start_node.id][current_end_node.getPredecessorId()];
		}
		return current_end_node;
	}
	
	
	getFieldNodeId(x, y) {
		return this.field_node_map[y][x].id;
	}

	
	getRoutingNodeForPacman(ghost_id, x, y) {
		var pacman_id = this.getFieldNodeId(x, y);
		return this.routing_table[ghost_id][pacman_id];
	}

	
}