const { chromium } = require('playwright-chromium');
const { expect, assert } = require('chai');

let browser, page;

const host = 'http://localhost:3000';
 
describe('E2E tests', function () {
    this.timeout(60000);
 
    before(async () => {
        browser = await chromium.launch({ headless: false, slowMo: 500 });
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
 
    describe('Messenger', () => {
        it.only('all the messages are loaded and showed by clicking Refresh', async () => {
            await page.goto(host);
            await page.click('#refresh');
            const [messages] = await page.$$eval('#messages', (textarea) => textarea.map(t => t.value));
 
            assert.include(messages,'Spami: Hello, are you there?');
            assert.include(messages,'Garry: Yep, whats up :?');
            assert.include(messages,'Spami: How are you? Long time no see? :)');
            assert.include(messages,'George: Hello, guys! :))');
            assert.include(messages,'Spami: Hello, George nice to see you! :)))');
 
        });
 
        it('request is send by clicking the Send', async () => {
            const name = 'John';
            const message = 'Hello there'
            await page.goto(host);
 
            await page.fill('#author', name);
            await page.fill('#content', message);
 
            const [request] = await Promise.all([
                page.waitForRequest(request => request.url().includes('/jsonstore/messenger') 
                && request.method() === 'POST'),
                page.click('#submit')
             ]);
 
            const data = JSON.parse(request.postData());
            assert.equal(data.author,name);
            assert.equal(data.content, message);
        });
    })
});