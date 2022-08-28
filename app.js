// Get templates
const signupTemplate = document.getElementById('signup_template');
const loginTemplate = document.getElementById('login_template');
const manageTemplate = document.getElementById('manage_template');
const welcomeTemplate = document.getElementById('welcome_template');
const addClientsTemp = document.getElementById('add_clients');
const editClientsTemp = document.getElementById('edit_clients');
// Get nested templates
const clientsListTemp = document.getElementById('list_template');
const clientDetailsTemp = document.getElementById('details_template');
const detailButtonTemp = document.getElementById('detail_buttons');

// Api
const apiUrl = 'https://usersmanagement-api.herokuapp.com/api/v1';
/* const apiUrl = 'http://clientmanagementapi-env.eba-e2jtfavx.us-east-1.elasticbeanstalk.com/api/v1'; */

// Request logic
const request = async (url, method, data, action, token) => {
    let catchData;

    console.log(token, '--- from request');

    await fetch(url, {
        method: method,
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token && `Bearer ${token}`,
            "Access-Control-Allow-Methods": 'patch'
        },
        body: data && JSON.stringify(data())
    })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                action && action(data);
            };
            catchData = data;
        });
    return catchData;
};

// Current template - use to determine which template is current
let currentTemplate = welcomeTemplate;

// Swithc current template
const switchCurrentTemp = (template) => {
    currentTemplate.style.display = 'none';
    currentTemplate = template;
};

// Clear fields
const allInputs = document.getElementsByTagName('input');

const clearAllFields = () => {
    for (let input of allInputs) {
        input.value = '';
    };
};

// Get token
const getToken = () => {
    return localStorage.getItem('token');
};

// CLIENTS list Ejecute ---- ↓↓↓ get clients
const listClients = document.getElementById('list_clients');

const getClientsAction = (data) => {

    listClients.innerHTML = '';

    const clients = data.clients;

    // extract clients one by one
    clients.forEach(client => {

        const listItem = document.createElement('li');

        client.birthday = new Date(client.birthday);

        client.birthday = client.birthday.toDateString();

        console.log(client)

        listItem.innerHTML = `
            <p><b>DI: </b>${client.DI}</p>
            <p><b>Full Name: </b>${client.name} ${client.lastname}</p>
            <p><b>Birthday: </b>${client.birthday}</p>
            <p><b>Email: </b>${client.email}</p>
            ${client.phonenumberOne ? `<p><b>Phone N°.1: </b>${client.phonenumberOne}</p>` : ''}
            ${client.phonenumberTwo ? `<p><b>Phone N°.2: </b>${client.phonenumberTwo}</p>` : ''}

            ${client.addressOne ? `<p><b>Address N°.1: </b>${client.addressOne}</p>` : ''}
            ${client.addressTwo ? `<p><b>Address N°.2: </b>${client.addressTwo}</p>` : ''}

            <div>
                <button class="detail_button-list" data-detail="${client.id}">Details</button>
                <button class="edit_button-list" data-edit="${client.id}">Edit</button>
                <button class="delete_button-list" data-delete="${client.id}">Delete</button>
            </div>
        `;

        listClients.appendChild(listItem);
    });

};

const getClients = async () => {
    const token = getToken();

    const response = await request(`${apiUrl}/clients`, 'GET', null, getClientsAction, token);

    return response;
};

// DELETE clients
const deleteClient = async (id) => {
    const token = getToken();

    const result = request(`${apiUrl}/clients/${id}`, 'DELETE', null, null, token);

    console.log(result);
};

document.addEventListener('click', async (e) => {
    if (e.target.className === 'delete_button-list') {
        const id = e.target.dataset.delete;

        const token = getToken();

        await request(`${apiUrl}/clients/${id}`, 'DELETE', null, getClients, token);

        console.log('deleted', id)
    };
});

// DETAILS show client
document.addEventListener('click', async (e) => {
    if (e.target.className === 'detail_button-list') {

        const token = getToken();

        const id = e.target.dataset.detail;

        console.log(id);

        await request(`${apiUrl}/clients/${id}`, 'GET', null, null, token);
    };
});


// EDIT clients
const clntEditName = document.getElementById('edit_name');
const clntEditLastname = document.getElementById('edit_lastname');
const clntEditEmail = document.getElementById('edit_email');
const clntEditPhoneOne = document.getElementById('edit_phonenumberOne');
const clntEditPhoneTwo = document.getElementById('edit_phonenumberTwo');
const clntEditaddOne = document.getElementById('edit_addressOne');
const clntEditaddTwo = document.getElementById('edit_addressTwo');
const editBtnCancel = document.getElementById('edit_cancel');

let currentDetail;

const editClientsData = () => {
    const data = {
        name: clntEditName.value != '' ? clntEditName.value : undefined,
        lastname: clntEditLastname.value != '' ? clntEditLastname.value : undefined,
        email: clntEditEmail.value != '' ? clntEditEmail.value : undefined,
        addressOne: clntEditaddOne.value != '' ? clntEditaddOne.value : undefined,
        addressTwo: clntEditaddTwo.value != '' ? clntEditaddTwo.value : undefined,
        phonenumberOne: clntEditPhoneOne.value != '' ? clntEditPhoneOne.value : undefined,
        phonenumberTwo: clntEditPhoneTwo.value != '' ? clntEditPhoneTwo.value : undefined,
    };
    return data;
};

