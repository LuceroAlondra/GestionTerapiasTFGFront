document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('loading').style.display = 'flex';

    const formData = {
        nombre: document.getElementById('firstName').value,
        apellido: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,  // Este debe ser 'phone'
        password: document.getElementById('password').value,
        historiaClinica: 'Historial vacio',  // Campo vacío o predeterminado
    };

    console.log('Datos del formulario:', formData);

    const registrationPromise = fetch('http://localhost:8080/crear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        console.log('Respuesta cruda:', response);
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
        }
        return response.text();
    });

    const delayPromise = new Promise(resolve => setTimeout(resolve, 2000));

    Promise.all([registrationPromise, delayPromise])
    .then(([data]) => {
        console.log('Datos de respuesta:', data);
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Registro exitoso! Redirigiendo al inicio de sesión...';
        messageElement.style.color = 'black';
        document.getElementById('loading').style.display = 'none';

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        console.error('Error:', error);
        const messageElement = document.getElementById('message');
        messageElement.textContent = 'Error al registrar: ' + error.message;
        messageElement.style.color = 'red';
    });
});


