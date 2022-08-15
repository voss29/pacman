'use strict';

import Configuration from '../Configuration.mjs';
import EditorInternalLevel from './EditorInternalLevel.mjs';
import EditorDefaultState from './EditorDefaultState.mjs';
import EditorElementMapper from './EditorElementMapper.mjs';


export default class Editor {


    #editorContainer = null;
    #inputMapWidth = null;
    #inputMapHeight = null;
    #internalLevel = null;
    #isGhostBlinkyScatterSpawnControlDisplayed = false;
    #isGhostPinkyScatterSpawnControlDisplayed = false;
    #isGhostClydeScatterSpawnControlDisplayed = false;
    #isGhostInkyScatterSpawnControlDisplayed = false;
    #currentState = null;


    constructor() {
        this.#editorContainer = document.getElementById('editor_container');
        this.#currentState = new EditorDefaultState();
        this.#initializeInternalLevel();
        this.#initializeDimensionInput();
        EditorElementMapper.initializeMaps();
    }


    #initializeInternalLevel() {
        this.#internalLevel = new EditorInternalLevel();

        const width = Configuration.editorBoardDefaultWidth;
        const height = Configuration.editorBoardDefaultHeight;
        this.#internalLevel.initialize(width, height);
    }


    #initializeDimensionInput() {
        this.#inputMapWidth = document.getElementById('map_width');
        this.#inputMapHeight = document.getElementById('map_height');

        this.#inputMapWidth.setAttribute('min', Configuration.editorBoardMinWidth);
        this.#inputMapWidth.setAttribute('max', Configuration.editorBoardMaxWidth);

        this.#inputMapHeight.setAttribute('min', Configuration.editorBoardMinHeight);
        this.#inputMapHeight.setAttribute('max', Configuration.editorBoardMaxHeight);

        this.#inputMapWidth.value = Configuration.editorBoardDefaultWidth;
        this.#inputMapHeight.value = Configuration.editorBoardDefaultHeight;
    }


    setState(state) {
        this.#currentState.exit();
        this.#currentState = state;
        this.#currentState.initialize(this);
    }


    setEditorContainerDimension(width, height) {
        this.#editorContainer.style.width = `${width * 32}px`;
        this.#editorContainer.style.height = `${height * 32}px`;
    }


    setSpawnScatterControlDisplayStatus(ghostCharacter, isDisplayed) {
        switch(ghostCharacter) {
            case Configuration.ghostBlinkyCharacter:
                this.#isGhostBlinkyScatterSpawnControlDisplayed = isDisplayed;
            case Configuration.ghostPinkyCharacter:
                this.#isGhostPinkyScatterSpawnControlDisplayed = isDisplayed;
            case Configuration.ghostInkyCharacter:
                this.#isGhostInkyScatterSpawnControlDisplayed = isDisplayed;
            case Configuration.ghostClydeCharacter:
                this.#isGhostClydeScatterSpawnControlDisplayed = isDisplayed;
        }
    }


    resetSpawnScatterControlDisplayStatus() {
        this.#isGhostBlinkyScatterSpawnControlDisplayed = false;
        this.#isGhostPinkyScatterSpawnControlDisplayed = false;
        this.#isGhostClydeScatterSpawnControlDisplayed = false;
        this.#isGhostInkyScatterSpawnControlDisplayed = false;
    }


    resetInternalLevel() {
        const width = this.getMapWidthInput();
        const height = this.getMapHeightInput();
        this.#internalLevel.initialize(width, height);
    }


    getBoardCharacterAt(coordinates) {
        return this.#internalLevel.getBoardCharacterAt(coordinates);
    }


    getCounterForGhostType(ghostCharacter) {
        return this.#internalLevel.getGhostCounterFor(ghostCharacter);
    }


    getGhostCoordinatesListFor(ghostCharacter) {
        return this.#internalLevel.getGhostCoordinateListFor(ghostCharacter);
    }


    getScatterSpawnControlDisplayStatusForGhostType(ghostCharacter) {
        switch(ghostCharacter) {
            case Configuration.ghostBlinkyCharacter:
                return this.#isGhostBlinkyScatterSpawnControlDisplayed;
            case Configuration.ghostPinkyCharacter:
                return this.#isGhostPinkyScatterSpawnControlDisplayed;
            case Configuration.ghostInkyCharacter:
                return this.#isGhostInkyScatterSpawnControlDisplayed;
            case Configuration.ghostClydeCharacter:
                return this.#isGhostClydeScatterSpawnControlDisplayed;
        }
    }


    getMapWidthInput() {
        return this.#inputMapWidth.value;
    }


    getMapHeightInput() {
        return this.#inputMapHeight.value;
    }


    getGhostCharacterListForScatterPosition(coordinateString) {
        return this.#internalLevel.getGhostCharacterListForScatterPosition(coordinateString);
    }


    getGhostCharacterListForSpawnPosition(coordinateString) {
        return this.#internalLevel.getGhostCharacterListForSpawnPosition(coordinateString);
    }


    isCoordinateBonusSpawnPosition(coordinateString) {
        return this.#internalLevel.isCoordinateBonusSpawnPosition(coordinateString);
    }


    updateInternalBoard(coordinateString, element) {
        const internalElement = this.getInternalElement(element);
        this.#internalLevel.update(coordinateString, internalElement);
    }


    addEditorTile(newTile) {
        this.#editorContainer.appendChild(newTile);
    }


    addScatterPosition(buttonId, coordinateString) {
        const ghostCharacter = this.getGhostCharacterFor(buttonId);
        this.#internalLevel.addScatterPosition(ghostCharacter, coordinateString);
    }


    addSpawnPosition(buttonId, coordinateString) {
        const ghostCharacter = this.getGhostCharacterFor(buttonId);
        this.#internalLevel.addOptionalSpawnPosition(ghostCharacter, coordinateString);
    }


    addBonusSpawnPosition(coordinateString) {
        this.#internalLevel.addBonusSpawnPosition(coordinateString);
    }


    removeScatterPositionFor(buttonId) {
        const ghostCharacter = this.getGhostCharacterFor(buttonId);
        this.#internalLevel.removeScatterPositionFor(ghostCharacter);
    }


    removeSpawnPositionFor(buttonId) {
        const ghostCharacter = this.getGhostCharacterFor(buttonId);
        this.#internalLevel.removeSpawnPositionFor(ghostCharacter);
    }


    removeScatterAndSpawnPosition(coordinateString) {
        this.#internalLevel.removeScatterPosition(coordinateString);
        this.#internalLevel.removeSpawnPosition(coordinateString);
    }


    removeBonusSpawnPositionAt(coordinateString) {
        this.#internalLevel.removeBonusSpawnPositionAt(coordinateString);
    }


    clearMap() {
        while (this.#editorContainer.firstChild) {
           this.#editorContainer.removeChild(this.#editorContainer.firstChild);
        }
    }


    sendLevelJson() {
        const itemName = Configuration.customLevelSessionStorageItemName;
        const levelJSONString = this.#internalLevel.buildLevelJSONString();
        window.sessionStorage.setItem(itemName, levelJSONString);
    }


    getGhostCharacterFor(buttonId) {
        return EditorElementMapper.buttonIdToGhostCharacterMap.get(buttonId);
    }


    getInternalElement(tileType) {
        return EditorElementMapper.tileTypeToInternalElementMap.get(tileType);
    }


    // ======== Delegate callback calls to implementation in current state ===========

    handleEditorContainerMouseDown(event) {
        this.#currentState.handleEditorContainerMouseDown(event.target.id);
    }


    handleEditorContainerMouseUp(event) {
        this.#currentState.handleEditorContainerMouseUp(event.target.id);
    }


    handleEditorContainerMouseLeave(event) {
        this.#currentState.handleEditorContainerMouseLeave(event.target.id);
    }


    handleEditorTileClick(event) {
        this.#currentState.handleEditorTileClick(event.target.id);
    }


    handleEditorTileMouseOver(event) {
        this.#currentState.handleEditorTileMouseOver(event.target.id);
    }


    handleEditorTileMouseEnter(event) {
        this.#currentState.handleEditorTileMouseEnter(event.target.id);
    }


    handleEditorTileMouseLeave(event) {
        this.#currentState.handleEditorTileMouseLeave(event.target.id);
    }


}