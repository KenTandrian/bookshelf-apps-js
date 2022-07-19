const booksList = [];
let filteredBookList = [];
let isFiltering = false;
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

    for (const bookItem of (!isFiltering ? booksList : filteredBookList)) {
        const bookElement = makeBookContainer(bookItem);
        if (!bookItem.isComplete) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
})

function generateId() { return +new Date(); }

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
    
    Swal.fire({
        title: `New Book has been added successfully.`,
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
    })

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const makeBookContainer = (bookObj) => {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObj.title;

    // EDIT TITLE FEATURE
    const titleEditIcon = document.createElement('img');
    titleEditIcon.classList.add('edit_icon');
    titleEditIcon.setAttribute('src', './assets/Edit_icon.png');
    titleEditIcon.addEventListener('click', function() {
        Swal.fire({
            title: 'Edit Title',
            input: 'text',
            inputLabel: 'Title',
            inputValue: bookObj.title,
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return 'You need to write something!'
              }
            }
        }).then(result => {
            if (result.value) {
                let newTitle = result.value;
                if (newTitle !== null && newTitle !== bookObj.title) {
                    let bookIdx = findBookIdx(bookObj.id);
                    booksList[bookIdx].title = newTitle;
                    Swal.fire({
                        title: `Title is changed successfully!`,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'OK',
                    })

                    document.dispatchEvent(new Event(RENDER_EVENT));
                    saveData();
                }
            }
        })
    })
    bookTitle.append(titleEditIcon);

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Author: ' + bookObj.author;

    // EDIT AUTHOR FEATURE
    const authorEditIcon = document.createElement('img');
    authorEditIcon.classList.add('edit_icon');
    authorEditIcon.setAttribute('src', './assets/Edit_icon.png');
    authorEditIcon.addEventListener('click', function() {
        Swal.fire({
            title: 'Edit Author',
            input: 'text',
            inputLabel: 'Author',
            inputValue: bookObj.author,
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return 'You need to write something!'
              }
            }
        }).then(result => {
            if (result.value) {
                let newAuthor = result.value;
                if (newAuthor !== null && newAuthor !== bookObj.author) {
                    let bookIdx = findBookIdx(bookObj.id);
                    booksList[bookIdx].author = newAuthor;
                    Swal.fire({
                        title: `Author is changed successfully!`,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'OK',
                    })

                    document.dispatchEvent(new Event(RENDER_EVENT));
                    saveData();
                }
            }
        });
    })
    bookAuthor.append(authorEditIcon);

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Year: ' + bookObj.year;

    // EDIT AUTHOR FEATURE
    const yearEditIcon = document.createElement('img');
    yearEditIcon.classList.add('edit_icon');
    yearEditIcon.setAttribute('src', './assets/Edit_icon.png');
    yearEditIcon.addEventListener('click', function() {
        Swal.fire({
            title: 'Edit Year',
            input: 'text',
            inputLabel: 'Year',
            inputValue: bookObj.year,
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return 'You need to write something!'
              }
            }
        }).then(result => {
            if (result.value) {
                let newYear = result.value;
                if (newYear !== null && newYear !== bookObj.year && !isNaN(newYear)) {
                    let bookIdx = findBookIdx(bookObj.id);
                    booksList[bookIdx].year = newYear;

                    document.dispatchEvent(new Event(RENDER_EVENT));
                    saveData();
                    Swal.fire({
                        title: `Year is changed successfully!`,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'OK',
                    })
                } else if (isNaN(newYear)) {
                    Swal.fire({
                        title: `Year should be a number!`,
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'OK',
                    })
                }
            }
        });
    })
    bookYear.append(yearEditIcon);

    const bookCont = document.createElement('article');
    bookCont.classList.add('book_item');
    bookCont.append(bookTitle, bookAuthor, bookYear);

    // Untuk bagian tag
    const buttonCont = document.createElement('div');
    buttonCont.classList.add('action');

    const greenButton = document.createElement('button');
    greenButton.classList.add('green');

    if (bookObj.isComplete) {
        const greenButtonIcon = document.createElement('i');
        greenButtonIcon.classList.add('material-icons', 'btn-icon-size');
        greenButtonIcon.innerText = 'clear';
        greenButton.append(greenButtonIcon);
        const greenButtonText = document.createElement('p');
        greenButtonText.classList.add('btn-text');
        greenButtonText.innerText = 'Not Finished';
        greenButton.append(greenButtonText);
        greenButton.addEventListener('click', function() {
            removeFromCompleted(bookObj.id);
        })
    } else {
        const greenButtonIcon = document.createElement('i');
        greenButtonIcon.classList.add('material-icons', 'btn-icon-size');
        greenButtonIcon.innerText = 'check';
        greenButton.append(greenButtonIcon);
        const greenButtonText = document.createElement('p');
        greenButtonText.classList.add('btn-text');
        greenButtonText.innerText = 'Finished';
        greenButton.append(greenButtonText);
        greenButton.addEventListener('click', function() {
            addToCompleted(bookObj.id);
        })
    }

    const redButton = document.createElement('button');
    redButton.classList.add('red');
    const redButtonIcon = document.createElement('i');
    redButtonIcon.classList.add('material-icons', 'btn-icon-size');
    redButtonIcon.innerText = 'delete';
    redButton.append(redButtonIcon);
    const redButtonText = document.createElement('p');
    redButtonText.classList.add('btn-text');
    redButtonText.innerText = 'Delete';
    redButton.append(redButtonText);
    redButton.addEventListener('click', function() {
        Swal.fire({
            title: `Are you sure you want to delete ${bookObj.title}?`,
            text: 'Deletion is permanent and cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.value) {
                removeBook(bookObj.id);
            }
        })
    })

    buttonCont.append(greenButton, redButton);
    bookCont.append(buttonCont);
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
        Swal.fire({
            title: `Sorry, your browser does not support local storage.`,
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK',
        })
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
        selesaiDibacaBtn.innerText = 'Finished'
    } else {
        selesaiDibacaBtn.innerText = 'Not Finished'
    }
})

// FILTER FEATURE
const searchButton = document.getElementById('searchSubmit');
searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    const searchText = document.getElementById('searchBookTitle').value.toString().trim();
    if (searchText === ''){
        filteredBookList = booksList;
        isFiltering = false;
    } else {
        filteredBookList = booksList.filter(book => book.title.toLowerCase().includes(searchText.toLowerCase()));
        isFiltering = true;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
})