async function peticionHTTP() {
    try {
        const response = await fetch('/identificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: 'paco', password: '1234' })
        });

        if (!response.ok) {
            // Manejar errores aquí, puedes mostrar mensajes de error o realizar acciones específicas
            console.error('Error en la petición:', response.status);
            return;
        }

        const data = await response.json();

        // Verificar la respuesta según tu lógica de negocio
        if (data.res === 'login true') {
            window.location.replace('/rutaSegura');
        } else {
            console.error('Error en la autenticación:', data.res);
        }
    } catch (error) {
        console.error('Error al realizar la petición:', error);
    }
}