const editActions = () => {
    fade(currentTemplate, 'none', 1);
    fade(manageTemplate, 'grid', 2);
};

const editClients = async (id) => {
    const token = getToken();

    console.log(token)

    const response = await request(
        `${apiUrl}/clients/${id}`,
        'PATCH',
        editClientsData,
        editActions,
        token
    );

    console.log(response);
};

const editButton = document.getElementById('btn_edit');

editButton.addEventListener('click', () => {
    editClients(currentDetail);
});

document.addEventListener('click', async (e) => {
    if (e.target.className === 'edit_button-list') {
        fade(currentTemplate, 'none', 1);
        fade(editClientsTemp, 'flex', 2)
        currentDetail = e.target.dataset.edit;
    };
});

// Display templates
const display = (element, value) => {
    element.style.display = value;
    clearAllFields();
};

// Animation utils
const animationTime = (element, mode, time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(display(element, mode));
        }, time * 1000);
    });
};

// animations template
const fade = async (element, mode, time) => {
    // set transition times from argument
    element.style.transition = `all ${time}s`;
    // execute actions depending of display mode
    if (mode !== 'none') {
        // function return promise to use async functions
        await animationTime(element, mode, time);
        // change the current template when there are transitions template
        switchCurrentTemp(element);
        element.style.opacity = 0;
        // wait for element animation of current element to finish for execute actions
        setTimeout(() => {

            element.style.opacity = 1;
            if (element === manageTemplate) {
                getClients();
            };
        }, time);
    } else {
        // else there are mode same diferent to 'none' execute an simple animation.
        element.style.opacity = 0;
        await animationTime(element, mode, time);
    };
};

// Verify token
const verifyToken = async () => {
    const token = getToken();

    if (token) {
        const result = await request(
            `${apiUrl}/users`,
            'GET',
            null,
            null,
            token
        );

        console.log(token)

        if (result.status === 'success') {
            fade(currentTemplate, 'none', 1);
            fade(manageTemplate, 'grid', 2);
            buttonIsSession(true);
        } else if (result.status === 'fail') {
            localStorage.clear();
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
};

signupButton.addEventListener('click', () => {
    request(`${apiUrl}/users/signup`, 'POST', signupData, signupAction);
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
    fade(loginTemplate, 'none', 1);
    fade(manageTemplate, 'grid', 2);
    buttonIsSession(true);
};

loginButton.addEventListener('click', async () => {
    const token = await request(`${apiUrl}/users/login`, 'POST', loginData, loginActions);
    localStorage.setItem('token', token.token);
});

// Add clients
const clientDi = document.getElementById('add_DI');
const clientName = document.getElementById('add_name');
const clientLastname = document.getElementById('add_lastname');
const clientBirthday = document.getElementById('add_birthday');
const clientEmail = document.getElementById('add_email');
const clientPhoneOne = document.getElementById('add_phonenumberOne');
const clientPhoneTwo = document.getElementById('add_phonenumberTwo');
const clientAddressOne = document.getElementById('add_addressOne');
const clientAddressTwo = document.getElementById('add_addressTwo');
const addBtnCancel = document.getElementById('add_cancel');
const addButton = document.getElementById('btn_add');

const addClientsData = () => {
    const data = {
        DI: clientDi.value,
        name: clientName.value,
        lastname: clientLastname.value,
        birthday: clientBirthday.value,
        email: clientEmail.value,
        addressOne: clientAddressOne.value,
        addressTwo: clientAddressTwo.value,
        phonenumberOne: clientPhoneOne.value,
        phonenumberTwo: clientPhoneTwo.value
    };
    return data;
};

const addActions = () => {
    fade(currentTemplate, 'none', 1);
    fade(manageTemplate, 'grid', 2);
};

addButton.addEventListener('click', async () => {
    const token = getToken();

    const response = await request(
        `${apiUrl}/clients`,
        'POST',
        addClientsData,
        addActions,
        token
    );

    console.log(response);
});

addBtnCancel.addEventListener('click', () => {
    fade(currentTemplate, 'none', 1);
    fade(manageTemplate, 'grid', 2);
});

// Ways Button
const buttonToLogin = document.getElementById('btn_way-login');
const buttonToSignin = document.getElementById('btn_way-singup');
const btnToLoginNav = document.getElementById('btn_nav_way-login');
const btnToSigninNav = document.getElementById('btn_nav_way-singup');
const btnToLogoutNav = document.getElementById('btn_nav_way-logout');
const btnToAdd = document.getElementById('add_way');

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

btnToAdd.addEventListener('click', () => {
    fade(currentTemplate, 'none', 1);
    fade(addClientsTemp, 'flex', 2);
});

btnToLogoutNav.addEventListener('click', () => {
    localStorage.clear();
    fade(currentTemplate, 'none', 1);
    fade(welcomeTemplate, 'flex', 2);
    buttonIsSession(false);
});
// Buttons mod session
const buttonIsSession = (boolean) => {
    btnToLoginNav.style.display = boolean ? 'none' : 'flex';
    btnToSigninNav.style.display = boolean ? 'none' : 'flex';
    btnToLogoutNav.style.display = boolean ? 'flex' : 'none';
};



// ------------------------------------------------------------------

display(welcomeTemplate, 'flex');

verifyToken();