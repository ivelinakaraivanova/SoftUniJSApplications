async function postData(data) {
    const response = await fetch('https://localhost3030/jsonstore/advanced/articles/details', {
        method: 'post',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data),
    })
}
const data = { title: 'First Post', content: 'Hello, Server!' };
