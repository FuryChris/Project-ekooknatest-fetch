const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
let message = null;
let editSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"></path></svg>';
let deleteSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>';
let detailsSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path></svg>'

let formData = {
    first_name: 'Test2',
    last_name: 'Testando',
    postal_code: "12-231",
    street: 'prawa',
    city: 'testowe miasto',
    age: '33'
}

//  Changing JSON data into 
const encodeFormData = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

controlPages();
function controlPages() {
    switch (localStorage.getItem('page')) {
        case 'home':
            getUsers();
            break;
        case 'users':
            getUsers();
            break;
        case 'edit-user':
            getEditUser(localStorage.getItem('userId'));
            break
        case 'user':
            getDisplayUser(localStorage.getItem('userId'));
            break
        default:
    }
}


function errorMessage(message) {
    let messageDOM = document.getElementById('message-error-box');
    if (message !== null) {
        messageDOM.classList.remove('invisible');
        messageDOM.innerHTML = message;
    } else {
        messageDOM.classList.add('invisible')
    }
}

function getId(btn) {
    localStorage.setItem("userId", btn.value);
    console.log(localStorage.getItem("userId"));
}

function getUsers() {
    fetch('http://test.eko.eu')
        .then(res => res.json())
        .then(data => {
            let order = 0;
            let users = { ...data.users };
            let output = '';

            for (const userKey in users) {
                let user = users[userKey];
                order += 1;


                output += `
            <tr>
                <th scope="row" class="pt-3 pb-3">${order}</th>
                <td class="pt-3 pb-3">${user.first_name}</td>
                <td class="pt-3 pb-3">${user.last_name}</td>
                <td class="pt-3 pb-3" >${user.age}</td>
                <td class="pt-3 pb-3">${user.city}</td>

                <td class="pt-3 pb-3">
                    <form action="user.html" method="GET">
                        <button type="submit" onclick="getId(this)" class="btn btn-chris3  btn-outline-light" value="${user.id}"">
                            ${detailsSVG}
                        </button >
                    </form>
                </td >

                <td class="pt-3 pb-3" >
                    <form action="edit-user.html" method="GET">
                        <button type="submit" onclick="getId(this)" class=" btn btn-chris3  btn-outline-light" value="${user.id}"">
                            ${editSVG}
                        </button>
                    </form>
                </td>

                <td class="pt-3 pb-3">
                    <form action="" method="DELETE">
                        <button type="submit" onclick="deleteUser(this.value)" class="table-btn btn btn-chris3  btn-outline-light" value="${user.id}"">
                        ${deleteSVG}
                        </button>
                    </form>
                </td>
            </tr >
                `
                document.getElementsByClassName('table-users')[0].innerHTML = output;
            }
        })
        .catch(error => {
            errorMessage('Error: Failed to fetch data!');
            console.log('Błąd' + error)
        })
}

async function findById(id) {
    const res = await fetch('http://test.eko.eu')
    const data = await res.json();
    let users = { ...data.users };
    for (const userKey in users) {
        let user = users[userKey];
        if (user.id == localStorage.getItem('userId')) {
            return user;
        }
    }
    errorMessage('Error: User not found!');
    console.log('User not found!');
    return;
}

function getEditUser(id) {
    document.getElementById('btn-edit').addEventListener('click', editUser);

    let user = findById(id);
    user.then(user => {

        document.getElementById('btn-edit').value = user.id;
        document.getElementById('input-age').value = user.age;
        document.getElementById('input-firstname').value = user.first_name;
        document.getElementById('input-lastname').value = user.last_name;
        document.getElementById('input-postal').value = user.postal_code;
        document.getElementById('input-street').value = user.street;
        document.getElementById('input-city').value = user.city;
    })
}


function getDisplayUser(id) {
    let user = findById(id);
    user.then(user => {
        document.getElementById('card-name').innerHTML = `${user.first_name} ${user.last_name}`;
        document.getElementById('input-age').innerHTML = user.age;
        document.getElementById('input-firstname').innerHTML = user.first_name;
        document.getElementById('input-lastname').innerHTML = user.last_name;
        document.getElementById('input-postal').innerHTML = user.postal_code;
        document.getElementById('input-street').innerHTML = user.street;
        document.getElementById('input-city').innerHTML = user.city;
        document.getElementById('user-btns').innerHTML = `
        <button type="submit" onclick="getId(this)" class=" btn btn-chris3 mb-3 mr-4 w-25  btn-outline-dark" value="${user.id}">
        Edit   ${editSVG} 
        </button>
        <button type="submit" onclick="deleteUser(this.btn.value)" class=" btn btn-chris3 mb-3 ml-4 w-25 btn-outline-dark" value="${user.id}">${deleteSVG} Delete</button>
        `;

    })
}


const addUser = () => {
    fetch(`${proxyurl} http://test.eko.eu/user`, {
        method: 'POST',
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        body: encodeFormData(formData)
    })
        .then(res => {
            console.log(res);
            return res.json()
        })
        .then(data => console.log(data.user))
        .catch(error => errorMessage(error));

}

function deleteUser(userId) {
    let id = +userId
    fetch(`${proxyUrl}http://test.eko.eu/user/${id}`, {
        method: 'DELETE',
    })
        .then(res => {
            console.log(res + 'sprawdzam');
        })
        .then(data => {
            if (data !== undefined) {
                return console.log('User succesfully deleted!')
            } else {
                return console.log('User not found!!')
            }
        })
        .catch(error => errorMessage(error));

}



function editUser(btn) {
    let userId = document.getElementById('btn-edit').value;
    console.log(userId);
    btn.preventDefault();
    let editData = {
        first_name: `${document.getElementById('input-firstname').value}`,
        last_name: `${document.getElementById('input-lastname').value}`,
        age: `${document.getElementById('input-age').value}`,
        postal_code: `${document.getElementById('input-postal').value}`,
        city: `${document.getElementById('input-city').value}`,
        street: `${document.getElementById('input-street').value}`,
    }
    console.log(editData);

    fetch(`${proxyUrl}http://test.eko.eu/user/${userId}`, {
        method: 'PUT',
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "Access-Control-Allow-Origin": "*"
        },
        body: encodeFormData(editData)
    })
        .then(res => {
            console.log(res);
            return res.json()
        })
        .then(data => console.log(data.user))
        .catch(error => errorMessage(error));
}

let cxcx = 17;
let data = {
    age: "993",
    city: "Waa",
    first_name: "Dariio",
    last_name: "KAKA",
    postal_code: "22-22",
    street: "Aoo"
}

fetch(`${proxyUrl}http://test.eko.eu/user/${cxcx}`, {
    method: 'PUT',
    headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*"
    },
    body: encodeFormData(data)
})
    .then(res => {
        console.log(res);
        return res.json()
    })
    .then(data => console.log(data.user))
    .catch(error => errorMessage(error));

