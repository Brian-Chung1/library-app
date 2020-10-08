const booklist = document.querySelector(".book-list");
const addbookButton = document.querySelector("#addbook");
const saveButton = document.querySelector(".save");
const editButton = document.querySelector(".edit");
const trashButton = document.querySelector(".trash");
let readBoolean = false;
const library = [];


//modal input-------------------------------------------------
const title = document.querySelector("input[name='title']");
const author = document.querySelector("input[name='author']");
const pages = document.querySelector("input[name='pages']");
const yesButton = document.querySelector("#yes");
const noButton = document.querySelector("#no");
const selectButton = document.querySelector("#select");
//------------------------------------------------------------

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.info = function() {
            return `${this.title} by ${this.author}, ${pages} pages, ${this.read ? "Finished Book" : "Have not Finished Yet"}`;
        }
    }


}

yesButton.addEventListener("click", () => {
    readBoolean = true;
    selectButton.textContent = "Yes";
})

noButton.addEventListener("click", () => {
    readBoolean = false;
    selectButton.textContent = "No";
})

function newBook(title, author, pages, read) {
    let b = new Book(title, author, pages, read);
    library.push(b);
}

function createBookElement(title, author, pages, read) {
    
    //Example Book Element
    // <article class="book">
    //     <header class="card-header">
    //         <h1 class="book-title">Example Book</h1>
    //         <h2>By Author</h2>
    //         <h4>Page Count: </h4>
    //         <h4>Finished Reading </h4>
    //     </header>
    // </article>
    
    //Book DOM Elements
    const newBookElement = document.createElement("article");
    const bookContent = document.createElement("header");
    const bookTitleElement = document.createElement("p");
    const bookAuthorElement = document.createElement("h2");
    const bookPageElement = document.createElement("h4");
    const bookFinishedElement = document.createElement("h4");
    const editElement = document.createElement("img");
    const trashElement = document.createElement("img");
    editElement.src = "images/edit-regular.png";
    trashElement.src = "images/trash-alt-solid.png";

    //Book text content
    bookTitleElement.textContent = title;
    if(author !== "") {
        bookAuthorElement.textContent = `By ${author}`;
    }
    if(pages !== "") {
        bookPageElement.textContent = `${pages} Pages`;
    }
    let readString;
    if(read) {
        readString = "Finished Reading"
    } else {
        readString = "Have Not Finished Reading"
    }
    bookFinishedElement.textContent = readString;

    //Book styles
    bookContent.classList.add("card-header");
    newBookElement.classList.add("book");
    bookTitleElement.classList.add("book-title");
    trashElement.classList.add("trash");
    editElement.classList.add("edit");

    //Appending Book DOM nodes
    bookContent.appendChild(bookTitleElement);
    bookContent.appendChild(bookAuthorElement);
    bookContent.appendChild(bookPageElement);
    bookContent.appendChild(bookFinishedElement);
    bookContent.appendChild(trashElement);
    bookContent.appendChild(editElement);
    newBookElement.appendChild(bookContent);
    booklist.insertBefore(newBookElement, addbookButton);



}

saveButton.addEventListener("click", () => {
    if(title.value == "") {
        alert("Please enter a book title");
    } else {
        createBookElement(title.value, author.value, pages.value, readBoolean);
    } 
    
})

function reset() {
    title.value = "";
    author.value = "";
    pages.value = "";
    readBoolean = false;
    selectButton.textContent = "Select";
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
    reset();
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



