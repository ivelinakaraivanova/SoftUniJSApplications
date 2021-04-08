import { render } from '../node_modules/lit-html/lit-html.js';
import * as api from './data.js';
import { layoutTemplate } from './main.js'

const onSubmit = {
    'add-form': onAddSubmit,
    'edit-form': onEditSubmit
}

const ctx = {
    list: [],
    async load() {
        ctx.list = await api.getAllBooks();
        update();
    },
    onEdit(id) {
        const book = ctx.list.find(b => b._id == id);
        update(book);
    },
    async onDelete(id) {
        const confirmed = confirm('Are you sure you want to delete this book?');
        if (confirmed) {
            api.deleteBook(id);
        }
    }
}

document.body.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit[e.target.id](formData, e.target);
})

start();

async function start() {
    update();
}

function update(bookToEdit) {
    const result = layoutTemplate(ctx, bookToEdit);
    render(result, document.body);
}

async function onAddSubmit(formData, form) {
    const book = {
        title: formData.get('title'),
        author: formData.get('author')
    }
    await api.createBook(book);
    form.reset();
}

async function onEditSubmit(formData, form) {
    const id = formData.get('_id');
    const book = {
        title: formData.get('title'),
        author: formData.get('author')
    }
    await api.updateBook(id, book);
    form.reset();
    update();
}
