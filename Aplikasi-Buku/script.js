// Mendapatkan elemen-elemen yang diperlukan dari DOM
const inputBookForm = document.getElementById("inputBook");
const inputBookTitle = document.getElementById("inputBookTitle");
const inputBookAuthor = document.getElementById("inputBookAuthor");
const inputBookYear = document.getElementById("inputBookYear");
const inputBookIsComplete = document.getElementById("inputBookIsComplete");
const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
const completeBookshelfList = document.getElementById("completeBookshelfList");

// Fungsi untuk membuat ID unik
function generateId() {
  return Math.floor(Math.random() * 1e9);
}

// Fungsi untuk membuat elemen buku
function createBookElement(book) {
  const article = document.createElement("article");
  article.classList.add("book_item");
  article.dataset.id = book.id;

  const h3 = document.createElement("h3");
  h3.textContent = book.title;

  const pAuthor = document.createElement("p");
  pAuthor.textContent = `Penulis: ${book.author}`;

  const pYear = document.createElement("p");
  pYear.textContent = `Tahun: ${book.year}`;

  const divAction = document.createElement("div");
  divAction.classList.add("action");

  const buttonToggle = document.createElement("button");
  buttonToggle.classList.add("green");
  if (book.isComplete) {
    buttonToggle.textContent = "Belum selesai di Baca";
  } else {
    buttonToggle.textContent = "Selesai dibaca";
  }
  const buttonEdit = document.createElement("button");
  buttonEdit.classList.add("blue");
  buttonEdit.textContent = "Edit buku";

  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add("red");
  buttonDelete.textContent = "Hapus buku";

  divAction.appendChild(buttonToggle);
  divAction.appendChild(buttonEdit);
  divAction.appendChild(buttonDelete);

  article.appendChild(h3);
  article.appendChild(pAuthor);
  article.appendChild(pYear);
  article.appendChild(divAction);

  return article;
}

// Fungsi untuk memperbarui rak buku
function updateBookshelf() {
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  const books = JSON.parse(localStorage.getItem("books")) || [];

  for (const book of books) {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookElement);
    } else {
      incompleteBookshelfList.appendChild(bookElement);
    }
  }
}

// Fungsi untuk menyimpan data buku pada localStorage
function saveBook(book) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));
}

// Fungsi untuk menghapus data buku dari localStorage berdasarkan ID
function deleteBook(id) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const updatedBooks = books.filter((book) => book.id !== id);
  localStorage.setItem("books", JSON.stringify(updatedBooks));
  updateBookshelf();
}

// Fungsi untuk memperbarui status buku (selesai dibaca/belum selesai dibaca) pada localStorage berdasarkan ID
function updateBookStatus(id) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const updatedBooks = books.map((book) => {
    if (book.id === id) {
      book.isComplete = !book.isComplete;
    }
    return book;
  });
  localStorage.setItem("books", JSON.stringify(updatedBooks));
  updateBookshelf();
}

// Event listener untuk menangani penambahan buku
inputBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = inputBookTitle.value;
  const author = inputBookAuthor.value;
  const year = parseInt(inputBookYear.value);
  const isComplete = inputBookIsComplete.checked;

  const book = {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };

  saveBook(book);
  inputBookTitle.value = "";
  inputBookAuthor.value = "";
  inputBookYear.value = "";
  inputBookIsComplete.checked = false;

  updateBookshelf();
});

// Fungsi untuk menghapus data buku dari localStorage berdasarkan ID
function deleteBook(id) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const book = books.find((book) => book.id === id);
  if (book) {
    swal({
      title: "Anda yakin?",
      text: `Buku dengan judul ${book.title} akan dihapus!`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const updatedBooks = books.filter((book) => book.id !== id);
        localStorage.setItem("books", JSON.stringify(updatedBooks));
        updateBookshelf();
        swal("Buku berhasil dihapus!", {
          icon: "success",
        });
      }
    });
  }
}

// Event listener untuk menangani penghapusan buku
incompleteBookshelfList.addEventListener("click", (event) => {
  if (event.target.classList.contains("red")) {
    const bookElement = event.target.closest(".book_item");
    const bookId = parseInt(bookElement.dataset.id);
    deleteBook(bookId);
  }
});

