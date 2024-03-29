function mainLogin() {
    
    const [formRegister, formLogin] = document.querySelectorAll('main form');
    
    formLogin.addEventListener('submit', onLoginSubmit);
    formRegister.addEventListener('submit', onRegisterSubmit);
}

mainLogin();

async function onLoginSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');

    event.target.reset();
    
    const response = await fetch('http://localhost:3030/users/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok == false) {
        const error = await response.json();
        return alert(error.message);
    }

    const data = await response.json();
    console.log(data)
    sessionStorage.setItem('userToken', data.accessToken);
    sessionStorage.setItem('userId', data._id);
    window.location.pathname = './index.html';
}

async function onRegisterSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const repass = formData.get('rePass');

    if (email == '' || password == '') {
        return alert('All fields are required!');
    } else if (password != repass) {
        return alert('Passwords don\'t match!')
    }

    const response = await fetch('http://localhost:3030/users/register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok == false) {
        const error = await response.json();
        return alert(error.message);
    }

    const data = await response.json();
    sessionStorage.setItem('userToken', data.accessToken);
    sessionStorage.setItem('userId', data._id);
    window.location.pathname = './index.html';
}