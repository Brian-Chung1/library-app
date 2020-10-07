const booklist = document.querySelector(".book-list");
const addbookButton = document.querySelector("#addbook");
const saveButton = document.querySelector(".save");
const library = [];


//modal input-------------------------------------------------
const title = document.querySelector("input[name='title']");
const author = document.querySelector("input[name='author']");
const pages = document.querySelector("input[name='pages']");
const yesButton = document.querySelector("#yes");
const noButton = document.querySelector("#no");
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

    //Book text content
    bookTitleElement.textContent = "Example Book";
    bookAuthorElement.textContent = "By Author";
    bookPageElement.textContent = "Page Count: 1000";
    bookFinishedElement.textContent = "Finished Reading";

    //Book styles
    bookContent.classList.add("card-header");
    newBookElement.classList.add("book");
    bookTitleElement.classList.add("book-title");

    //Appending Book DOM nodes
    bookContent.appendChild(bookTitleElement);
    bookContent.appendChild(bookAuthorElement);
    bookContent.appendChild(bookPageElement);
    bookContent.appendChild(bookFinishedElement);
    newBookElement.appendChild(bookContent);
    booklist.insertBefore(newBookElement, addbookButton);



}

saveButton.addEventListener("click", () => {
    createBookElement();
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



