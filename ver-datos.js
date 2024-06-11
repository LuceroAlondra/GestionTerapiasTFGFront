document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert('No se pudo obtener el ID del usuario. Por favor, inicie sesión de nuevo.');
        window.location.href = '/login.html'; // Redirigir a la página de inicio de sesión si no hay ID
        return;
    }

    // Obtener los datos del paciente
    fetch(`http://localhost:8080/id/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(pacienteData => {
        console.log('Datos del paciente:', pacienteData); // Log the patient data for debugging
        // Llenar los campos de información personal del paciente
        document.getElementById('nombre').value = pacienteData.nombre;
        document.getElementById('email').value = pacienteData.email;
        document.getElementById('phone').value = pacienteData.phone;
        
        // Obtener los terapeutas del paciente
        fetch(`http://localhost:8080/paciente/${userId}/terapeutas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(terapeutas => {
            console.log('Terapeutas del paciente:', terapeutas); // Log the therapist data for debugging
            // Suponiendo que solo hay un terapeuta asignado al paciente, llenar los campos del terapeuta actual
            const terapeutaActual = terapeutas[0]; // Obtener el primer terapeuta de la lista
            document.getElementById('terapeuta-nombre').value = terapeutaActual.nombre;
        })
        .catch(error => {
            console.error('Error al obtener los terapeutas del paciente:', error);
            alert('Error al obtener los terapeutas del paciente: ' + error.message);
        });
    })
    .catch(error => {
        console.error('Error al obtener los datos del paciente:', error);
        alert('Error al obtener los datos del paciente: ' + error.message);
    });
});

// JavaScript en ver-datos.js

document.addEventListener('DOMContentLoaded', function() {
    // Resto del código para cargar los datos del paciente...

    // Agregar un listener de eventos al botón para redirigir a la página de detalles del terapeuta
    document.getElementById('ver-detalle-terapeuta').addEventListener('click', function() {
        window.location.href = 'terapeuta-detalle.html'; // Redirige al usuario a la página de detalles del terapeuta
    });
});

