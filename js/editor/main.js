'use strict';

import Editor from './Editor.mjs';
import EditorTileManipulationState from './EditorTileManipulationState.mjs';
import EditorScatterSelectionState from './EditorScatterSelectionState.mjs';
import EditorMapDimensionChangeState from './EditorMapDimensionChangeState.mjs';
import EditorSpawnSelectionState from './EditorSpawnSelectionState.mjs';
import Configuration from '../Configuration.mjs';


let editor = new Editor();
buttonMapDimensionChangeCallback();
                                


// add handlers to level elements in selector bar
let radios = document.querySelectorAll('input[name="selectors"]');
for (let radio of radios) {
    radio.addEventListener('click', radioButtonTileSelectionCallback);
}


// add handlers to editor container (enable drawing level elements while keeping the mouse button pressed)
let editorContainer = document.getElementById('editor_container');
editorContainer.addEventListener('mousedown', editor.handleEditorContainerMouseDown.bind(editor));
editorContainer.addEventListener('mouseup', editor.handleEditorContainerMouseUp.bind(editor));
editorContainer.addEventListener('mouseleave', editor.handleEditorContainerMouseLeave.bind(editor));


// add handler to map dimension apply button
document.getElementById('map_width').addEventListener('blur', validateMapWidthInput);
document.getElementById('map_height').addEventListener('blur', validateMapHeightInput);
document.getElementById('button_map_sizer').addEventListener('click', buttonMapDimensionChangeCallback);


// add handlers to scatter spawn control group
let scatterSpawnInputs = document.querySelectorAll('input[class="inputPosition"]');
for (let scatterSpawnInput of scatterSpawnInputs) {
    scatterSpawnInput.addEventListener('mouseenter', inputScatterSpawnMouseEnterCallback);
    scatterSpawnInput.addEventListener('mouseleave', inputScatterSpawnMouseLeaveCallback);
}


// add handlers to scatter select buttons
let scatterButtons = document.querySelectorAll('button[name="button_scatter_position"]');
for (let scatterButton of scatterButtons) {
    scatterButton.addEventListener('click', buttonScatterSelectionCallback);
}


// add handlers to spawn select buttons
let spawnButtons = document.querySelectorAll('button[name="button_spawn_position"]');
for (let spawnButton of spawnButtons) {
    spawnButton.addEventListener('click', buttonSpawnSelectionCallback);
}


// add handler to play button
document.getElementById('play_level').addEventListener('click', buttonPlayCallback);


function radioButtonTileSelectionCallback(event) {
    editor.setState(new EditorTileManipulationState(event.target.id));
}


function validateMapWidthInput(event) {
    try {
        let input = document.getElementById(event.target.id);
        let inputNumber = parseInt(input.value);
        if ((inputNumber < Configuration.editorBoardMinWidth) ||
            (inputNumber > Configuration.editorBoardMaxWidth)) {
            input.value = '';
        }
    } catch(e) {
        input.value = '';
    }
}


function validateMapHeightInput(event) {
    try {
        let input = document.getElementById(event.target.id);
        let inputNumber = parseInt(input.value);
        if ((inputNumber < Configuration.editorBoardMinHeight) ||
            (inputNumber > Configuration.editorBoardMaxHeight)) {
            input.value = '';
        }
    } catch(e) {
        input.value = '';
    }
}


function inputScatterSpawnMouseEnterCallback(event) {
    let borderColor = Configuration.editorScatterSpawnSelectionPointerHighlightColorHex;
    let coordinateString = document.getElementById(event.target.id).value;
    if (coordinateString !== '') {
        document.getElementById(coordinateString).style.borderColor = borderColor;
        document.getElementById(coordinateString).style.borderWidth = '5px';
    }
}


function inputScatterSpawnMouseLeaveCallback(event) {
    let coordinateString = document.getElementById(event.target.id).value;
    if (coordinateString !== '') {
        document.getElementById(coordinateString).style = null;
    }
}


function buttonMapDimensionChangeCallback() {
    const isMapHeightSet = document.getElementById('map_height').value !== '';
    const isMapWidthSet = document.getElementById('map_width').value !== '';
    if (isMapHeightSet && isMapWidthSet) {
        editor.setState(new EditorMapDimensionChangeState());
    }
}


function buttonScatterSelectionCallback(event) {
    editor.setState(new EditorScatterSelectionState(event.target.id));
}


function buttonSpawnSelectionCallback(event) {
    editor.setState(new EditorSpawnSelectionState(event.target.id));
}


function buttonPlayCallback() {
    editor.sendLevelJson();
    loadIndexPage();
}


// workaround to make loading of index.html on github pages possible
function loadIndexPage() {
    let url = location.href;
    location.href = url.replace(Configuration.fileNameEditor, Configuration.fileNameIndex);
}