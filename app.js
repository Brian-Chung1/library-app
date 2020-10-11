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

    static removeBook(id) {
        const library = Storage.getLib();
        library.forEach((book, index) => {
            if(book.id === id) {
                library.splice(index, 1);
            }
        });
        localStorage.setItem("library", JSON.stringify(library));
    }
}


const library = Storage.getLib();

function addBookToLibrary(newBook) {
    library.push(newBook);
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
        showAlert("Removed Book ❌");
    }) 

    editElement.addEventListener("click", () => {
        //the input boxes in the modal form are filled with current book information
        openCurrentModal();
        title.value = bookTitleElement.textContent;
        author.value = bookAuthorElement.textContent.slice(3);
        pages.value = bookPageElement.textContent.slice(12);
        if(bookReadStatusElement == "") selectButton.textContent = "Select";
        else selectButton.textContent = bookReadStatusElement.textContent;
        currentBookElement = BookElement;
    }) 

}

function updateBook(currentBookElement) {
    currentBookElement.children[0].children[0].textContent = title.value;
    currentBookElement.children[0].children[1].textContent = formatAuthor(author.value);
    currentBookElement.children[0].children[2].textContent = formatPages(pages.value);
    currentBookElement.children[0].children[3].textContent = selectButton.textContent;


}

saveButton.addEventListener("click", () => {
    
    if(title.value == "") {
        alert("Please enter a book title");
    } else if(currentBookElement !== null) {
        updateBook(currentBookElement);
        closeCurrentModal();
        showAlert("Updated book 🔄");
    } else {
        let readingStatus;
        if(selectButton.textContent == "Select") readingStatus = "";
        else readingStatus = selectButton.textContent;
        let newBook = new Book(title.value, author.value, pages.value, readingStatus);
        addBookToLibrary(newBook);
        createBookElement(newBook);
        closeCurrentModal();
        showAlert("Added book ✅");
        
    }
    
})



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
    currentBookElement = null;
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

function openCurrentModal() {
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        openModal(modal);
    });
}

function resetForm() {
    title.value = "";
    author.value = "";
    pages.value = "";
    selectButton.textContent = "Select";
}

function showAlert(message) {
    const alertMsg = document.createElement('div');
    alertMsg.className = `alert`;
    alertMsg.appendChild(document.createTextNode(message));
    const container = document.querySelector('body');
    const title = document.querySelector('#title');
    title.insertAdjacentElement('afterend', alertMsg);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }


