function iniciarSesion() {
  var usuario = document.getElementById('usuario').value;
  var contraseña = document.getElementById('clave').value;

  var promise = $.ajax({
      type: 'POST',
      url: '/identificarNuevo',
      data: JSON.stringify({ username: usuario, password: contraseña }),
      contentType: 'application/json;charset=UTF-8',
      dataType: 'json'
  });

  promise.always(function (data) {
      if (data.res == "login true") {
          window.location.replace("/rutaSegura");
      } else if (data.res == "usuario no valido") {
          alert("No estás autorizado, ese usuario no es válido");
      } else if (data.res == "login failed") {
          alert("Debes introducir el usuario y contraseña");
      } else {
          window.alert("Error");
      }
  });
}

function registrarUsuario() {
  var usuario = document.getElementById('usuario').value;
  var contraseña = document.getElementById('clave').value;

  var promise = $.ajax({
      type: 'POST',
      url: '/registrarNueva',
      data: JSON.stringify({ username: usuario, password: contraseña }),
      contentType: 'application/json;charset=UTF-8',
      dataType: 'json'
  });

  promise.always(function (data) {
      if (data.res == "register true") {
          window.location.replace("/login");
      } else if (data.res == "usuario ya existe") {
          alert("Ya existe ese usuario");
      } else if (data.res == "register failed") {
          alert("Debes introducir el usuario y contraseña");
      } else {
          window.alert("Error");
      }
  });
}

function mostrarListaUsuarios() {
  var promise = $.ajax({
      type: 'GET',  // Cambiado a GET
      url: '/lista_usuarios',
      contentType: 'application/json;charset=UTF-8',
      dataType: 'json'
  });

  promise.always(function (data) {
      // Trata la respuesta según tus necesidades
      console.log(data);
  });
}
