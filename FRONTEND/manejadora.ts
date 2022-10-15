/// <reference path="./neumatico.ts" />
/// <reference path="./neumaticoBD.ts" />
/// <reference path="./Iparte2.ts" />
/// <reference path="./Iparte3.ts" />
/// <reference path="./Iparte4.ts" />

let xhttp: XMLHttpRequest = new XMLHttpRequest();

namespace PrimerParcial {

    export class Manejadora implements Iparte2, Iparte3, Iparte4 {

      // AgregarNeumaticoJSON. Obtiene la marca, las medidas y el precio desde la página neumatico.html y se
      // enviará (por AJAX) hacia “./BACKEND/altaNeumaticoJSON.php” que invoca al método guardarJSON y se pasa
      // './archivos/neumaticos.json' cómo parámetro. Retornará un JSON que contendrá: éxito(bool) y mensaje(string) indicando lo
      // acontecido.
      // Informar por consola y alert el mensaje recibido.
    public static AgregarNeumaticoJSON() {
        let marca: string = (<HTMLInputElement>document.getElementById("marca")).value;
        let medidas: string = (<HTMLInputElement>document.getElementById("medidas")).value;
        let precio: string = (<HTMLInputElement>document.getElementById("precio")).value;

        xhttp.open("POST", "./BACKEND/altaNeumaticoJSON.php", true);

        let form: FormData = new FormData();

        form.append("marca", marca);
        form.append("medidas", medidas);
        form.append("precio", precio);

        xhttp.send(form);

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                let respuesta = JSON.parse(xhttp.responseText);
                console.log(respuesta.mensaje);
                alert(respuesta.mensaje);
            }
          };
    }

    // MostrarNeumaticosJSON. Recuperará (por AJAX) todos los neumáticos del archivo neumaticos.json y
    // generará un listado dinámico, crear una tabla HTML con cabecera (en el FRONTEND) que mostrará toda la
    // información de cada uno de los neumáticos. Invocar a “./BACKEND/listadoNeumaticosJSON.php”, recibe la
    // petición (por GET) y retornará el listado de todos los neumáticos en formato JSON.
    // Informar por consola el mensaje recibido y mostrar el listado en la página (div id='divTabla').
  
    public static MostrarNeumaticosJSON() {

        xhttp.open("GET", "./BACKEND/listadoNeumaticosJSON.php", true);
        xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let respuesta: string = xhttp.responseText;
            let neumaticosJson = JSON.parse(respuesta);
            console.log(neumaticosJson);

            const contenerdorTabla: HTMLDivElement = <HTMLDivElement>document.getElementById("divTabla");
            contenerdorTabla.innerHTML = "";

            // ARMADO DE TABLA
            const tabla: HTMLTableElement = document.createElement("table");

            // Armado de thead
            const thead = document.createElement("thead");

            for (const key in neumaticosJson[0]) {
            const th = document.createElement("th");
            let text = document.createTextNode(key.toUpperCase());
            th.appendChild(text);
            thead.appendChild(th);
            }
            //Armado de tbody
            const tbody = document.createElement("tbody");
            neumaticosJson.forEach((neumatico: any) => {
            const tr = document.createElement("tr");
            
            for (const key in neumatico) {
                const td = document.createElement("td");
                let text = document.createTextNode(neumatico[key]);
                td.appendChild(text);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
            });
            tabla.appendChild(thead);
            tabla.appendChild(tbody);
            contenerdorTabla.appendChild(tabla); // se inyecta toda la tabla en el contenedor
        }
        };

        xhttp.send();
    }

    // VerificarNeumaticoJSON. Se invocará (por AJAX) a “./BACKEND/verificarNeumaticoJSON.php”. Se recibe por
    // POST la marca y las medidas y retornará un JSON que contendrá: éxito(bool) y mensaje(string) indicando lo acontecido (agregar, aquí
    // también, el mensaje obtenido del método VerificarNeumaticoJSON).
    // Se mostrará (por consola y alert) lo acontecido.

    public static VerificarNeumaticoJSON() {

        let marca: string = (<HTMLInputElement>document.getElementById("marca")).value;
        let medidas: string = (<HTMLInputElement>document.getElementById("medidas")).value;

        xhttp.open("POST", "./BACKEND/verificarNeumaticoJSON.php", true);

        let form: FormData = new FormData();

        form.append("marca", marca);
        form.append("medidas", medidas);

        xhttp.send(form);

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                let respuesta = JSON.parse(xhttp.responseText);
                console.log(respuesta.mensaje);
                alert(respuesta.mensaje);
            }
          };

    }

    // AgregarNeumaticoSinFoto. Obtiene la marca, las medidas y el precio desde la página neumatico.html, y se
    // enviará (por AJAX) hacia “./BACKEND/agregarNeumaticoSinFoto.php” que recibe por POST el parámetro
    // neumático_json (marca, medidas y precio), en formato de cadena JSON. Se invocará al método agregar.
    // Se retornará un JSON que contendrá: éxito(bool) y mensaje(string) indicando lo acontecido.
    // Informar por consola y alert el mensaje recibido.

    public static AgregarNeumaticoSinFoto() {
        let marca: string = (<HTMLInputElement>document.getElementById("marca")).value;
        let medidas: string = (<HTMLInputElement>document.getElementById("medidas")).value;
        let precio: number = parseInt((<HTMLInputElement>document.getElementById("precio")).value);

        let neumatico = new Entidades.Neumatico(marca, medidas, precio);

        xhttp.open("POST", "./BACKEND/agregarNeumaticoSinFoto.php", true);

        let form: FormData = new FormData();

        form.append("neumatico_json", neumatico.ToJSON());

        xhttp.send(form);

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                let respuesta = JSON.parse(xhttp.responseText);
                console.log(respuesta.mensaje);
                alert(respuesta.mensaje);
            }
          };

    }

    // MostrarNeumaticosBD. Recuperará (por AJAX) todas los neumáticos de la base de datos, invocando a
    // “./BACKEND/listadoNeumaticosBD.php”, que recibirá el parámetro tabla con valor distinto a 'mostrar', para que retorne un
    // array de objetos con formato JSON.
    // Crear una tabla HTML con cabecera (en el FRONTEND) para mostrar la información de cada uno de los
    // neumáticos. Preparar la tabla para que muestre la imagen, si es que la tiene. Todas las imágenes deben tener
    // 50px por 50px de dimensiones.
    // Informar por consola el mensaje recibido y mostrar el listado en la página (div id='divTabla').

    public static MostrarNeumaticosBD(tipoTabla: number) {
      xhttp.open("GET", "./BACKEND/ListadoNeumaticosBD.php", true);
      xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          let respuesta: string = xhttp.responseText;
          let neumaticosJson = JSON.parse(respuesta);
          console.log(neumaticosJson);
  
          const contenerdorTabla: HTMLDivElement = <HTMLDivElement>document.getElementById("divTabla");
          contenerdorTabla.innerHTML = "";
  
          let tablaStr: string = `
          <table>
              <thead>`;
          for (const key in neumaticosJson[0]) {
            tablaStr += `<th>${key.toLocaleUpperCase()}</th>`;
          }
          tablaStr += `<th>ACCIONES</th>`;
          tablaStr += `</thead>`;
  
          tablaStr += `<tbody>`;
          neumaticosJson.forEach((neumatico: any) => {
            tablaStr += `<tr>`;
            for (const key in neumatico) {
              if (key != "pathFoto") {
                tablaStr += `<td>${neumatico[key]}</td>`;
              } else {
                tablaStr += `<td><img src='./BACKEND${neumatico[key]}' width='50px' alt='img'></td>`;
              }
            }
  
            let neumaticoStr = JSON.stringify(neumatico);
            if (tipoTabla == 1) {
              tablaStr += `<td> <input type="button" value="Modificar" class="btn btn-info" onclick=PrimerParcial.Manejadora.BtnModificarNeumatico(${neumaticoStr})></td>`;
              tablaStr += `<td> <input type="button" value="Eliminar" class="btn btn-danger" onclick=PrimerParcial.Manejadora.EliminarNeumatico(${neumaticoStr})></td>`;
            } else if (tipoTabla == 2) {
              tablaStr += `<td> <input type="button" value="Modificar" class="btn btn-info" onclick=PrimerParcial.Manejadora.BtnModificarNeumaticoBDFoto(${neumaticoStr})></td>`;
              tablaStr += `<td> <input type="button" value="Eliminar" class="btn btn-danger" onclick=PrimerParcial.Manejadora.BorrarNeumaticoBDFoto(${neumaticoStr})></td>`;
            }
            tablaStr += `</tr>`;
          });
  
          tablaStr += `</tbody>`;
          tablaStr += `</table>`;
          contenerdorTabla.innerHTML = tablaStr;
  
        }
      };
  
      xhttp.send();
    }
  

  // IMPLEMENTACION INTERFACE IPARTE2
  
  // EliminarNeumatico. Recibe como parámetro al objeto JSON que se ha de eliminar. Pedir confirmación,
  // mostrando la marca y las medidas, antes de eliminar.
  // Si se confirma se invocará (por AJAX) a “./BACKEND/eliminarNeumaticoBD.php” pasándole cómo parámetro
  // neumatico_json (id, marca, medidas y precio, en formato de cadena JSON) por POST y se deberá borrar el neumático de la base de
  // datos (invocando al método eliminar).
  // Si se pudo borrar en la base de datos, invocar al método guardarJSON y pasarle './BACKEND/archivos/neumaticos_eliminados.json'
  // cómo parámetro.
  // Retornar un JSON que contendrá: éxito(bool) y mensaje(string) indicando lo acontecido.
  // Informar por consola y alert lo acontecido. Refrescar el listado para visualizar los cambios.

    EliminarNeumatico(obj: any) :void {}

    public static EliminarNeumatico(obj: any) :void {

        let confirmacion = confirm(`Desea eliminar el neumatico con marca "${obj.marca}" y medidas ${obj.medidas}" ?`);

        if (confirmacion) {

            xhttp.open("POST", "./BACKEND/eliminarNeumaticoBD.php", true);

            let neumatico = new Entidades.NeumaticoBD(obj.marca, obj.medidas, obj.precio, obj.id);

            let form: FormData = new FormData();

            form.append("neumatico_json", neumatico.ToJSON());

            xhttp.send(form);

            xhttp.onreadystatechange = () => {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    let respuesta = JSON.parse(xhttp.responseText);
                    console.log(respuesta.mensaje);
                    alert(respuesta.mensaje);
                    Manejadora.MostrarNeumaticosBD(1);
                }
            };

        }

    }


    // ModificarNeumatico. Mostrará todos los datos del neumático que recibe por parámetro (objeto JSON), en el
    // formulario, de tener foto, incluirla en “imgFoto”. Permitirá modificar cualquier campo, a excepción del id.
    // Al pulsar el botón Modificar sin foto (de la página) se invocará (por AJAX) a
    // “./BACKEND/modificarNeumaticoBD.php” Se recibirán por POST los siguientes valores: neumatico_json (id, marca,
    // medidas, y precio, en formato de cadena JSON) para modificar un neumático en la base de datos. Invocar al método modificar.
    // Nota: El valor del id, será el id del neumático 'original', mientras que el resto de los valores serán los del neumático a ser modificado.
    // Se retornará un JSON que contendrá: éxito(bool) y mensaje(string) indicando lo acontecido.
    // Refrescar el listado solo si se pudo modificar, caso contrario, informar (por alert y consola) de lo acontecido.

