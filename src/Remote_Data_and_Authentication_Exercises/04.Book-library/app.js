function main() {

    document.getElementById('loadBooks').addEventListener('click', loadBooks);

    document.getElementById('createForm').addEventListener('submit', async (e) => {
        await onCreateSubmit(e);
        await loadBooks();
    });

    document.querySelector('table').addEventListener('click', btnTableClick);

    document.getElementById('editForm').addEventListener('submit', async (e) => {
        await onEditSubmit(e);
        await loadBooks();
    });
}

main()

async function loadBooks() {
    const tableBody = document.querySelector('tbody');

    if (tableBody.children.length > 0) {
        tableBody.innerHTML = ''
    };

    const books = await getBooks();
    
    Object.entries(books).map(([bId, b]) => {
        
        const trElement = e('tr', { id: bId },
            e('td', {}, b.title),
            e('td', {}, b.author),
            e('td', {},
                e('button', { className: 'editBtn' }, 'Edit'),
                e('button', { className: 'deleteBtn' }, 'Delete'))
        );
        tableBody.appendChild(trElement);
    })
}

async function onCreateSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const title = formData.get('title');
    const author = formData.get('author');

    if (title == '' || author == '') {
        return alert('All fields are required!');
    }

    await createBook({ title, author })

    event.target.reset();
}

function e(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
        } else {
            result[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    content.forEach(e => {
        if (typeof e == 'string' || typeof e == 'number') {
            const node = document.createTextNode(e);
            result.appendChild(node);
        } else {
            result.appendChild(e);
        }
    });

    return result;
}

async function request(url, options) {
    const response = await fetch(url, options);
    if (response.ok == false) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }
    const data = await response.json();
    return data;
}

async function getBooks() {
    const books = await request('http://localhost:3030/jsonstore/collections/books');
    return books;
}

async function getBookById(id) {
    const book = await request('http://localhost:3030/jsonstore/collections/books/' + id);
    return book;
}

async function createBook(bookData) {
    const book = await request('http://localhost:3030/jsonstore/collections/books', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    });
    return book;
}

async function updateBook(id, bookData) {
    const book = await request('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
    });
    return book;
}

async function deleteBook(id) {
    const book = await request('http://localhost:3030/jsonstore/collections/books/' + id, {
        method: 'delete',
    });
    return book;
}

async function btnTableClick(event) {
    const bookId = event.target.parentNode.parentNode.id;
    if (event.target.className === 'editBtn') {
        document.getElementById('createForm').style.display = 'none';
        document.getElementById('editForm').style.display = 'block';
        await loadBookForEditing(bookId);
    } else if (event.target.className === 'deleteBtn') {
        const confirmation = confirm('Are you sure you want to delete this book?');
        if (confirmation) {
            deleteBook(bookId);
            loadBooks();
        }
    }
}

async function loadBookForEditing(id) {
    const book = await getBookById(id);
    document.querySelector('#editForm [name="id"]').value = id;
    document.querySelector('#editForm [name="title"]').value = book.title;
    document.querySelector('#editForm [name="author"]').value = book.author;
}

async function onEditSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const title = formData.get('title');
    const author = formData.get('author');

    if (title == '' || author == '') {
        return alert('All fields are required!');
    }

    await updateBook(event.target.id.value, { title, author })

    document.getElementById('createForm').style.display = 'block';
    document.getElementById('editForm').style.display = 'none';

    event.target.reset();
}