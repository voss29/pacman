import IndexedDatabase from "../database/IndexedDatabase.mjs";
import SessionStorage from "../database/SessionStorage.mjs";


export default class CustomLevelSelection {


    #levelRotationItemContainer = null;
    #templateLevelRotationItem = null;
    #database = null;


    constructor() {
        this.#levelRotationItemContainer = document.getElementById('levelRotationItemContainer');
        this.#templateLevelRotationItem = document.getElementById('templateLevelRotationItem');
        this.#database = new IndexedDatabase();
    }


    async initialize() {
        try {
            await this.#database.openConnection();
            const levelRotationList = await this.#database.loadLevelRotationList();
            levelRotationList.forEach(levelRotation => this.addLevelRotationItemFor(levelRotation).bind(this));
        } catch (err) {
            document.getElementById('indexedDBWarning').classList.remove('invisible');
        }
    }


    addLevelRotationItemFor(levelRotationJson) {
        const levelRotationItem = this.#buildLevelRotationItem(levelRotationJson.name);
        this.#addLevelRotationName(levelRotationItem, levelRotationJson.name);
        this.#addPlayButtonEventListenerFor(levelRotationItem);
        this.#addEditButtonEventListenerFor(levelRotationItem);
        this.#addDeleteButtonEventListenerFor(levelRotationItem);
        this.#addLevelRotationItemToSelection(levelRotationItem);
    }


    #buildLevelRotationItem(levelName) {
        const deepCopy = true;
        const newItem = this.#templateLevelRotationItem.cloneNode(deepCopy);
        newItem.setAttribute('id', levelName);
        newItem.classList.remove('invisible');
        return newItem;
    }


    #addLevelRotationName(levelRotationItem, name) {
        const nameParagraph = levelRotationItem.children[0];
        nameParagraph.innerText = name;
    }


    #addPlayButtonEventListenerFor(levelRotationItem) {
        const playButton = levelRotationItem.children[1];

        playButton.addEventListener('click', async function(event) {
            const levelName = event.target.parentElement.id;
            const levelRotation = await this.#database.loadLevelRotation(levelName);
            SessionStorage.setLevelRotation(levelRotation);
            this.#loadPage('index.html');
        }.bind(this));
    }


    #addEditButtonEventListenerFor(levelRotationItem) {
        const editButton = levelRotationItem.children[2];

        editButton.addEventListener('click', async function(event) {
            const levelName = event.target.parentElement.id;
            const levelRotation = await this.#database.loadLevelRotation(levelName);
            SessionStorage.setLevelRotation(levelRotation);
            this.#loadPage('editor.html');
        }.bind(this));
    }


    #addDeleteButtonEventListenerFor(levelRotationItem) {
        const deleteButton = levelRotationItem.children[3];

        deleteButton.addEventListener('click', async function(event) {
            const levelRotationName = event.target.parentElement.id;
            await this.#database.deleteLevelRotation(levelRotationName);
        }.bind(this));
    }


    #addLevelRotationItemToSelection(levelRotationItem) {
        this.#levelRotationItemContainer.append(levelRotationItem);
    }


    #loadPage(pageName) {
        // workaround for github pages
        const url = location.href;
        location.href = url.replace('database.html', pageName);
    }


}