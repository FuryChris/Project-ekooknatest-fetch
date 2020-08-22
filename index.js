const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
let message = null;
let editSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"></path></svg>';
let deleteSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>';
let detailsSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M1.679 7.932c.412-.621 1.242-1.75 2.366-2.717C5.175 4.242 6.527 3.5 8 3.5c1.473 0 2.824.742 3.955 1.715 1.124.967 1.954 2.096 2.366 2.717a.119.119 0 010 .136c-.412.621-1.242 1.75-2.366 2.717C10.825 11.758 9.473 12.5 8 12.5c-1.473 0-2.824-.742-3.955-1.715C2.92 9.818 2.09 8.69 1.679 8.068a.119.119 0 010-.136zM8 2c-1.981 0-3.67.992-4.933 2.078C1.797 5.169.88 6.423.43 7.1a1.619 1.619 0 000 1.798c.45.678 1.367 1.932 2.637 3.024C4.329 13.008 6.019 14 8 14c1.981 0 3.67-.992 4.933-2.078 1.27-1.091 2.187-2.345 2.637-3.023a1.619 1.619 0 000-1.798c-.45-.678-1.367-1.932-2.637-3.023C11.671 2.992 9.981 2 8 2zm0 8a2 2 0 100-4 2 2 0 000 4z"></path></svg>'

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
        case 'new-user':
            break
        default:
    }
}

async function findById(id) {
    const res = await fetch('https://test.eko.eu')
    const data = await res.json();
    let users = { ...data.users };
    for (const userKey in users) {
        let user = users[userKey];
        if (user.id == id) {
            return user;
        }
    }
    errorMessage('Error: User not found!');
    return;
}


function displayModal(id) {
    console.log(event)
    let user = findById(id)
    user.then(res => {
        console.log(res);
        console.log(id);
        console.log(document.getElementsByClassName('btn-modal')[0]);

        // dynamic change data in modal
        document.getElementsByClassName('btn-modal')[0].value = id;
        document.getElementsByClassName('btn-modal')[1].value = id;
        document.getElementsByClassName('btn-modal')[2].value = id;
        document.getElementsByClassName('modal-title')[0].innerHtml = `${res.first_name} ${res.last_name}`;
    })
        .catch(err => {
            console.log(err)
        })
}


// handling of displaying list of users
function getUsers() {
    //checking for localstorage messages to display
    infoMessage(null);
    errorMessage(null);
    fetch('https://test.eko.eu')
        .then(res => res.json())
        .then(data => {
            let order = 0;
            let users = { ...data.users };
            let output = '';


            let modalInit = `
                <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">Name</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div class="modal-body">
                      Choose an user action. Warning! Deleted users cannot be restored!
                    </div>
                    <div class="modal-footer">
                      <form action="user.html" method="GET">
                      <button type="submit" onclick="getId(this)" class="btn btn-modal btn-details btn-outline-chris3 list-group-item-chris3"  value="">
                          ${detailsSVG} Details
                      </button >
                      </form>
                      <form action="edit-user.html" method="GET">
                      <button type="submit" onclick="getId(this)" class=" btn btn-modal btn-edit btn-outline-chris3 list-group-item-chris3 d-none d-sm-block"  value="">
                          ${editSVG} Edit
                      </button>
                      </form>
                      <form action="" method="DELETE">
                      <button type="submit" onclick="deleteUser(event, this.value)" class="btn btn-modal btn-delete btn  btn-outline-chris3 list-group-item-chris3 d-none d-sm-block"  value="">
                      ${deleteSVG} Delete
                      </button>
                  </form>
                  </div>
                </div>
              </div>
              `

            document.getElementById('modal').innerHTML = modalInit;



            for (const userKey in users) {
                let user = users[userKey];
                order += 1;
                let id = user.id;
                output += `
                <tr data-toggle="modal" data-target="#exampleModal" onclick="displayModal(${id})" style="cursor: pointer;">
                    <th scope="row"" class="pt-3 pb-3">${order}</th>
                    <td class="pt-3 pb-3">${user.first_name}</td>
                    <td class="pt-3 pb-3">${user.last_name}</td>
                    <td class="pt-3 pb-3" >${user.age}</td>
                    <td class="pt-3 pb-3">${user.city}</td>

                    <td class="pt-3 pb-3">
                        <form action="user.html" method="GET">
                            <button type="submit" onclick="getId(this)" class="btn btn-details btn-outline-chris3 list-group-item-chris3" value="${id}">
                                ${detailsSVG}
                            </button >
                        </form>
                    </td >
                </tr >
                `
                document.getElementsByClassName('table-users')[0].innerHTML = output;

                //resetting msgs
                localStorage.setItem('msg', null);
                localStorage.setItem('msgErr', null);

            }
        })
        .catch(error => {
            errorMessage('Error: Failed to fetch data!');
            localStorage.setItem('msg', null);
            localStorage.setItem('msgErr', null);
        })
}


// info-message handler
function infoMessage(message) {
    let messageDOM = document.getElementById('message-info-box');
    if (message !== null && message) {
        messageDOM.classList.remove('invisible');
        messageDOM.innerHTML = message;
    } else if ((localStorage.getItem('msg') !== 'null') && localStorage.getItem('msg')) {
        messageDOM.classList.remove('invisible');
        messageDOM.innerHTML = localStorage.getItem('msg');
    } else {
        messageDOM.classList.add('invisible')
    }
}

