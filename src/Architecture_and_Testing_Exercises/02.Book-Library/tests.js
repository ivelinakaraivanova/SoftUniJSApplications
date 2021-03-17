const { chromium } = require('playwright-chromium');
const { expect, assert } = require('chai');

const host = 'http://localhost:3000';

const mockData = require('./mock-data.json');
console.log(json(mockData));
const endpoints = {
    load: '/jsonstore/collections/books',
    create: '/jsonstore/collections/books',
    edit: '/jsonstore/collections/books/',
    delete: '/jsonstore/collections/books/'
};


function json(data) {
    return {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
}

let browser;
// let context;
let page;

describe('E2E tests', function () {
    this.timeout(600000);

    before(async () => {
        browser = await chromium.launch({ headless: false, slowMo: 500 });
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        // context = await browser.newContext();
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
        // await context.close();
    });

    describe('load books', () => {
        it('all the books are loaded and showed by clicking Load all books', async () => {
            await page.route('**' + endpoints.load, route => route.fulfill(json(mockData)));

            await page.goto(host);
            await page.click('#loadBooks');
            await page.waitForSelector('tbody>tr>td');

            const rows = await page.$$eval('tbody>tr>td', (td) => td.map(t => t.textContent.trim().split('\n')));

            assert.equal(rows.length, 6);
            assert.equal(rows[0], 'Harry Potter and the Philosopher\'s Stone');
            assert.equal(rows[1], 'J.K.Rowling');
            assert.equal(rows[3], 'C# Fundamentals');
            assert.equal(rows[4], 'Svetlin Nakov');

        });
    });

    describe('create books', () => {
        it('right request with the correct parameters is sent when adding a book', async () => {
            const endpoint = '**' + endpoints.create;
            const mock = {
                title: 'Fall of Giants',
                author: 'Ken Follett',
            };
            page.route(endpoint, route => route.fulfill(json(mock)));

            await page.goto(host);

            await page.fill('[name="title"]', mock.title);
            await page.fill('[name="author"]', mock.author);


            const [response] = await Promise.all([
                page.waitForRequest(endpoint),
                page.click('#createForm>button')
            ]);

            const postData = JSON.parse(response.postData());

            assert.equal(postData.title, mock.title);
            assert.equal(postData.author, mock.author);
        });
    });

    describe('edit books', () => {
        it('the correct form is visible by clicking Edit', async () => {
            await page.goto(host);
            await page.click('#loadBooks');
            await page.click('.editBtn');

            const visible = await page.isVisible('#editForm');
            assert.isTrue(visible);
        });

        it('the correct values are in the input fields when Edit', async () => {
            
            const mock = {
                title: 'Harry Potter and the Goblet of Fire',
                author: 'J.K.Rowling',
            };
            
            page.route('**' + endpoints.edit + 'd953e5fb-a585-4d6b-92d3-ee90697398a0', route => route.fulfill(json(mock)));
            await page.goto(host);
            await page.click('#loadBooks');
            await page.waitForSelector('.editBtn');
            await page.click('.editBtn');
            
            const title = await page.$eval('#editForm >> [name="title"]', f => f.value);
            const author = await page.$eval('#editForm >> [name="author"]', f => f.value);
            
            assert.equal(title, mock.title);
            assert.equal(author, mock.author);
        });

        it.only('the right parameters should be sent by clicking Save', async () => {
            page.route('**' + endpoints.load, route => route.fulfill(json([mock])));
            const mock = {
                title: 'Harry Potter and the Philosopher\'s Stone',
                author: 'J.K.Rowling',
            };
            page.route('**' + endpoints.edit + 'd953e5fb-a585-4d6b-92d3-ee90697398a0', route => route.fulfill(json(mock)));
            await page.goto(host);
            await page.click('#loadBooks');
            await page.click('.editBtn');

            await page.fill('#editForm>[name="author"]', mock.author);
            await page.fill('#editForm>[name="title"]', mock.title);
            
            const [response] = await Promise.all([
                    page.waitForRequest('**' + endpoints.edit + 'd953e5fb-a585-4d6b-92d3-ee90697398a0'),
                    page.click('#editForm>button')
                ]);
 
            const postData = JSON.parse(response.postData());
            
            assert.equal(postData.title, mock.title);
            assert.equal(postData.author, mock.author);
        });
    });

    describe('delete books', () => {
        it('the right parameters should be sent by clicking Delete', async () => {
            
            const mock = {
                title: 'Harry Potter and the Philosopher\'s Stone',
                author: 'J.K.Rowling',
            };

            page.route('**' + endpoints.edit + 'd953e5fb-a585-4d6b-92d3-ee90697398a0', route => route.fulfill(json(mock)));
            
            await page.goto(host);
            await page.click('#loadBooks');
            await page.waitForSelector('.deleteBtn');

            page.on('dialog', dialog => dialog.accept());
            
            const [request] = await Promise.all([
                    page.waitForRequest('**' + endpoints.delete + 'd953e5fb-a585-4d6b-92d3-ee90697398a0'),
                    page.click('.deleteBtn')
                ]);
            
            assert.equal(request.method(), 'DELETE');
        });
    });
})