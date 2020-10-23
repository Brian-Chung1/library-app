
const booklist = document.querySelector(".book-list");
const addbookButton = document.querySelector("#addbook");
let currentBookElement = null;

//modal input
const title = document.querySelector("input[name='title']");
const author = document.querySelector("input[name='author']");
const pages = document.querySelector("input[name='pages']");
const selectButton = document.querySelector("#select");
const readstatusButtons = document.querySelectorAll(".dropdown > div");
const saveButton = document.querySelector(".save");
const dropdown = document.querySelector(".dropdown");


class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

class Storage {
    static getLib() {
        let library;
        if(localStorage.getItem("library") === null) {
            library = [];
        } else {
            library = JSON.parse(localStorage.getItem("library"));
        }
        return library;
    }

    static addBook(book) {
        const library = Storage.getLib();
        library.push(book);
        localStorage.setItem("library", JSON.stringify(library));
    }

    static removeBook(title) {
        const library = Storage.getLib();
        library.forEach((book, index) => {
            if(book.title === title) {
                library.splice(index, 1);
            }
        });
        localStorage.setItem("library", JSON.stringify(library));
    }

    static updateBook(oldTitle, newBook) {
        const library = Storage.getLib();
        library.forEach((book, index) => {
            if(book.title === oldTitle) {
                library.splice(index, 1, newBook);
            }
        });
        localStorage.setItem("library", JSON.stringify(library));
    }
}



function formatAuthor(author) {
    let formattedAuthor = "";
    if(author !== "") formattedAuthor = `By ${author}`;
    return formattedAuthor;
}

function formatPages(pages) {
    let formattedPages = "";
    if(pages !== "") formattedPages = `Page Count: ${pages}`;
    return formattedPages;
}

//When select button is pressed the dropdown is toggled on and off
//When dropdown is shown the savebutton has no z index so that it won't bleed through dropdown 
//It does the opposite when dropdown is hidden
selectButton.addEventListener("click", () => {
    readstatusButtons.forEach(button => button.classList.toggle("hidden"));
    saveButton.classList.toggle("zindex");
}) 

readstatusButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectButton.textContent = button.textContent;
        readstatusButtons[0].classList.add("hidden");
        readstatusButtons[1].classList.add("hidden");
        readstatusButtons[2].classList.add("hidden");
        saveButton.classList.add("zindex");
    })
})

function createBookElement(book) {
  
    //Book DOM Elements
    const BookElement = document.createElement("article");
    const bookContent = document.createElement("header");
    const bookTitleElement = document.createElement("h1");
    const bookAuthorElement = document.createElement("h2");
    const bookPageElement = document.createElement("h4");
    const bookReadStatusElement = document.createElement("h4");
    const editElement = document.createElement("img");
    const deleteElement = document.createElement("img");
    editElement.src = "images/edit-regular.png";
    deleteElement.src = "images/trash-alt-solid.png";

    //Book text contents
    bookTitleElement.textContent = book.title;
    bookAuthorElement.textContent = formatAuthor(book.author);
    bookPageElement.textContent = formatPages(book.pages);
    bookReadStatusElement.textContent = book.read;

    //Book classes & styles
    bookContent.classList.add("card-header");
    BookElement.classList.add("book");
    bookTitleElement.classList.add("book-title");
    deleteElement.classList.add("delete");
    editElement.classList.add("edit");

    //Appending Book DOM nodes to parent Node
    bookContent.appendChild(bookTitleElement);
    bookContent.appendChild(bookAuthorElement);
    bookContent.appendChild(bookPageElement);
    bookContent.appendChild(bookReadStatusElement);
    bookContent.appendChild(deleteElement);
    bookContent.appendChild(editElement);
    BookElement.appendChild(bookContent);
    booklist.insertBefore(BookElement, addbookButton);


    // Adding Delete and Edit Button EventListeners
    deleteElement.addEventListener("click", () => {
        booklist.removeChild(BookElement);
        Storage.removeBook(bookTitleElement.textContent);
        showAlert("Removed Book ❌");
    }) 

    editElement.addEventListener("click", () => {
        //the input boxes in the modal form are filled with current book information
        openEditModal();
        title.value = bookTitleElement.textContent;
        author.value = bookAuthorElement.textContent.slice(3);
        pages.value = bookPageElement.textContent.slice(12);
        if(bookReadStatusElement.textContent === "") selectButton.textContent = "Select";
        else selectButton.textContent = bookReadStatusElement.textContent;
        currentBookElement = BookElement;
    }) 

}

//update the book html element
function updateBookElement(currentBookElement, updatedBook) {
    currentBookElement.children[0].children[0].textContent = updatedBook.title;
    currentBookElement.children[0].children[1].textContent = formatAuthor(updatedBook.author);
    currentBookElement.children[0].children[2].textContent = formatPages(updatedBook.pages);
    currentBookElement.children[0].children[3].textContent = updatedBook.read;
}

//create the new updated book 
function getUpdatedBook() {
    let readstatus = selectButton.textContent;
    if(readstatus == "Select") readstatus = "";
    let updated = new Book(
        title.value,
        author.value,
        pages.value,
        readstatus
    );
    return updated;
}

