const booksList = [];
let filteredBookList = [];
const RENDER_EVENT = 'render-books';

document.addEventListener('DOMContentLoaded', function () {
    const submitBookForm = document.getElementById('inputBook');
    submitBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookshelfList');
    completedBookList.innerHTML = '';

    for (const bookItem of booksList) {
        const bookElement = makeBookContainer(bookItem);
        if (!bookItem.isComplete) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }

    const filteredBookshelf = document.getElementById('filterBookshelfList');
    filteredBookshelf.innerHTML = '';
    
    for (const bookItem of filteredBookList) {
        const bookElement = makeFilteredBookContainer(bookItem);
        filteredBookshelf.append(bookElement);
    }
})

function generateId() {
    return +new Date();
}

function generateBookObj (id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObj = generateBookObj(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
    booksList.push(bookObj);

    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
    alert("Buku berhasil dimasukkan ke rak buku.");

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function makeBookContainer(bookObj) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObj.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis: ' + bookObj.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun: ' + bookObj.year;

    const bookCont = document.createElement('article');
    bookCont.classList.add('book_item');
    bookCont.append(bookTitle, bookAuthor, bookYear);

    // Untuk bagian tag
    const buttonCont = document.createElement('div');
    buttonCont.classList.add('action');

    const blueButton = document.createElement('button');
    blueButton.classList.add('blue');
    blueButton.innerText = 'Edit judul';
    blueButton.addEventListener('click', function() {
        let newTitle = prompt(`Edit Judul Buku`, bookObj.title);
    })

    const greenButton = document.createElement('button');
    greenButton.classList.add('green');
    if (bookObj.isComplete) {
        greenButton.innerText = 'Belum selesai dibaca';
        greenButton.addEventListener('click', function() {
            removeFromCompleted(bookObj.id);
        })
    } else {
        greenButton.innerText = 'Selesai dibaca';
        greenButton.addEventListener('click', function() {
            addToCompleted(bookObj.id);
        })
    }

    const redButton = document.createElement('button');
    redButton.classList.add('red');
    redButton.innerText = 'Hapus buku';
    redButton.addEventListener('click', function() {
        confirm(`Apakah Anda yakin mau menghapus buku ${bookObj.title}?`) && removeBook(bookObj.id);
    })

    buttonCont.append(blueButton, greenButton, redButton);
    bookCont.append(buttonCont);
    return bookCont;
}

function makeFilteredBookContainer(bookObj) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObj.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis: ' + bookObj.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun: ' + bookObj.year;

    const bookCont = document.createElement('article');
    bookCont.classList.add('book_item');
    bookCont.append(bookTitle, bookAuthor, bookYear);

    return bookCont;
}

// FUNCTIONS FOR BUTTONS
function findBook(bookId) {
    const bookFound = booksList.filter(book => book.id === bookId);
    if (bookFound.length !== 0) {
        return bookFound[0];
    } 
    return null;
}

function findBookIdx(bookId) {
    for (const index in booksList) {
        if (booksList[index].id === bookId) {
          return index;
        }
    }
    
    return -1;
}

function addToCompleted(bookId) {
    const bookToAlter = findBook(bookId);
    if (bookToAlter == null) return;

    bookToAlter.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeFromCompleted(bookId) {
    const bookToAlter = findBook(bookId);
    if (bookToAlter == null) return;

    bookToAlter.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIdx(bookId);
    if (bookTarget === -1) return;
    
    booksList.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// FOR STORAGE
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKSHELF_APPS';
 
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Maaf, peramban web Anda tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(booksList);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
        for (const book of data) {
            booksList.push(book);
        }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// BUTTON SHOULD MATCH CHECKBOX
const checkBox = document.getElementById('inputBookIsComplete');
const selesaiDibacaBtn = document.getElementById('button-span');
checkBox.addEventListener('click', function() {
    if (checkBox.checked) {
        selesaiDibacaBtn.innerText = 'Selesai dibaca'
    } else {
        selesaiDibacaBtn.innerText = 'Belum selesai dibaca'
    }
})

// FILTER FEATURE
const searchButton = document.getElementById('searchSubmit');
searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    const searchText = document.getElementById('searchBookTitle').value.toString();
    filteredBookList = booksList.filter(book => book.title.toLowerCase().includes(searchText.toLowerCase()));
    console.log(filteredBookList);
    document.dispatchEvent(new Event(RENDER_EVENT));
})