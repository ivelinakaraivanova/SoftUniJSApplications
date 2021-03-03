async function loadCommits() {
    const username = document.getElementById('username').value;
    const repository = document.getElementById('repo').value;
    const url = `https://api.github.com/repos/${username}/${repository}/commits`;

    try {
        const response = await fetch(url);
        console.log(response);
        if (!response.ok) {
            const ulElement = document.getElementById('commits');
            const liElement = document.createElement('li');
            liElement.textContent = `Error: ${response.status} (${response.statusText})`;
            ulElement.appendChild(liElement);
        } else {
            const data = await response.json();
            console.log('Promise fulfilled');
            console.log(data);

            const ulElement = document.getElementById('commits');
            ulElement.innerHTML = '';
            data.forEach(element => {
                const liElement = document.createElement('li');
                liElement.textContent = `${element.commit.author.name}: ${element.commit.message}`;
                ulElement.appendChild(liElement);
            });
        }
    } catch (error) {
        console.log('Promise rejected');
        console.log(error);
    }
}