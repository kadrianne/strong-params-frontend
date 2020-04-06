document.addEventListener('DOMContentLoaded', () => {
    console.log('%cDOM Content Loaded and Parsed!','color: purple')

    function getExistingUserData(){
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(users => users.forEach(createUserCard))
    }
    
    getExistingUserData()

    const newUserForm = document.getElementById('add-user')

    newUserForm.addEventListener('submit', () => {
        event.preventDefault()

        const formData = new FormData(newUserForm)
        const name = formData.get('name')
        const username = formData.get('username')
        const email = formData.get('email')
        const password = formData.get('password')
        const newUser = {
            user: {
                name: name,
                username: username,
                email: email,
                password: password
            }
        }

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(response => response.json())
            .then(results => handleResponse(results, newUserForm, 'post'))
            .catch(error => console.log(error))
    })
})

function createUserCard(user){
    const cardContainer = document.querySelector('#user-card-container')
    const userCard = document.createElement('div')
    
    userCard.className = 'user-card'
    userCard.id = `card-${user.id}`
    
    const name = document.createElement('h3')
    const username = document.createElement('p')
    const email = document.createElement('p')
    
    name.innerText = user.name
    name.id = `user${user.id}-name`
    username.innerText = user.username
    email.innerText = user.email
    
    userCard.append(name,username,email,createEditButton(user),createDeleteButton(user))
    cardContainer.append(userCard)
}

function createEditButton(user){
    const editButton = document.createElement('button')
    editButton.innerText = 'Edit User'
    editButton.addEventListener('click', () => {
        editUserInfo(user)
    })
    return editButton
}

function createDeleteButton(user){
    const deleteButton = document.createElement('button')
    deleteButton.innerText = 'Delete User'
    deleteButton.addEventListener('click', () => {
        deleteUserInfo(user)
    })
    return deleteButton
}

function editUserInfo(user){
    const editUserForm = document.createElement('form')
    const nameInput = document.createElement('input')
    const usernameInput = document.createElement('input')
    const emailInput = document.createElement('input')
    const passwordInput = document.createElement('input')
    const editUserButton = document.createElement('input')

    nameInput.name = "name"
    nameInput.value = user.name
    usernameInput.name = "username"
    usernameInput.value = user.username
    emailInput.name = "email"
    emailInput.value = user.email
    passwordInput.name = "password"
    passwordInput.placeholder = "Enter a new password."
    
    editUserButton.innerText = 'Update User Info'
    editUserButton.type = 'submit'
    editUserForm.append(nameInput,usernameInput,emailInput,passwordInput,editUserButton)
    editUserForm.addEventListener('submit', () => {
        event.preventDefault()
        patchUserInfo(user,editUserForm)
    })

    const formSection = document.querySelector('#forms-section')
    formSection.append(editUserForm)

}

function patchUserInfo(user,form){
    const formData = new FormData(form)
    const name = formData.get('name')
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    const updatedUser = {
        user: {
            name: name,
            username: username,
            email: email,
            password: password
        }
    }

    fetch(`http://localhost:3000/users/${user.id}`,{
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
        .then(response => response.json())
        .then(results => handleResponse(results, form, 'patch'))

}

function updateUserCard(user){
    const userCard = document.getElementById(`card-${user.id}`)
    console.log(userCard.childNodes)
}

function deleteUserInfo(user){
    deleteCard(user)
    fetch(`http://localhost:3000/users/${user.id}`,{
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(results => console.log(results))
}

function deleteCard(user){
    const card = document.querySelector(`#card-${user.id}`)
    card.remove()
}
function handleResponse(response, form, method){
    const messageContainer = document.createElement('p')
    if (response.user && method == 'post') {
        createUserCard(response.user)
        messageContainer.innerHTML = ''
        const successMessage = document.createElement('p')
        successMessage.className = 'success'
        successMessage.innerText = response.message
        messageContainer.appendChild(successMessage)
        form.reset()
    } else if (response.user && method == 'patch') {
        updateUserCard(response.user)
        messageContainer.innerHTML = ''
        const successMessage = document.createElement('p')
        successMessage.className = 'success'
        successMessage.innerText = response.message
        messageContainer.appendChild(successMessage)
        form.reset()
    } else {
        const responseMessages = Object.values(response)
        const errorMessages = document.createElement('ul')
        
        errorMessages.className = 'error-message'
        messageContainer.innerHTML = ''
        errorMessages.innerText = "User cannot be created due to the following errors:"
        
        responseMessages.forEach(messages => messages.forEach(message => {
            const errorMessage = document.createElement('li')
            
            errorMessage.innerText = message

            errorMessages.appendChild(errorMessage)
        }))
        messageContainer.appendChild(errorMessages)
    }
    form.append(messageContainer)
}