ModificarNeumatico(): void {}

public static ModificarNeumaticoBDSinFoto(): void {

    const inpId = <HTMLInputElement>document.getElementById("idNeumatico");
    const inpMarca = <HTMLInputElement>document.getElementById("marca");
    const inpMedidas = <HTMLInputElement>document.getElementById("medidas");
    const inpPrecio = <HTMLInputElement>document.getElementById("precio");
    const inpFoto = <HTMLImageElement>document.getElementById("imgFoto");

    let id: number = parseInt(inpId.value);
    let marca: string = inpMarca.value;
    let medidas: string = inpMedidas.value;
    let precio: number = parseInt(inpPrecio.value);

    const Neumatico = {
        id: id,
        marca: marca,
        medidas: medidas,
        precio: precio,
      };

    xhttp.open("POST", "./BACKEND/modificarNeumaticoBD.php", true);

    let form: FormData = new FormData();

    form.append("neumatico_json", JSON.stringify(Neumatico));

    xhttp.send(form);

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        let respuesta = JSON.parse(xhttp.responseText);

        if (respuesta.exito) {
          Manejadora.MostrarNeumaticosBD(1);
        }

        console.log(respuesta.mensaje);
        alert(respuesta.mensaje);

        inpId.value = "";
        inpMarca.value = "";
        inpMedidas.value = "";
        inpPrecio.value = "";
        inpFoto.src = "./neumatico_default.jfif";
      }
    };
  }

  public static BtnModificarNeumatico(obj: any): void {
    (<HTMLInputElement>document.getElementById("idNeumatico")).value = obj.id;
    (<HTMLInputElement>document.getElementById("marca")).value = obj.marca;
    (<HTMLInputElement>document.getElementById("medidas")).value = obj.medidas;
    (<HTMLInputElement>document.getElementById("precio")).value = obj.precio;
    const img = <HTMLImageElement>document.getElementById("imgFoto");
    if (img) {
      img.src = "./BACKEND" + obj.pathFoto;
    }
  }

      // // IMPLEMETACION INTERFACE IPARTE3

      // VerificarNeumaticoBD. Se recupera la marca y las medidas del neumático desde la página neumatico_BD.html
      // y se invoca (por AJAX) a “./BACKEND/verificarNeumaticoBD.php” que recibe por POST el parámetro obj_neumatico,
      // que será una cadena JSON (marca y medidas), si coincide con algún registro de la base de datos (invocar al método traer) retornará
      // los datos del objeto (invocar al toJSON). Caso contrario, un JSON vacío ({}).
      // Informar por consola lo acontecido y mostrar el objeto recibido en la página (div id='divInfo').

    VerificarNeumaticoBD() :void { }

    public static VerificarNeumaticoBD() :void {

        let marca: string = (<HTMLInputElement>document.getElementById("marca")).value;
        let medidas: string = (<HTMLInputElement>document.getElementById("medidas")).value;

        let neumatico = new Entidades.NeumaticoBD(marca, medidas);

        xhttp.open("POST", "./BACKEND/verificarNeumaticoBD.php", true);

        let form: FormData = new FormData();

        console.log(neumatico);

        form.append("obj_neumatico", neumatico.ToJSON());

        xhttp.send(form);

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                let respuesta = JSON.parse(xhttp.responseText);
    
                const contenerdorInfo: HTMLDivElement = <HTMLDivElement>document.getElementById("divInfo");   

                contenerdorInfo.innerText = xhttp.responseText;
        
                console.log(respuesta);
            }
        }
    }

  
