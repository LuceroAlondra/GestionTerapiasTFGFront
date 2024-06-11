document.addEventListener('DOMContentLoaded', function() {
    const pacienteId = localStorage.getItem('userId');

    if (!pacienteId) {
        alert('No se pudo obtener el ID del paciente. Por favor, inicie sesión de nuevo.');
        window.location.href = '/login.html';
        return;
    }

    // Obtener los terapeutas del paciente
    fetch(`http://localhost:8080/paciente/${pacienteId}/terapeutas`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(terapeutas => {
        console.log('Terapeutas del paciente:', terapeutas);
        
        // Suponiendo que solo hay un terapeuta asignado al paciente, obtener el primer terapeuta de la lista
        const terapeutaActual = terapeutas[0];
        
        // Llenar los campos del terapeuta actual en el formulario de información del terapeuta
        document.getElementById('nombre').value = terapeutaActual.nombre;
        document.getElementById('apellido').value = terapeutaActual.apellido;
        document.getElementById('email').value = terapeutaActual.email;
        document.getElementById('phone').value = terapeutaActual.phone;

        // Obtener la especialidad del terapeuta
        fetch(`http://localhost:8080/${pacienteId}/especialidad`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(especialidad => {
            console.log('Especialidad del terapeuta:', especialidad);

            // Llenar el campo de la especialidad en el formulario de información del terapeuta
            document.getElementById('especialidad').value = especialidad.nombre;
        })
        .catch(error => {
            console.error('Error al obtener la especialidad del terapeuta:', error);
            alert('Error al obtener la especialidad del terapeuta: ' + error.message);
        });
    })
    .catch(error => {
        console.error('Error al obtener los terapeutas del paciente:', error);
        alert('Error al obtener los terapeutas del paciente: ' + error.message);
    });
});

