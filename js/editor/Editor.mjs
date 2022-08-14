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


    resetInternalLevel(width, height) {
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


    getGhostCharactersForScatterPosition(coordinateString) {
        return this.#internalLevel.getGhostCharactersForScatterPosition(coordinateString);
    }


    getGhostCharactersForSpawnPosition(coordinateString) {
        return this.#internalLevel.getGhostCharactersForSpawnPosition(coordinateString);
    }


    isCoordinateBonusSpawnPosition(coordinateString) {
        return this.#internalLevel.isCoordinateBonusSpawnPosition(coordinateString);
    }


    // ======== IMPLEMENTATION OF CALLBACK FUNCTIONS ===========
    

    handleEditorContainerMouseDown(callerId) {
        this.#currentState.handleEditorContainerMouseDown(callerId);
    }


    handleEditorContainerMouseUp(callerId) {
        this.#currentState.handleEditorContainerMouseUp(callerId);
    }


    handleEditorContainerMouseLeave(callerId) {
        this.#currentState.handleEditorContainerMouseLeave(callerId);
    }


    handleEditorTileClick(callerId) {
        this.#currentState.handleEditorTileClick(callerId);
    }


    handleEditorTileMouseOver(callerId) {
        this.#currentState.handleEditorTileMouseOver(callerId);
    }


    handleEditorTileMouseEnter(callerId) {
        this.#currentState.handleEditorTileMouseEnter(callerId);
    }


    handleEditorTileMouseLeave(callerId) {
        this.#currentState.handleEditorTileMouseLeave(callerId);
    }


    updateInternalBoard(tileCoordinates, element) {
        let internalElement = EditorElementMapper.mapTileTypeToInternalElement[element];
        this.#internalLevel.update(tileCoordinates, internalElement);
    }


    addEditorTile(newTile) {
        this.#editorContainer.appendChild(newTile);
    }


    addScatterPosition(buttonId, coordinates) {
        let ghostCharacter = EditorElementMapper.mapButtonIdToGhostCharacter[buttonId];
        this.#internalLevel.addScatterPosition(ghostCharacter, coordinates);
    }


    addSpawnPosition(buttonId, coordinates) {
        let ghostCharacter = EditorElementMapper.mapButtonIdToGhostCharacter[buttonId];
        this.#internalLevel.addOptionalSpawnPosition(ghostCharacter, coordinates);
    }


    addBonusSpawnPosition(coordinates) {
        this.#internalLevel.addBonusSpawnPosition(coordinates);
    }


    removeScatterPositionFor(buttonId) {
        let ghostCharacter = buttonId;
        if (Configuration.ghostCharacterList.includes(buttonId) === false) {
            ghostCharacter = EditorElementMapper.mapButtonIdToGhostCharacter[buttonId];
        }
        this.#internalLevel.removeScatterPositionFor(ghostCharacter);
    }


    removeSpawnPositionFor(buttonId) {
        let ghostCharacter = buttonId;
        if (Configuration.ghostCharacterList.includes(buttonId) === false) {
            ghostCharacter = EditorElementMapper.mapButtonIdToGhostCharacter[buttonId];
        }
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
        let levelJSONString = this.#internalLevel.buildLevelJSONString();
        sessionStorage.setItem('customLevel', levelJSONString);
    }


}