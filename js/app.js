// Tasks:
// playNote as reusable function
// -. when note is played play sounds
// -. sound when loosing
// -. sound when correct seq
// Score
// BONUS:
// support mute 
// visual
// keep max score in localStorage
// levels

'use strict';
var NOTES;
var audioRight = new Audio('sound/right.mp3');
var audioWrong = new Audio('sound/wrong.mp3');

// This is my State:
var gState = {
    isUserTurn: false,
    seqNoteIndexes: [],
    currNoteIndexToClick: 0,
    score: 0,
    mute: false
}

function init() {
    NOTES = createNotesModel(4);
    console.log('NOTES[0].sound', NOTES[0].sound);
    renderNotes(NOTES);
    updateScore();
    computerTurn();
}

function createNotesModel(size) {
    var notes = [];

    for (var i = 0; i < size; i++) {
        var note = { sound: new Audio('sound/' + i + '.wav') };
        notes.push(note);
    }
    return notes;
}

function renderNotes(notes) {
    // mapping notes to html tags
    var strHtmls = notes.map(function (note, i) {
        var strHtml = '<div class="note note' + i + '" onclick="noteClicked(this)" data-note="' + i + '"' + '>' +
            '</div>';
        return strHtml;
    });

    var elPiano = document.querySelector('.piano');
    elPiano.innerHTML = strHtmls.join('');
}

function addRandomNote() {
    gState.seqNoteIndexes.push(getRandomIntInclusive(0, NOTES.length - 1));
}

function playSeq() {

    var elNotes = document.querySelectorAll('.note');

    gState.seqNoteIndexes.forEach(function (seqNoteIndex, i) {

        setTimeout(function playNote() {
            elNotes[seqNoteIndex].classList.add('playing');
            NOTES[seqNoteIndex].sound.currentTime = 0;

            if (gState.mute === false) {
                NOTES[seqNoteIndex].sound.play();
            }

            setTimeout(function donePlayingNote() {
                elNotes[seqNoteIndex].classList.remove('playing');
                NOTES[seqNoteIndex].sound.pause();

            }, 500);

            console.log('Playing: ', NOTES[seqNoteIndex].sound);
        },
            1000 * i);

    });

    setTimeout(function () {

        console.log('Done Playing Sequence!!');
        gState.isUserTurn = true;
    }, 1000 * gState.seqNoteIndexes.length);
}

function noteClicked(elNote) {

    if (!gState.isUserTurn) return;
    var noteIndex = +elNote.getAttribute('data-note');
    console.log('noteIndex is: ', noteIndex);

    // User clicked the right note
    if (noteIndex === gState.seqNoteIndexes[gState.currNoteIndexToClick]) {

        console.log('User OK!');
        playNote(elNote, NOTES, noteIndex);
        gState.score += 1;
        updateScore();
        gState.currNoteIndexToClick++;

        if (gState.currNoteIndexToClick === gState.seqNoteIndexes.length) {

            gState.score += gState.seqNoteIndexes.length;
            setTimeout(function () {
                audioRight.play();
                updateScore();
            }, 750);

            computerTurn();
        }
    } else {

        console.log('User Wrong!');
        var elPiano = document.querySelector('.piano');
        elPiano.style.display = 'none';
        audioWrong.play();
    }
    // console.log('elNote', elNote);
    console.log('Note', NOTES[noteIndex]);
}

function playNote(elNote, note, index) {

    elNote.classList.add('playing');
    NOTES[index].sound.currentTime = 0;

    if (gState.mute === false) {
        NOTES[index].sound.play();
    }

    setTimeout(function donePlayingNote() {
        elNote.classList.remove('playing');

    }, 500);
}

function computerTurn() {

    setTimeout(function () {
        gState.isUserTurn = false;
        gState.currNoteIndexToClick = 0;
        addRandomNote();
        playSeq();
    }, (gState.score === 0) ? 750 : 3000)
}

function updateScore() {

    var elSpanScore = document.querySelector('#spanScore');
    elSpanScore.innerText = gState.score;
}

function mute() {
    gState.mute = !gState.mute;
}

