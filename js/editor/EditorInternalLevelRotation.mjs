import EditorInternalLevel from "./EditorInternalLevel.mjs";
import Utility from "../global/Utility.mjs";
import Configuration from "../global/Configuration.mjs";


export default class EditorInternalLevelRotation {


    #internalLevelList = [];
    #initialLifeNumber = 0;
    #currentSelectedLevelIndex = 0;


    constructor() {}


    initialize() {
        const initialLevel = new EditorInternalLevel();
        initialLevel.initialize(Configuration.editorBoardDefaultWidth, Configuration.editorBoardDefaultHeight);
        this.#internalLevelList = [initialLevel];
        this.#initialLifeNumber = Configuration.editorDefaultLife;
    }


    set initialLifeNumber(number) {
        this.#initialLifeNumber = number;
    }


    addLevel(levelId) {
        const width = Configuration.editorBoardDefaultWidth;
        const height = Configuration.editorBoardDefaultHeight;
    
        const newLevel = new EditorInternalLevel();
        newLevel.initialize(width, height, levelId);
        this.#internalLevelList.push(newLevel);
        this.#currentSelectedLevelIndex = this.#internalLevelList.length - 1;
    }


    setCurrentLevelIterationNumber(iterationNumber) {
        const currentLevel = this.getLevel();
        currentLevel.numberOfIterations = iterationNumber;
    }


    /*
    removeLevel(internalLevel) {
        Utility.removeElementFrom(this.#internalLevelList, internalLevel);        
    }*/


    getLevel() {
        return this.#internalLevelList[this.#currentSelectedLevelIndex];
    }


    /*
    next() {
        isEndOfRotationReached = this.#currentSelectedLevelIndex === this.#internalLevelList.length - 1;

        if (!isEndOfRotationReached) {
            this.#currentSelectedLevelIndex++;
        }
    }


    previous() {
        isIndexDecrementable = this.#currentSelectedLevelIndex > 0;

        if (isIndexDecrementable) {
            this.#currentSelectedLevelIndex--;
        }
    }*/


    /*
    selectLevelAt(index) {
        const isValidIndex = (0 <= index) && (index < this.#internalLevelList.length);

        if (isValidIndex) {
            this.#currentSelectedLevelIndex = index;
        } else {
            throw new RangeError('Invalid index');
        }
    }*/


    buildLevelRotationJSONString() {
        const rotation = this.#internalLevelList.map(internalLevel => internalLevel.buildLevelJSON());
        const json = {rotation, initialPacmanLifes: this.#initialLifeNumber};
        return JSON.stringify(json);
    }


}