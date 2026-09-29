let keyMatrix = [];


/* CREATE MATRIX */

function createMatrix(keyword) {

    keyword = keyword
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .replace(/J/g, "I");

    let letters = "";

    for (let char of keyword) {
        if (!letters.includes(char)) {
            letters += char;
        }
    }

    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

    for (let char of alphabet) {
        if (!letters.includes(char)) {
            letters += char;
        }
    }

    let matrix = [];

    for (let i = 0; i < 5; i++) {
        matrix.push(
            letters.slice(i * 5, i * 5 + 5)
        );
    }

    return matrix;
}


/* SHOW MATRIX */

function generateMatrix() {

    const keyword =
        document.getElementById("keyword").value;

    const matrixElement =
        document.getElementById("matrix");

    if (!keyword.trim()) {

        matrixElement.innerHTML =
            "<span>Enter a keyword</span>";

        keyMatrix = [];

        return;
    }

    keyMatrix = createMatrix(keyword);

    matrixElement.innerHTML = "";

    for (let row of keyMatrix) {

        for (let letter of row) {

            const cell =
                document.createElement("div");

            cell.className = "matrix-cell";

            cell.textContent = letter;

            matrixElement.appendChild(cell);
        }
    }
}


/* FIND LETTER POSITION */

function findPosition(letter) {

    if (letter === "J") {
        letter = "I";
    }

    for (let row = 0; row < 5; row++) {

        for (let col = 0; col < 5; col++) {

            if (keyMatrix[row][col] === letter) {

                return {
                    row: row,
                    col: col
                };
            }
        }
    }

    return null;
}


/* PREPARE PLAINTEXT */

function prepareText(text) {

    text = text
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .replace(/J/g, "I");

    let pairs = [];

    let i = 0;

    while (i < text.length) {

        let first = text[i];
        let second = text[i + 1];

        if (!second) {

            pairs.push(first + "X");

            i++;

        } else if (first === second) {

            pairs.push(first + "X");

            i++;

        } else {

            pairs.push(first + second);

            i += 2;
        }
    }

    return pairs;
}


/* ENCRYPT PAIR */

function encryptPair(a, b) {

    const p1 = findPosition(a);
    const p2 = findPosition(b);

    /* Same row */

    if (p1.row === p2.row) {

        return (
            keyMatrix[p1.row][(p1.col + 1) % 5] +
            keyMatrix[p2.row][(p2.col + 1) % 5]
        );
    }

    /* Same column */

    if (p1.col === p2.col) {

        return (
            keyMatrix[(p1.row + 1) % 5][p1.col] +
            keyMatrix[(p2.row + 1) % 5][p2.col]
        );
    }

    /* Rectangle */

    return (
        keyMatrix[p1.row][p2.col] +
        keyMatrix[p2.row][p1.col]
    );
}


/* DECRYPT PAIR */

function decryptPair(a, b) {

    const p1 = findPosition(a);
    const p2 = findPosition(b);

    /* Same row */

    if (p1.row === p2.row) {

        return (
            keyMatrix[p1.row][(p1.col + 4) % 5] +
            keyMatrix[p2.row][(p2.col + 4) % 5]
        );
    }

    /* Same column */

    if (p1.col === p2.col) {

        return (
            keyMatrix[(p1.row + 4) % 5][p1.col] +
            keyMatrix[(p2.row + 4) % 5][p2.col]
        );
    }

    /* Rectangle */

    return (
        keyMatrix[p1.row][p2.col] +
        keyMatrix[p2.row][p1.col]
    );
}


/* ENCRYPT */

function encryptText() {

    const keyword =
        document.getElementById("keyword").value;

    const text =
        document.getElementById("inputText").value;

    const result =
        document.getElementById("result");

    if (!keyword.trim()) {

        showMessage("Enter a keyword.");

        return;
    }

    if (!text.trim()) {

        showMessage("Enter text.");

        return;
    }

    keyMatrix = createMatrix(keyword);

    const pairs = prepareText(text);

    let encrypted = "";

    for (let pair of pairs) {

        encrypted +=
            encryptPair(pair[0], pair[1]);
    }

    result.value = encrypted;

    showMessage(
        "Encryption successful.",
        true
    );
}


/* DECRYPT */

function decryptText() {

    const keyword =
        document.getElementById("keyword").value;

    const text =
        document.getElementById("inputText").value;

    const result =
        document.getElementById("result");

    if (!keyword.trim()) {

        showMessage("Enter a keyword.");

        return;
    }

    if (!text.trim()) {

        showMessage("Enter ciphertext.");

        return;
    }

    keyMatrix = createMatrix(keyword);

    const cleanText =
        text
            .toUpperCase()
            .replace(/[^A-Z]/g, "")
            .replace(/J/g, "I");

    if (cleanText.length % 2 !== 0) {

        showMessage(
            "Ciphertext must contain an even number of letters."
        );

        return;
    }

    let decrypted = "";

    for (let i = 0; i < cleanText.length; i += 2) {

        decrypted +=
            decryptPair(
                cleanText[i],
                cleanText[i + 1]
            );
    }

    result.value = decrypted;

    showMessage(
        "Decryption successful.",
        true
    );
}


/* MESSAGE */

function showMessage(message, success = false) {

    const messageBox =
        document.getElementById("message");

    messageBox.textContent = message;

    messageBox.style.color =
        success ? "#16803c" : "#c62828";
}


/* CLEAR */

function clearAll() {

    document.getElementById("keyword").value = "";

    document.getElementById("inputText").value = "";

    document.getElementById("result").value = "";

    document.getElementById("matrix").innerHTML =
        "<span>Enter a keyword</span>";

    document.getElementById("message").textContent = "";

    keyMatrix = [];
}