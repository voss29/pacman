"use strict";


export default class EditorMapDimensionChangeState {

    
    constructor() {
        this.editor = null;
        this.input_map_width = null;
        this.input_map_height = null;
        this.callback_click = null;
        this.callback_mouseover = null;
        this.callback_mouseenter = null;
        this.callback_mouseleave = null;
    }


    setEditorTileClickCallback(callback) {
        this.callback_click = callback;
    }


    setEditorTileMouseOverCallback(callback) {
        this.callback_mouseover = callback;
    }


    setEditorTileMouseEnterCallback(callback) {
        this.callback_mouseenter = callback;
    }


    setEditorTileMouseLeaveCallback(callback) {
        this.callback_mouseleave = callback;
    }


    initialize(editor) {
        this.editor = editor;
        this.input_map_width = document.getElementById("map_width");
        this.input_map_height = document.getElementById("map_height");
        this.editor.resetSpawnScatterControlDisplayStatus();
        this.editor.resetInternalLevel(this.input_map_width.value, this.input_map_height.value);
        this.editor.clearMap();
        this.initializeEditingArea();
    }


    handleEditorContainerMouseDown(caller_id) {}


    handleEditorContainerMouseUp(caller_id) {}


    handleEditorContainerMouseLeave(caller_id) {}


    handleEditorTileClick(caller_id) {}


    handleEditorTileMouseOver(caller_id) {}


    handleEditorTileMouseEnter(caller_id) {}


    handleEditorTileMouseLeave(caller_id) {}


    exit() {}


    initializeEditingArea() {
        let width = this.editor.getMapWidthInput();
        let height = this.editor.getMapHeightInput();
        this.editor.setEditorContainerDimension(width, height);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let new_div = document.createElement('div');
                let new_id = `(${x},${y})`;
                new_div.setAttribute('id', new_id);
                new_div.setAttribute('title', new_id);
                new_div.setAttribute('class', 'editor_tile undefined_tile');
                new_div.addEventListener('mouseover', this.callback_mouseover);
                new_div.addEventListener('mouseenter', this.callback_mouseenter);
                new_div.addEventListener('mouseleave', this.callback_mouseleave);
                new_div.addEventListener('click', this.callback_click);
                this.editor.addEditorTile(new_div);
            }
        }
    }


}