// Get templates
const signupTemplate = document.getElementById('signup_template');
const loginTemplate = document.getElementById('login_template');
const manageTemplate = document.getElementById('manage_template');
const welcomeTemplate = document.getElementById('welcome_template');

// Get nested templates
const clientsListTemp = document.getElementById('list_template');
const clientDetailsTemp = document.getElementById('details_template');

// Current template
let currentTemplate = welcomeTemplate;

// Swithc current template
const switchCurrentTemp = (template) => {
    currentTemplate.style.display = 'none';
    currentTemplate = template;
};

// Display templates
const display = (element, value) => {
    element.style.display = value;
};

// animation utils
const animationTime = (element, mode, time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(display(element, mode));
        }, time * 1000);
    });
};

// animations
const fade = async (element, mode, time) => {
    element.style.transition = `all ${time}s`;
    if (mode !== 'none') {
        await animationTime(element, mode, time);
        switchCurrentTemp(element);
        element.style.opacity = 0;
        setTimeout(() => {
            element.style.opacity = 1;
        }, time);
    } else {
        element.style.opacity = 0;
        await animationTime(element, mode, time);
    };
};

// Ways Button
const buttonToLogin = document.getElementById('btn_way-login');
const buttonToSignin = document.getElementById('btn_way-singup');
const btnToLoginNav = document.getElementById('btn_nav_way-login');
const btnToSigninNav = document.getElementById('btn_nav_way-singup');
const btnToLogoutNav = document.getElementById('btn_nav_way-logout');

// actions button ways
buttonToLogin.addEventListener('click', () => {
    fade(currentTemplate, 'none', 1);
    fade(loginTemplate, 'flex', 2);
});

buttonToSignin.addEventListener('click', () => {
    fade(currentTemplate, 'none', 1);
    fade(signupTemplate, 'flex', 2);
});

btnToLoginNav.addEventListener('click', () => {
    fade(currentTemplate, 'none', 1);
    fade(loginTemplate, 'flex', 2);
});

btnToSigninNav.addEventListener('click', () => {
    fade(currentTemplate, 'none', 1);
    fade(signupTemplate, 'flex', 2);
});

btnToLogoutNav.addEventListener('click', () => {
    localStorage.clear();
    fade(currentTemplate, 'none', 1);
    fade(welcomeTemplate, 'flex', 2);
    buttonIsSession(false);
});
// Buttons mod session
const buttonIsSession = (boolean) => {
    btnToLoginNav.style.display = boolean ? 'none' : 'block';
    btnToSigninNav.style.display = boolean ? 'none' : 'block';
    btnToLogoutNav.style.display = boolean ? 'block' : 'none';
};

// Clear fields
const allInputs = document.getElementsByTagName('input');

const clearAllFields = () => {
    for (let input of allInputs) {
        input.value = '';
    };
};

// api
const apiUrl = 'https://usersmanagement-api.herokuapp.com/api/v1';

// Request logic
const request = async (url, method, data, action, token) => {
    let catchData;

    await fetch(url, {
        method: method,
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token && `Bearer ${token}`
        },
        body: data && JSON.stringify(data())
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                action && action();
            };
            console.log(data);
            catchData = data;
        });
    return catchData;
};

// Verify token
const verifyToken = async () => {
    const token = localStorage.getItem('token');

    if (token) {
        const result = await request(
            `${apiUrl}/users`,
            'get',
            null,
            null,
            localStorage.getItem('token')
        );

        if (result.status === 'success') {
            fade(currentTemplate, 'none', 1);
            fade(manageTemplate, 'grid', 2);
            buttonIsSession(true);
        };
    };
};

// SIGNUP ejecute
const signupPass = document.getElementById('signup_password');
const signupUsername = document.getElementById('signup_username');
const signupEmail = document.getElementById('signup_email');
const signupButton = document.getElementById('signup_button');

const signupData = () => {
    const data = {
        username: signupUsername.value,
        password: signupPass.value,
        email: signupEmail.value
    };
    return data;
};

const signupAction = () => {
    fade(signupTemplate, 'none', 2);
    fade(loginTemplate, 'flex', 2);
    clearAllFields();
};

signupButton.addEventListener('click', () => {
    request(`${apiUrl}/users/signup`, 'post', signupData, signupAction);
});

// LOGIN ejecute
const loginPass = document.getElementById('login_password');
const loginEmail = document.getElementById('login_email');
const loginButton = document.getElementById('login_button');

const loginData = () => {
    const data = {
        password: loginPass.value,
        email: loginEmail.value
    };
    return data;
};

const loginActions = () => {
    fade(loginTemplate, 'none', 2);
    fade(manageTemplate, 'grid', 2);
    buttonIsSession(true);
    clearAllFields();
};

loginButton.addEventListener('click', async () => {
    const token = await request(`${apiUrl}/users/login`, 'post', loginData, loginActions);
    localStorage.setItem('token', token.token);
});

// CLIENTS list Ejecute
const getClientsData = () => {
    userId
};

const getClients = async () => {
    const token = localStorage.getItem('token');

    const response = await request(`${apiUrl}/clients`, 'get', null, null, token);

    console.log(response);
};

getClients()



// ------------------------------------------------------------------

display(currentTemplate, 'flex');

verifyToken();