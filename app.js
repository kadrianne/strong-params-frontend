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
            .then(results => handleResponse(results, newUserForm))
            .catch(error => console.log(error))
    })
})

function createUserCard(user){
    const userCard = document.createElement('div')
    userCard.className = 'user-card'
    const name = document.createElement('h3')
    const username = document.createElement('p')
    const email = document.createElement('p')
    
    name.innerText = user.name
    username.innerText = user.username
    email.innerText = user.email

    userCard.append(name,username,email)
    document.body.append(userCard)
}

function handleResponse(response, form){
    if (response.user) {
        createUserCard(response.user)
        const successMessage = document.createElement('p')
        successMessage.className = 'success'
        successMessage.innerText = response.message
        form.appendChild(successMessage)
        form.reset()
    } else {
        const responseMessages = Object.values(response)
        const errorMessages = document.querySelector('.error-message')

        errorMessages.innerText = "User cannot be created due to the following errors:"
        
        responseMessages.forEach(messages => messages.forEach(message => {
            const errorMessage = document.createElement('li')
            
            errorMessage.innerText = message

            errorMessages.appendChild(errorMessage)
        }))

        form.appendChild(errorMessages)

    }
    // const alert = document.createElement('p')
    // alert.innerText = response.message
    // document.body.append(alert)
}