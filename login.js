document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('loading').style.display = 'flex';

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    console.log('Form Data:', formData); // Log the form data for debugging

    fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData) // Send form data as JSON
    })
    .then(response => {
        console.log('Raw response:', response); // Log the raw response for debugging

        // Check if response is JSON
        if (response.headers.get('content-type').includes('application/json')) {
            return response.json();
        } else {
            return response.text(); // If not JSON, return response as text
        }
    })
    .then(data => {
        document.getElementById('loading').style.display = 'none';
        console.log('Response data:', data); // Log the parsed response data
        if (data.success) {
            localStorage.setItem('userId', data.userId); // Save user ID to localStorage
            alert('Inicio de sesión exitoso!');
            window.location.href = 'http://localhost/CarpetasUtiles/dashboard.html'; // Redirect to the dashboard
        } else if (data.text === "Inicio de sesión exitoso") {
            localStorage.setItem('userId', data.userId); // Save user ID to localStorage
            alert('Inicio de sesión exitoso!');
            window.location.href = 'http://localhost/CarpetasUtiles/dashboard.html'; // 
        } else {
            alert('Error al iniciar sesión: ' + data.message);
        }
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        console.error('Error:', error); // Log any errors encountered
        alert('Error al iniciar sesión: ' + error.message);
    });
});


