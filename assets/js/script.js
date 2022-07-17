document.addEventListener('DOMContentLoaded', function () {
    const books = [];

    // Custom event
    const RENDER_EVENT = 'render-book';
    const SAVED_EVENT = 'saved-book';

    // Key untuk local storage
    const STORAGE_KEY = 'BOOKSHELF_APP_BY_SUHAEFI';

    // Elemen-elemen HTML
    const submitForm = document.querySelector('#formAddBook');
    const titleBook = document.getElementById('bookTitle');
    const authorBook = document.getElementById('bookAuthor');
    const yearBook = document.getElementById('bookPublished');
    const isFinished = document.getElementById('isFinished');
    const showTitle = document.getElementById('newBookTitle');
    const showAuthor = document.getElementById('newBookAuthor');
    const showYear = document.getElementById('newBookYear');

    // Cek dukungan web storage pada browser
    function isStorageExist() {
        if (typeof (Storage) !== 'undefined') return true;
        alert('Browser yang Anda gunakan tidak mendukung web storage!');
        return false;
    }

    // Fungsi untuk generate random Id
    function generateId() {
        return + new Date();
    }

    // Fungsi untuk membuat objek baru
    function generateBookObject(id, title, author, year, isComplete) {
        return {
            id,
            title,
            author,
            year,
            isComplete
        }
    }

    // Menyimpan ke local storage
    function saveData() {
        if (isStorageExist()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    // Menambah buku
    function addBook() {
        const title = titleBook.value;
        const author = authorBook.value;
        const year = parseInt(yearBook.value);
        const finished = isFinished.checked;
        const id = generateId();
        const bookObject = generateBookObject(
            id,
            title,
            author,
            year,
            finished
        );
        books.push(bookObject);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    // Mencari buku berdasarkan id
    function findBook(bookId) {
        for (const bookItem of books) {
            if (bookItem.id === bookId) return bookItem;
        }
        return null;
    }

    // Mencari buku berdasarkan index pada books
    function findBookIndex(bookId) {
        for (const index in books) {
            if (books[index].id === bookId) return index;
        }
        return -1;
    }

    // Delete Message
    function showToast() {
        const toast = document.querySelector('#toast');
        toast.className = 'show';

        setTimeout(function () {
            toast.classList.remove('show');
        }, 3000);
    }


    // Fungsi untuk tombol delete = icon x
    function deleteBook(bookId) {
        const bookTarget = findBookIndex(bookId);

        if (bookTarget === -1) return;
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
        showToast();
    }

    // Fungsi untuk tombol ceklis
    function readBookFinished(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }


    // Fungsi untuk tombol undo
    function undoBookFromFinished(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;;

        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    // Membuat list buku di document html
    function makeBook(bookObject) {

        const iconWrapperList = document.createElement('div');
        iconWrapperList.classList.add('icon-wrapper-list-books');

        const titleAndAuthor = document.createElement('div');
        titleAndAuthor.className = 'title-and-author';

        const title = document.createElement('span');
        title.className = 'title';
        title.innerText = bookObject.title;

        const author = document.createElement('span');
        author.className = 'author';
        author.innerText = 'Penulis: ' + bookObject.author;

        titleAndAuthor.append(title, author);

        const list = document.createElement('li');
        list.setAttribute('id', `book-${bookObject.id}`);
        list.append(titleAndAuthor, iconWrapperList);

        // Icon x = delete
        const x = document.createElement('div');
        x.classList.add('icon-wrap', 'delete');

        const iconX = document.createElement('img');
        iconX.setAttribute('src', 'assets/img/icon/x.svg');
        iconX.classList.add('icon');

        x.appendChild(iconX);
        x.addEventListener('click', function () {
            deleteBook(bookObject.id);
        });

        if (bookObject.isComplete !== true) {
            // Icon ceklis
            const check = document.createElement('div');
            check.classList.add('icon-wrap', 'check');

            const iconCheck = document.createElement('img');
            iconCheck.setAttribute('src', 'assets/img/icon/check.svg');
            iconCheck.classList.add('icon');

            check.appendChild(iconCheck);
            check.addEventListener('click', function () {
                readBookFinished(bookObject.id);
            });
            iconWrapperList.append(check, x);
        } else {
            // Icon undo
            const undo = document.createElement('div');
            undo.classList.add('icon-wrap', 'undo');

            const iconUndo = document.createElement('img');
            iconUndo.setAttribute('src', 'assets/img/icon/rotate-ccw.svg');
            iconUndo.classList.add('icon');

            undo.appendChild(iconUndo);
            undo.addEventListener('click', function () {
                undoBookFromFinished(bookObject.id);
            });
            iconWrapperList.append(undo, x);
        }
        return list;
    }

    // Fungsi untuk memuat data dari local storage
    function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        const data = JSON.parse(serializedData);

        if (data !== null) {
            for (const book of data) {
                books.push(book);
            }
        }

        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    // Pencarian Buku
    function findTitleBook() {
        const textTitle = document.getElementById('searchBook').value;

        for (const bookItem of books) {
            if (bookItem.title === textTitle) return bookItem;
        }

        return null;
    }

    function updateBook(bookId) {
        bookObject = findBook(bookId);
        bookObject.title = showTitle.value;
        bookObject.author = showAuthor.value;
        bookObject.year = parseInt(showYear.value);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function showResult(bookId) {
        bookObject = findBook(bookId);

        showTitle.value = bookObject.title;
        showAuthor.value = bookObject.author;
        showYear.value = bookObject.year;

        const updateButton = document.querySelector('.btn.btn-update');
        const deleteButton = document.querySelector('.btn.btn-delete');

        updateButton.addEventListener('click', function (e) {
            e.preventDefault();
            updateBook(bookObject.id);
        });

        deleteButton.addEventListener('click', function (e) {
            e.preventDefault();
            deleteBook(bookObject.id);
        })
    }

    const searchForm = document.querySelector('.form-search-book');
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const bookObject = findTitleBook();

        if (bookObject !== null) return showResult(bookObject.id);
        return alert('Buku tidak ditemukan!');
    });

    // Saat klik tombol 'Tambahkan'
    submitForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Mencegah page reload

        if (titleBook.value === '' || authorBook.value === '' || yearBook.value === '') {
            return alert('Mohon isikan data bukunya!');
        }

        addBook();
    });

    // RENDER EVENT
    document.addEventListener(RENDER_EVENT, function () {
        const notFinishedBook = document.getElementById('notFinished');
        notFinishedBook.innerHTML = "";

        const finishedBook = document.getElementById('finished');
        finishedBook.innerHTML = "";

        for (const bookItem of books) {
            const bookElement = makeBook(bookItem);

            if (bookItem.isComplete !== true) {
                notFinishedBook.append(bookElement);
            } else {
                finishedBook.append(bookElement);
            }
        }

        titleBook.value = '';
        authorBook.value = '';
        yearBook.value = '';
        isFinished.checked = false;

    });

    // Memuat data dari local storage ke document html
    if (isStorageExist()) loadDataFromStorage();
});