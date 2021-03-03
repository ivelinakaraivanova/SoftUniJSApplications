async function asyncLoadRepos() {
	const username = document.getElementById('username').value;
	const url = `https://api.github.com/users/${username}/repos`;

	try {
		const response = await fetch(url);
		console.log(response);
		if (!response.ok) {
			throw new Error('Request error');
		}
		const data = await response.json();
		console.log('Promise fulfilled');
		console.log(data);

		const ulElement = document.getElementById('repos');
		ulElement.innerHTML = '';
		data.forEach(element => {
			const liElement = document.createElement('li');
			liElement.textContent = element.full_name;
			ulElement.appendChild(liElement);
		});
	} catch (error) {
		console.log('Promise rejected');
		console.log(error);
	}
}




function loadRepos() {
	const username = document.getElementById('username').value;
	const url = `https://api.github.com/users/${username}/repos`;

	fetch(url)
	.then(response => {
		if (!response.ok) {
			throw new Error('Request error');
		}
		console.log(response);
		return response.json()
	})
	.then(data => {
		console.log('Promise fulfilled');
		console.log(data);
/*
const ulElement = document.getElementById('repos');
ulElement.innerHTML = '';
data.forEach(element => {
	const liElement = document.createElement('li');
	liElement.textContent = element.full_name;
	ulElement.appendChild(liElement);
});
*/
	})
	.catch(error => {
		console.log('Promise rejected');
		console.log(error);
	})
}


	// const requestPromise = fetch(url);
	// console.log(requestPromise);

	// requestPromise.then(handleResponse);

	// function handleResponse(response) {
	// 	console.log(response);
	// 	const dataPromise = response.json();
	// 	dataPromise.then(handleData);
	// };

	// function handleData(data) {
	// 	console.log(data);
	// }
