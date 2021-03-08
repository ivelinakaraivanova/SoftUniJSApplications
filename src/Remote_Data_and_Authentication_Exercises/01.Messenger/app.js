function attachEvents() {
    const btnSend = document.getElementById('submit');
    const btnRefresh = document.getElementById('refresh');
    const inputAuthor = document.getElementById('author');
    const inputContent = document.getElementById('content');

    btnSend.addEventListener('click', async () => {
        const author = inputAuthor.value;
        const content = inputContent.value;

        await createMessage({ author, content });

        inputAuthor.value = '';
        inputContent.value = '';

        getMessages();
    })

    btnRefresh.addEventListener('click', getMessages);

    getMessages();
}

attachEvents();

async function getMessages() {
    const response = await fetch('http://localhost:3030/jsonstore/messenger');
    const messages = await response.json();

    document.querySelector('#messages').value = Object.values(messages)
        .map(v => `${v.author}: ${v.content}`)
        .join('\n');
}

async function createMessage(message) {
    const response = await fetch('http://localhost:3030/jsonstore/messenger', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
    });
}