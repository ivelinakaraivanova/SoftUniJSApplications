function main() {
    
    window.addEventListener('load', async () => await loadSudents());

    document.getElementById('form').addEventListener('submit', async (e) => {
        await onCreateSubmit(e);
        await loadSudents();
    });
}

main();

async function getStudents() {
    const response = await fetch('http://localhost:3030/jsonstore/collections/students');
    const students = await response.json();

    return students;
}

async function onCreateSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const facultyNumber = formData.get('facultyNumber');
    const grade = formData.get('grade');


    if (firstName == '' || lastName == '' || facultyNumber == '' || grade == '') {
        return alert('All fields are required!');
    } else if (!/^\d+$/.test(facultyNumber)) {
        return alert('Faculty number must be string of numbers!');
    } else if (Number.isNaN(Number(grade))) {
        return alert('Grade must be number!');
    }

    const response = await fetch('http://localhost:3030/jsonstore/collections/students', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, facultyNumber, grade })
    });

    if (response.ok == false) {
        const error = await response.json();
        return alert(error.message);
    }

    event.target.reset();
}

async function loadSudents() {
    const tableBody = document.getElementById('results').children[1];

    if (tableBody.children.length > 0) {
        tableBody.innerHTML = ''
    };

    const students = await getStudents();

    Object.values(students).map(s => {
        const trElement = document.createElement('tr');
        Object.values(s).map(f => {
            const td = document.createElement('td');
            td.textContent = typeof f == 'number' ? f.toFixed(2) : f;
            trElement.appendChild(td);

        })
        trElement.removeChild(trElement.lastChild);

        tableBody.appendChild(trElement);
    })
}