completeBookshelfList.addEventListener("click", (event) => {
  if (event.target.classList.contains("red")) {
    const bookElement = event.target.closest(".book_item");
    const bookId = parseInt(bookElement.dataset.id);
    deleteBook(bookId);
  }
});
// Event listener untuk menangani perubahan status buku
function updateBookStatusConfirmation(id, title, isComplete) {
  swal({
    title: "Anda yakin?",
    text: `Anda akan ${isComplete ? "menandai belum selesai dibaca" : "menandai sudah selesai dibaca"} buku dengan judul ${title}!`,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willUpdate) => {
    if (willUpdate) {
      updateBookStatus(id);
      swal("Status buku berhasil diperbarui!", {
        icon: "success",
      });
    }
  });
}
// Event listener untuk menangani penghapusan buku dan perubahan status buku
incompleteBookshelfList.addEventListener("click", (event) => {
  const target = event.target;
  const bookElement = target.closest(".book_item");
  const bookId = parseInt(bookElement.dataset.id);
  if (target.classList.contains("red")) {
    const bookTitle = bookElement.querySelector("h3").textContent;
    deleteBookConfirmation(bookId, bookTitle);
  } else if (target.classList.contains("green")) {
    const bookTitle = bookElement.querySelector("h3").textContent;
    const isComplete = target.textContent === "Belum selesai di Baca";
    updateBookStatusConfirmation(bookId, bookTitle, isComplete);
  }
});

completeBookshelfList.addEventListener("click", (event) => {
  const target = event.target;
  const bookElement = target.closest(".book_item");
  const bookId = parseInt(bookElement.dataset.id);
  if (target.classList.contains("red")) {
    const bookTitle = bookElement.querySelector("h3").textContent;
    deleteBookConfirmation(bookId, bookTitle);
  } else if (target.classList.contains("green")) {
    const bookTitle = bookElement.querySelector("h3").textContent;
    const isComplete = target.textContent === "Belum selesai di Baca";
    updateBookStatusConfirmation(bookId, bookTitle, isComplete);
  }
});
// Fungsi untuk mencari buku berdasarkan judul
function searchBookByTitle(title) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const searchResults = books.filter((book) => {
    return book.title.toLowerCase().includes(title.toLowerCase());
  });
  return searchResults;
}

// Fungsi untuk menampilkan hasil pencarian buku
function displaySearchResults(results) {
  const searchResultsContainer = document.getElementById("searchResults");
  searchResultsContainer.innerHTML = "";

  if (results.length === 0) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.textContent = "Tidak ada hasil pencarian.";
    searchResultsContainer.appendChild(noResultsMessage);
  } else {
    for (const book of results) {
      const bookElement = createBookElement(book);
      searchResultsContainer.appendChild(bookElement);
    }
  }
}

// Event listener untuk menangani pencarian buku
const searchBookForm = document.getElementById("searchBook");
const searchBookInput = document.getElementById("searchBookTitle");

searchBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchQuery = searchBookInput.value;
  const searchResults = searchBookByTitle(searchQuery);
  displaySearchResults(searchResults);

  searchBookInput.value = "";
});
// Fungsi untuk menyembunyikan form edit
function hideEditForm() {
  const form = document.getElementById("edit-form");
  form.style.display = "none";
}

// Event listener untuk menyembunyikan form edit saat halaman dimuat ulang
window.addEventListener("load", hideEditForm);
// Fungsi untuk style form edit
function showEditForm(id) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const book = books.find((book) => book.id === id);
  if (book) {
    const form = document.getElementById("edit-form");
    form.elements["title"].value = book.title;
    form.elements["author"].value = book.author;
    form.elements["year"].value = book.year;
    form.dataset.id = id;
    form.style.display = "block";
    form.style.position = "fixed";
    form.style.top = "50%";
    form.style.left = "50%";
    form.style.transform = "translate(-50%, -50%)";
    form.style.width = "80%";
    form.style.maxWidth = "600px";
    form.style.padding = "2rem";
    form.style.borderRadius = "10px";
    form.style.backgroundColor = "#fff";
    form.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.3)";
  }
}

// Fungsi untuk menutup form edit
function closeEditForm() {
  const form = document.getElementById("edit-form");
  form.style.display = "none";
}

// // Event listener untuk menampilkan form edit
incompleteBookshelfList.addEventListener("click", (event) => {
  if (event.target.classList.contains("blue")) {
    const bookElement = event.target.closest(".book_item");
    const bookId = parseInt(bookElement.dataset.id);
    showEditForm(bookId);
  }
});

completeBookshelfList.addEventListener("click", (event) => {
  if (event.target.classList.contains("blue")) {
    const bookElement = event.target.closest(".book_item");
    const bookId = parseInt(bookElement.dataset.id);
    showEditForm(bookId);
  }
});

// Event listener untuk menangani pengiriman form edit
const editForm = document.getElementById("edit-form");
editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const bookId = parseInt(editForm.dataset.id);
  const book = books.find((book) => book.id === bookId);
  if (book) {
    book.title = editForm.elements["title"].value;
    book.author = editForm.elements["author"].value;
    book.year = parseInt(editForm.elements["year"].value);
    localStorage.setItem("books", JSON.stringify(books));
    updateBookshelf();
    closeEditForm();
  }
});
// Memperbarui rak buku saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // When the page is ready, update the bookshelf
  updateBookshelf();
});
// ...
