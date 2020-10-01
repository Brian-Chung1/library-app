const display = document.querySelector("display");
const addbook = document.querySelector("#addbook");
const save = document.querySelector(".save");
const library = [];

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

    newBook(title, author, pages, read) {
        let b = new Book(title, author, pages, read);
        library.push(b);
    }

    createBookElement() {
        
    }


}

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

