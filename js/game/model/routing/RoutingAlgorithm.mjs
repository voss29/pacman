'use strict';

import Utility from '../../../global/Utility.mjs';


export default class RoutingAlgorithm {
     
   
   calculateRoutingTable(routingTable, neighborIdList) {
      let startNodeId = 0;
      while (startNodeId < routingTable.length) {
         this.#calculateShortestPathsFrom(routingTable, neighborIdList, startNodeId);
         startNodeId++;
      }
      return routingTable;
   }
   
   
   #calculateShortestPathsFrom(routingTable, neighborIdList, idStartNode) {
      
      //phase 1: initialize all neighboring nodes of start node
      let unusedNodes = routingTable[idStartNode].slice();
      let currentNode = routingTable[idStartNode][idStartNode];
      let routingNode = null;
      Utility.removeElementFrom(unusedNodes, currentNode);
      
      for (let neighborId of this.#getNeighborIdListFor(currentNode, neighborIdList)) {
         routingNode = routingTable[idStartNode][neighborId];
         routingNode.pathCost = 1;
         routingNode.predecessorId = currentNode.id;
      }
      
      //phase 2: iterate through all unused nodes
      while (unusedNodes.length > 0) {
         currentNode = this.#searchLowestCostNode(unusedNodes);
         for (let neighborId of this.#getNeighborIdListFor(currentNode, neighborIdList)) {
            routingNode = routingTable[idStartNode][neighborId];           
            if (unusedNodes.indexOf(routingNode) !== -1) {
               if (routingNode.pathCost > currentNode.pathCost + 1) {
                  routingNode.pathCost = currentNode.pathCost + 1;
                  routingNode.predecessorId = currentNode.id;
               }
            }
         }
         Utility.removeElementFrom(unusedNodes, currentNode);
      }
      
   }
   
   
   #searchLowestCostNode(nodes) {
      let minCostNode = nodes[0];
      for (let i = 1; i < nodes.length; i++) {
         if (nodes[i].pathCost < minCostNode.pathCost) {
            minCostNode = nodes[i];
         }
      }
      return minCostNode;
   }


   #getNeighborIdListFor(node, neighborIdList) {
      return neighborIdList[node.id];
   }
   
   
}