// error-message handler
function errorMessage(message) {
    let messageDOM = document.getElementById('message-error-box');
    if (message !== null && message) {
        messageDOM.classList.remove('invisible');
        messageDOM.innerHTML = message;
    } else if (localStorage.getItem('msgErr') !== 'null' && localStorage.getItem('msgErr')) {
        messageDOM.classList.remove('invisible');
        messageDOM.innerHTML = localStorage.getItem('msgErr');
    } else {
        messageDOM.classList.add('invisible')
    }
}

// storing id in localstorage (used for info and edit buttons in list view)
function getId(btn) {
    localStorage.setItem("userId", btn.value);
}

// displaying current user data as predefined in edit page.
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
        .catch(error => errorMessage(error))
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
            <form action="edit-user.html" class="form-check-inline" method="GET">
                <button action="edit-user.html" type="submit" onclick="getId(this)" class=" btn btn-chris3 mb-3 mr-4 w-100  btn-outline-dark" value="${user.id}">
                    Edit   ${editSVG} 
                </button>  
            </form>
            <form action="" class="form-check-inline" method="DELETE">
        <button type="button" onclick="deleteUser(event, this.value)" class=" btn btn-chris3 mb-3 ml-4 w-100 btn-outline-dark" value="${user.id}">${deleteSVG} Delete</button>
        </form>
        `;
    })
        .catch(error => errorMessage(error))
}

function addUser(event) {
    event.preventDefault();
    event.target.disabled = true;
    //  BASIC INPUT VALIDATION
    let age = document.getElementById('input-age').value
    let fname = document.getElementById('input-firstname').value
    let lname = document.getElementById('input-lastname').value
    let postal = document.getElementById('input-postal').value
    let street = document.getElementById('input-street').value
    let city = document.getElementById('input-city').value

    if (!((age.length > 0 && age < 120)
        && (fname.length > 0 && fname.length < 101)
        && (lname.length > 0 && lname.length < 101)
        && (postal.length > 0 && postal.length < 11)
        && (street.length > 0 && street.length < 101)
        && (city.length > 0 && city.length < 101)
    )) {
        errorMessage('Provided data is wrong!')
        event.target.disabled = false;
    } else {
        let formData = {
            first_name: `${fname}`,
            last_name: `${lname}`,
            age: `${age}`,
            postal_code: `${postal}`,
            city: `${city}`,
            street: `${street}`,
        }

        fetch(`${proxyUrl}https://test.eko.eu/user`, {
            method: 'POST',
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*"
            },
            body: encodeFormData(formData)
        })
            .then(res => {
                event.target.disabled = false;
                if (res.status !== 200) {
                    errorMessage(`Some error ocurred! Error code: ${res.status}`);
                } else {
                    window.location.href = "./users.html"
                    localStorage.setItem('msg', 'User succesfully added!');
                }
            }).catch(error => errorMessage(error));
    }
}

function deleteUser(event, id) {
    event.preventDefault();
    event.target.disabled = true;
    fetch(`${proxyUrl}https://test.eko.eu/user/${id}`, {
        method: 'DELETE',
    })
        .then(res => {
            event.target.disabled = false;
            if (res.status !== 200) {
                errorMessage(`Some error ocurred! Error code: ${res.status}`);
            } else {
                window.location.href = "./users.html"
                localStorage.setItem('msg', 'User succesfully deleted!');
            }
        })
        .catch(error => {
            errorMessage(error)
        });
}

function editUser(ev) {
    let btn = document.getElementById('btn-edit');
    let userId = btn.value;
    btn.disabled = true;
    ev.preventDefault();

    //  BASIC INPUT VALIDATION
    let age = document.getElementById('input-age').value
    let fname = document.getElementById('input-firstname').value
    let lname = document.getElementById('input-lastname').value
    let postal = document.getElementById('input-postal').value
    let street = document.getElementById('input-street').value
    let city = document.getElementById('input-city').value

    if (!((age.length > 0 && age < 120)
        && (fname.length > 0 && fname.length < 101)
        && (lname.length > 0 && lname.length < 101)
        && (postal.length > 0 && postal.length < 11)
        && (street.length > 0 && street.length < 101)
        && (city.length > 0 && city.length < 101)
    )) {
        errorMessage('Provided data is wrong!')
        btn.disabled = false;
    } else {
        let editData = {
            first_name: `${fname}`,
            last_name: `${lname}`,
            age: `${age}`,
            postal_code: `${postal}`,
            city: `${city}`,
            street: `${street}`,
        }
        fetch(`${proxyUrl}https://test.eko.eu/user/${userId}`, {
            method: 'PUT',
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Access-Control-Allow-Origin": "*"
            },
            body: encodeFormData(editData)
        })
            .then(res => {
                btn.disabled = false;
                if (res.status !== 200) {
                    errorMessage(`Some error ocurred! Error code: ${res.status}`);
                } else {
                    window.location.href = "./users.html"
                    localStorage.setItem('msg', 'User succesfully edited!');
                }
            })
            .catch(error => errorMessage(error));
    }
}