saveButton.addEventListener("click", () => {
    
    if(title.value == "") {
        alert("Please enter a book title");
    } else if(currentBookElement !== null) { //editting a book
        let oldBookTitle = currentBookElement.children[0].children[0].textContent;
        let updatedBook = getUpdatedBook(); 
        updateBookElement(currentBookElement, updatedBook); 
        Storage.updateBook(oldBookTitle, updatedBook); 
        closeCurrentModal();
        showAlert("Updated book 🔄");
    } else { //adding a new book
        let readingStatus;
        if(selectButton.textContent == "Select") readingStatus = "";
        else readingStatus = selectButton.textContent;
        let newBook = new Book(title.value, author.value, pages.value, readingStatus);
        Storage.addBook(newBook);
        createBookElement(newBook);
        closeCurrentModal();
        showAlert("Added book ✅");
        
    }
    
})

function displayBooks() {
    const library = Storage.getLib();
    library.forEach(book => createBookElement(book));
}


//Modal 
const openModalButtons = document.querySelectorAll("[data-modal-target]"); 
const closeModalButtons = document.querySelectorAll("[data-modal-close]");
const overlay = document.getElementById("overlay");

function openModal(modal) {
    if(modal == null) return;
    modal.classList.add("active");
    overlay.classList.add("active");
}

function closeModal(modal) {
    if(modal == null) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
    resetForm();
}

openModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal);
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal");
        closeModal(modal);
    })
})

overlay.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active");
    modals.forEach(modal => {
        closeModal(modal);
    });
})

function closeCurrentModal() {
    const modals = document.querySelectorAll(".modal.active");
    modals.forEach(modal => {
        closeModal(modal);
    });
}

function openEditModal() {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        if(modal.id == "modal") {
            openModal(modal);
        } 
    });
}

function resetForm() {
    title.value = "";
    author.value = "";
    pages.value = "";
    document.querySelector("input[name='searchbar']").value = "";
    selectButton.textContent = "Select";
    clearResults();
    currentBookElement = null;
}

function showAlert(message) {
    const alertMsg = document.createElement('div');
    alertMsg.className = `alert`;
    alertMsg.appendChild(document.createTextNode(message));
    const container = document.querySelector('body');
    const title = document.querySelector('#title');
    title.insertAdjacentElement('afterend', alertMsg);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }




const searchBar = document.querySelector("input[name='searchbar']");
const searchButton = document.querySelector("#search-button");

searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    clearResults();
    const searchTerms = searchBar.value;
    if(searchTerms == "") return;
    processData(searchTerms);
});

async function fetchData(searchTerms) {
    try {
        let apikey = "AIzaSyDTjHJ2lawtrtUHAENuwQ6QSszXe7Di1Os"; 
        let url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&key=${apikey}&maxResults=15`
        let response = await fetch(url)
        let data = await response.json();
        if(!response.ok || data.items == undefined) { 
            displayError(response.status);
            throw err 
        }
        else return data;
    } catch(err) {
        return null;
    }
}

async function processData(searchTerms) {
    let data = await fetchData(searchTerms);
    if(data == null) return;
    for(let i = 0; i < data.items.length; i++) {
        if(data.items[i].volumeInfo.title.length > 110) continue;
        let author = (data.items[i].volumeInfo.authors == void(0) || typeof data.items[i].volumeInfo.authors == 'undefined') ? "Unknown" : data.items[i].volumeInfo.authors[0];
        let pages = (data.items[i].volumeInfo.pageCount == void(0) || typeof data.items[i].volumeInfo.pageCount == 'undefined') ? "" : data.items[i].volumeInfo.pageCount;
        createSearchResultElements(data.items[i].volumeInfo.title, author, pages);
    }
}

function displayError(status) {
    let container = document.querySelector(".search-result");
    let errorAlert = document.createElement("div");
    errorAlert.classList.add("error");
    errorAlert.textContent = `Error ${status}: Could not find results or Network Error`;
    container.appendChild(errorAlert);
}




function clearResults() {
    const parent = document.querySelector(".search-result");
    let child = parent.lastElementChild;
    while(child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}


function createSearchResultElements(title, author, pages) {

    const searchResultContainer = document.querySelector(".search-result");
    const bookElement = document.createElement("div");
    bookElement.classList.add("result-book");

    bookElement.innerHTML = `
        <label for="searchTitle">Title:</label>
        <div id="search-title">${title}</div>
        <label for="searchAuthor">Author: </label>
        <div id="search-author">${author}</div>
        <label for="searchPages">Pages: </label>
        <div id="search-pages">${pages}</div>
    `;

//  <button id="add-search">+ Add Book</button>
    //create add button and add event listener
    let addButton = document.createElement("button");
    addButton.classList.add("add-search");
    addButton.textContent = "+ Add Book";
    bookElement.appendChild(addButton);
    addButton.addEventListener("click", () => {
        const title = bookElement.children[1].textContent;
        const author = bookElement.children[3].textContent;
        const pages = bookElement.children[5].textContent;
        let b = new Book(title, author, pages, "");
        Storage.addBook(b);
        createBookElement(b);
        showAlert("Added book ✅");
    });

    searchResultContainer.appendChild(bookElement);

    
}

function displayInfo() {
    let info = document.querySelector("#info-modal");
    info.classList.add("active");
    overlay.classList.add("active");
    let infoButton = document.getElementById("info-button");
}



document.addEventListener('DOMContentLoaded', () => {
    displayBooks();
    displayInfo();
});