//     AgregarNeumaticoFoto. Obtiene la marca, las medidas, el precio y la foto desde la página neumatico_BD.html
// y se enviará (por AJAX) hacia “./BACKEND/agregarNeumaticoBD.php” que recibirá por POST, la marca, las medidas, el
// precio y la foto para registrar un neumático en la base de datos.
// Verificar la previa existencia del neumático invocando al método existe.
// Se le pasará como parámetro el array que retorna el método traer. Si el neumático ya existe en la base de datos, se retornará un
// mensaje que indique lo acontecido. Si el neumático no existe, se invocará al método agregar. La imagen se guardará en
// “./neumaticos/imagenes/”, con el nombre formado por el marca punto hora, minutos y segundos del alta (Ejemplo:
// pirelli.105905.jpg).
// Se retornará un JSON que contendrá: éxito(bool) y mensaje(string) indicando lo acontecido.
// Informar por consola y alert el mensaje recibido. Refrescar el listado de neumáticos reutilizando el método
// MostrarNeumaticosBD.
      AgregarNeumaticoBDFoto(): void {}

      public static AgregarNeumaticoBDFoto(): void {

        let marca: string = (<HTMLInputElement>document.getElementById("marca")).value;
        let medidas: string = (<HTMLInputElement>document.getElementById("medidas")).value;
        let precio: string = (<HTMLInputElement>document.getElementById("precio")).value;
        let foto: any = (<HTMLInputElement>document.getElementById("foto"));
  
        xhttp.open("POST", "./BACKEND/AgregarNeumaticoBD.php", true);
  
        let form: FormData = new FormData();

        form.append("marca", marca);
        form.append("medidas", medidas);
        form.append("precio", precio);
        form.append("foto", foto.files[0]);
  
        xhttp.setRequestHeader("enctype", "multipart/form-data");
  
        xhttp.send(form);
  
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            let respuesta = JSON.parse(xhttp.responseText);
            console.log(respuesta.mensaje);
            alert(respuesta.mensaje);
            Manejadora.MostrarNeumaticosBD(2);
          }
        };
      }


      // BorrarNeumaticoFoto. Recibe como parámetro al objeto JSON que se ha de eliminar. Pedir confirmación,
      // mostrando marca y medidas, antes de eliminar.
      // Si se confirma se invocará (por AJAX) a “./BACKEND/eliminarNeumaticoBDFoto.php” que recibe el parámetro
      // neumatico_json (id, marca, medidas, precio y pathFoto en formato de cadena JSON) por POST. Se deberá borrar el neumático
      // (invocando al método eliminar). Si se pudo borrar en la base de datos, invocar al método guardarEnArchivo.
      // Retornar un JSON que contendrá: éxito(bool) y mensaje(string) indicando lo acontecido.
      // Informar por consola y alert lo acontecido. Refrescar el listado para visualizar los cambios.

      BorrarNeumaticoBDFoto(obj: any) :void {}
  
      public static BorrarNeumaticoBDFoto(obj: any): void {
        let confirmacion = confirm(`Esta seguro de eliminar al neumatico, marca: ${obj.marca} y medidas: ${obj.medidas} ?`);

        if (confirmacion) {
          xhttp.open("POST", "./BACKEND/eliminarNeumaticoBDFoto.php", true);
  
          let form: FormData = new FormData();

          form.append("neumatico_json", JSON.stringify(obj));

          xhttp.send(form);
  
          xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
              let respuesta = JSON.parse(xhttp.responseText);
              console.log(respuesta.mensaje);
              alert(respuesta.mensaje);
              Manejadora.MostrarNeumaticosBD(2);
            }
          };
        }
      }

      // ModificarNeumaticoBDFoto. Mostrará todos los datos del neumático que recibe por parámetro (objeto JSON),
      // en el formulario, de tener foto, incluirla en “imgFoto”. Permitirá modificar cualquier campo (incluyendo la
      // foto), a excepción del id.
      // Al pulsar el botón Modificar (de la página) se invocará (por AJAX) a
      // “./BACKEND/modificarNeumaticoBDFoto.php” dónde se recibirán por POST los siguientes valores: neumatico_json (id,
      // marca, medidas y precio, en formato de cadena JSON) y la foto (para modificar un neumático en la base de datos). Invocar al método
      // modificar.
      // Nota: El valor del id, será el id del neumático 'original', mientras que el resto de los valores serán los del neumático a ser modificado.
      // Si se pudo modificar en la base de datos, la foto original del registro modificado se moverá al subdirectorio
      // “./neumaticosModificados/”, con el nombre formado por el id punto marca punto 'modificado' punto hora, minutos y segundos de la
      
      // modificación (Ejemplo: 987.fateo.modificado.105905.jpg). Se retornará un JSON que contendrá: éxito(bool) y mensaje(string)
      // indicando lo acontecido.
      // Refrescar el listado solo si se pudo modificar, caso contrario, informar (por alert y consola) de lo acontecido.
      
      ModificarNeumaticoBDFoto() :void {

      }

      public static ModificarNeumaticoBDFoto(): void {

        const inpId = <HTMLInputElement>document.getElementById("idNeumatico");
        const inpMarca = <HTMLInputElement>document.getElementById("marca");
        const inpMedidas = <HTMLInputElement>document.getElementById("medidas");
        const inpPrecio = <HTMLInputElement>document.getElementById("precio");
        const inpFoto = <HTMLImageElement>document.getElementById("imgFoto");
        let foto: any = <HTMLInputElement>document.getElementById("foto");
  
        let id: number = parseInt(inpId.value);
        let marca: string = inpMarca.value;
        let medidas: string = inpMedidas.value;
        let precio: number = parseInt(inpPrecio.value);

        const NeumaticoBD = {
          id: id,
          marca: marca,
          medidas: medidas,
          precio: precio,
        };
  
        xhttp.open("POST", "./BACKEND/modificarNeumaticoBDFoto.php", true);
  
        let form: FormData = new FormData();

        form.append("neumatico_json", JSON.stringify(NeumaticoBD));

        form.append("foto", foto.files[0]);

        xhttp.setRequestHeader("enctype", "multipart/form-data");

        xhttp.send(form);
  
        xhttp.onreadystatechange = () => {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            let respuesta = JSON.parse(xhttp.responseText);
            if (respuesta.exito) {
              Manejadora.MostrarNeumaticosBD(2);
            } else {
              console.log(respuesta.mensaje);
              alert(respuesta.mensaje);
            }
            inpId.value = "";
            inpMarca.value = "";
            inpMedidas.value = "";
            inpPrecio.value = "";
            inpFoto.innerText = "";
            //inpFoto.src = "./";
          }
        };
      }
  
      public static BtnModificarNeumaticoBDFoto(obj: any): void {
        (<HTMLInputElement>document.getElementById("idNeumatico")).value = obj.id;
        (<HTMLInputElement>document.getElementById("marca")).value = obj.marca;
        (<HTMLInputElement>document.getElementById("medidas")).value = obj.medidas;
        (<HTMLInputElement>document.getElementById("precio")).value = obj.precio;
        const img = <HTMLImageElement>document.getElementById("imgFoto");
        img.src = "./BACKEND" + obj.pathFoto;
      }

      MostrarBorradosJSON2() : void {
        
      }

      public static MostrarBorradosJSON() {

        xhttp.open("GET", "./BACKEND/MostrarBorradosJSON.php", true);

        xhttp.onreadystatechange = () => {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            let respuesta: string = xhttp.responseText;
            let productosJson = JSON.parse(respuesta);
            const contenerdorInfo: HTMLDivElement = <HTMLDivElement>document.getElementById("divInfo");
            contenerdorInfo.innerHTML ="<h4>BORRADOS</h4>" + respuesta;
            console.log(productosJson);
          }
        };
        
        xhttp.send();
      }



      MostrarFotosModificados2() : void {

      }

      public static MostrarFotosModificados() {

        xhttp.open("GET", "./BACKEND/MostrarFotosDeModificados.php", true);

        xhttp.onreadystatechange = () => {
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            let respuesta: string = xhttp.responseText;
            const contenerdorInfo: HTMLDivElement = <HTMLDivElement>document.getElementById("divTabla");
            contenerdorInfo.innerHTML = "<h4>MODIFICADAS</h4>" + respuesta;
          }
        };

        xhttp.send();
      }

}

}