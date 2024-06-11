document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert('No se pudo obtener el ID del usuario. Por favor, inicie sesión de nuevo.');
        window.location.href = '/login.html'; // Redirigir a la página de inicio de sesión si no hay ID
        return;
    }

    fetch(`http://localhost:8080/id/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(userData => {
        console.log('Datos del usuario:', userData); // Log the user data for debugging
        // Mostrar los datos del usuario en los campos del formulario
        document.getElementById('firstName').value = userData.nombre;
        document.getElementById('lastName').value = userData.apellido;
        document.getElementById('email').value = userData.email;
        document.getElementById('password').value = userData.password;
        document.getElementById('phoneNumber').value = userData.phone;

        // Agregar un evento de escucha para el botón de guardar cambios
        document.getElementById('save-edit-button').addEventListener('click', function() {
            // Obtener los valores de los campos de entrada
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const phoneNumber = document.getElementById('phoneNumber').value;

            // Crear un objeto con los datos actualizados del usuario
            const updatedUserData = {
                nombre: firstName,
                apellido: lastName,
                email: email,
                password: password,
                phone: phoneNumber // Asegúrate de usar el mismo nombre de campo que espera el backend
            };

            // Enviar los datos actualizados al backend usando fetch
            fetch(`http://localhost:8080/editar/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserData)
            })
            .then(response => response.json())
            .then(data => {
                // Manejar la respuesta del servidor
                console.log('Respuesta del servidor:', data);
                // Aquí puedes agregar cualquier lógica adicional para manejar la respuesta del servidor
                alert('Perfil actualizado correctamente');
            })
            .catch(error => {
                console.error('Error al enviar datos actualizados al servidor:', error);
                // Aquí puedes manejar errores de envío al servidor
                alert('Error al actualizar el perfil: ' + error.message);
            });
        });
    })
    .catch(error => {
        console.error('Error al obtener los datos del usuario:', error);
        alert('Error al obtener los datos del usuario: ' + error.message);
    });
});



