const { chromium } = require('playwright-chromium');
const { expect, assert } = require('chai');

let browser, page;

const host = 'http://localhost:3000';
 
describe('E2E tests', function () {
    this.timeout(1200000);
 
    before(async () => {
        browser = await chromium.launch({ headless: true, slowMo: 500 });
    });
 
    after(async () => {
        await browser.close();
    });
 
    beforeEach(async () => {
        page = await browser.newPage();
    });
 
    afterEach(async () => {
        await page.close();
    });
 
    describe('Book library', () => {

        it('all the books are loaded and showed by clicking Load all books', async () => {
            await page.goto(host);
            await page.click('#loadBooks');
                      
            const rows = await page.$$eval('tbody>tr>td', (td) => td.map(t => t.textContent.trim().split('\n')));
            
            assert.equal(rows.length,6);
            assert.equal(rows[0],'Harry Potter and the Philosopher\'s Stone');
            assert.equal(rows[1],'J.K.Rowling');
            assert.equal(rows[3],'C# Fundamentals');
            assert.equal(rows[4],'Svetlin Nakov');
             
        });
 
        it('no empty input fields are allowed by creating a new book', async () => {
            
            await page.goto(host);
 
            await page.fill('[name="author"]', '');
            await page.fill('[name="title"]', '');
            let isAlertShown = false;

            page.on('dialog', dialog => {
                isAlertShown = true;
                dialog.accept()});
            await page.click('#createForm>button');
            
            assert.equal(isAlertShown,true);
        });

        it('right request with the correct parameters is sent when adding a book', async () => {
            
            await page.goto(host);
 
            await page.fill('[name="author"]', 'Ken Follett');
            await page.fill('[name="title"]', 'Fall of Giants');
            
            
            const [response] = await Promise.all([
                page.waitForRequest('**/jsonstore/collections/books'),
                page.click('#createForm>button')
             ]);
 
            const postData = JSON.parse(response.postData());
          
            assert.equal(postData.title, 'Fall of Giants');
            assert.equal(postData.author, 'Ken Follett');
        });

        it('the correct form is visible by clicking Edit', async () => {
            
            await page.goto(host);
            await page.click('#loadBooks');
            await page.click('.editBtn');

            const visible = await page.isVisible('#editForm');
            assert.isTrue(visible);
        });

        it('the correct values are in the input fields when Edit', async () => {
            
            await page.goto(host);
            await page.click('#loadBooks');
            await page.waitForSelector('.editBtn');
            await page.click('.editBtn');
            
            const title = await page.$eval('#editForm', f => f.children[3].value);
            const author = await page.$eval('#editForm', f => f.children[5].value);
            
            assert.equal(title, 'Harry Potter and the Philosopher\'s Stone');
            assert.equal(author, 'J.K.Rowling');
        });

        it('the right parameters should be sent by clicking Save', async () => {
            
            await page.goto(host);
            await page.click('#loadBooks');
            await page.click('.editBtn');

            await page.fill('#editForm>[name="author"]', 'J.K.Rowling');
            await page.fill('#editForm>[name="title"]', 'Harry Potter and the Goblet of Fire');
            
            const [response] = await Promise.all([
                    page.waitForRequest('http://localhost:3030/jsonstore/collections/books/d953e5fb-a585-4d6b-92d3-ee90697398a0'),
                    page.click('#editForm>button')
                ]);
 
            const postData = JSON.parse(response.postData());
            
            assert.equal(postData.title, 'Harry Potter and the Goblet of Fire');
            assert.equal(postData.author, 'J.K.Rowling');
        });

        it('the right parameters should be sent by clicking Delete', async () => {
            
            await page.goto(host);
            await page.click('#loadBooks');
            await page.waitForSelector('.deleteBtn');

            page.on('dialog', dialog => dialog.accept());
            
            const [request] = await Promise.all([
                    page.waitForRequest('http://localhost:3030/jsonstore/collections/books/d953e5fb-a585-4d6b-92d3-ee90697398a0'),
                    page.click('.deleteBtn')
                ]);
            
            assert.equal(request.method(), 'DELETE');
        });
    })
});