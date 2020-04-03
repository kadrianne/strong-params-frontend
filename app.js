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

        createUserCard(newUser.user)

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(response => response.json())
            .then(results => console.log)
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

function displayMessage(message){
    const alert = document.createElement('p')
    alert.innerText = message
    document.body.append(alert)
}