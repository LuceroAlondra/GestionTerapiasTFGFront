$(document).ready(function() {
    // Función para generar las opciones de tiempo en el select
    function generateTimeOptions(selector) {
        $(selector).empty(); // Limpiar opciones anteriores
        var startTime = moment('08:00', 'HH:mm'); // 8:00 AM
        var endTime = moment('18:00', 'HH:mm'); // 6:00 PM
        var interval = 45; // 45 minutos
        var currentTime = startTime.clone();
        
        while (currentTime.isBefore(endTime)) {
            $(selector).append('<option value="' + currentTime.format('HH:mm') + '">' + currentTime.format('hh:mm A') + '</option>');
            currentTime.add(interval, 'minutes');
        }
    }

    // Función para agregar una nueva cita en orden
    function addAppointmentInOrder(date, time, existingItem = null) {
        var newDateTime = moment(date + ' ' + time, 'YYYY-MM-DD HH:mm');
        var appointments = $('#appointments-list').children('.list-group-item');

        // Si existe un elemento, remuévelo temporalmente del DOM para reubicarlo
        if (existingItem) {
            existingItem.remove();
        }

        // Buscar la posición adecuada para la nueva cita
        var insertIndex = 0;
        appointments.each(function(index, element) {
            var existingDateAndTime = $(element).text().split(': ')[1];
            var [existingDate, existingTime] = existingDateAndTime.split(' ');
            var existingDateTime = moment(existingDate + ' ' + existingTime, 'YYYY-MM-DD HH:mm');
            if (newDateTime.isBefore(existingDateTime)) {
                return false; // Salir del bucle cuando se encuentra la posición adecuada
            }
            insertIndex++;
        });

        // Crear la nueva cita y agregarla en la posición encontrada
        var newAppointmentHtml = `Cita: ${date} ${time}
            <button class="btn btn-sm btn-primary float-right edit-button">Editar</button>
            <button class="btn btn-sm btn-danger float-right mr-2 delete-button">Eliminar</button>`;
        
        var newAppointment;
        if (existingItem) {
            newAppointment = existingItem;
            newAppointment.html(newAppointmentHtml);
        } else {
            newAppointment = $('<li class="list-group-item">' + newAppointmentHtml + '</li>');
        }

        if (insertIndex < appointments.length) {
            newAppointment.insertBefore(appointments.eq(insertIndex));
        } else {
            $('#appointments-list').append(newAppointment);
        }
    }

    // Inicializar TimePicker para solicitud de cita
    generateTimeOptions('#timepicker-request');

    // Event handler para manejar la solicitud de una nueva cita
    $('#request-button').click(function() {
        var date = $('#datepicker').val();
        var time = $('#timepicker-request').val();
        addAppointmentInOrder(date, time); // Agregar la nueva cita en orden
    });

    // Event handler para editar cita
    $('#appointments-list').on('click', '.edit-button', function() {
        var listItem = $(this).closest('.list-group-item');
        var dateAndTime = listItem.text().split(': ')[1];
        var [date, time] = dateAndTime.split(' ');
        $('#edit-datepicker').val(date);
        $('#edit-timepicker').val(time);
        $('#editModal').data('edited-item', listItem);
        $('#editModal').modal('show');
        // Generar opciones de tiempo para editar cita
        generateTimeOptions('#edit-timepicker');
    });

    // Guardar cambios de edición
    $('#save-edit-button').click(function() {
        var newDate = $('#edit-datepicker').val();
        var newTime = $('#edit-timepicker').val();
        var editedItem = $('#editModal').data('edited-item');

        // Llamar a addAppointmentInOrder con el elemento editado
        addAppointmentInOrder(newDate, newTime, editedItem);
        $('#editModal').modal('hide');
    });

    // Event handler para eliminar cita
    $('#appointments-list').on('click', '.delete-button', function() {
        $(this).closest('.list-group-item').remove();
    });

    // Función para mostrar/ocultar el menú desplegable de mis datos
    $('#my-data').hover(function() {
        $('#my-data-dropdown').css('display', 'block');
    }, function() {
        $('#my-data-dropdown').css('display', 'none');
    });

    // Mostrar/ocultar el menú desplegable de mis datos al pasar sobre él
    $('#my-data-dropdown').hover(function() {
        $(this).css('display', 'block');
    }, function() {
        $(this).css('display', 'none');
    });

    // Manejar clic en "Darme de baja"
    $('#cancel-subscription').click(function(event) {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace

        // Obtener el ID del usuario desde el localStorage
        const userId = localStorage.getItem('userId');
        console.log('userId:', userId);

        if (!userId) {
            alert('No se pudo obtener el ID del usuario. Por favor, inicie sesión de nuevo.');
            window.location.href = '/login.html'; // Redirigir a la página de inicio de sesión si no hay ID
            return;
        }

        // Confirmar si el usuario realmente desea darse de baja
        var confirmCancel = confirm('¿Estás seguro de que quieres darte de baja?');

        if (confirmCancel) {
            console.log('Iniciando solicitud DELETE...');
            // Enviar solicitud DELETE al backend para eliminar al paciente
            fetch(`http://localhost:8080/borrar/${userId}`, {
                method: 'DELETE'
            })
            .then(response => {
                console.log('Respuesta de DELETE:', response);
                if (response.ok) {
                    // Si la eliminación fue exitosa, mostrar un mensaje
                    alert('Paciente eliminado correctamente');
                    // También puedes redirigir a una página de confirmación o recargar la página
                } else {
                    // Si hubo algún problema con la eliminación, mostrar un mensaje de error
                    alert('Hubo un error al eliminar al paciente. Por favor, inténtalo de nuevo.');
                }
            })
            .catch(error => {
                // Si ocurrió un error en la solicitud fetch, mostrar un mensaje de error
                console.error('Error al eliminar al paciente:', error);
                alert('Hubo un error al eliminar al paciente. Por favor, inténtalo de nuevo.');
            });
        }
    });
});



