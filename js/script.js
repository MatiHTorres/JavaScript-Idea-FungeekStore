
fetch("./js/productos.json")
    .then(response => response.json())
    .then(productos => miPrograma(productos))
    .catch(error => console.log(error))

function miPrograma(productos) {

    //* Array carrito
    let carrito = []

    //* Variables
    let contador = 0;
    let catalogo = document.getElementById("catalogoProductos")
    let contCarrito = document.getElementById("contenedorCarrito")
    let botonCatalogo = document.getElementById("btnCatalogo")
    let contadorCarrito = document.getElementById("numCarrito")
    let buscar = document.getElementById("buscador")
    let btnVaciar = document.getElementById("botonVaciar")
    let mostrar = document.getElementById("verCarrito")
    let divCarro = document.getElementById("carro")
    



    //*Eventos
    mostrar.addEventListener("click", mostrarCarrito)
    botonCatalogo.onclick = () => renderizarCatalogo(productos)
    buscar.addEventListener("input", filtrar)
    btnVaciar.addEventListener("click", vaciarCarrito)
    

    //* Si encuentra la key carrito en el localStorage , lo parsea a Json , creando un array carrito con el value guardado en localstorage
    if (localStorage.getItem("carrito")) {
        carrito = JSON.parse(localStorage.getItem("carrito"))
    }
    if (localStorage.getItem("cont")) {
        contador = JSON.parse(localStorage.getItem("cont"))
    }

    //* Renderizo el catalogo
    renderizarCatalogo(productos)
    //* Renderizo el carrito , si es que tiene contenido en localStorage , ya parseado , se renderiza
    renderizarCarrito(carrito)
    contadorCarrito.innerHTML = `${carrito.length + contador}`

    //* Funciones
    function renderizarCatalogo(array) {
        catalogo.innerHTML = ""
        for (const producto of array) {
            let tarjetaProducto = document.createElement("div")
            tarjetaProducto.className = "tarjeta"

            tarjetaProducto.innerHTML = `
        <h3><strong>°${producto.id} - ${producto.nombre}</strong></h3>
        <p><strong>Quedan:</strong> ${producto.stock} unidades</p>
        <p><strong>Precio:</strong> $${producto.precio}</p>
        <p><strong>Serie:</strong> ${producto.serie}</p>
        <p><strong>Categoria:</strong> ${producto.categoria}</p>
        <img src=${producto.imgUrl}>
        <button class="btnAgregar" id=${producto.id}>Añadir al carrito</button>`
            catalogo.append(tarjetaProducto)
        }
        let botonAgregar = document.getElementsByClassName("btnAgregar")
        for (const boton of botonAgregar) {
            boton.addEventListener("click", agregarCarrito)
        }
    }

    function agregarCarrito(e) {
        let encontrarProducto = productos.find(producto => producto.id == e.target.id) //* Guardo el objeto coincidente segun ID
        let posProductoBuscado = carrito.findIndex(producto => producto.id == e.target.id) //* Guardo la posicion si encuentra el producto , si no lo encuentra guarda -1
        if (posProductoBuscado != -1) { //* Se ejecuta SI es que se ENCONTRO el producto con findIndex
            carrito[posProductoBuscado].unidades++ //* aumento en 1 , el contador de unidades
            carrito[posProductoBuscado].subtotal = carrito[posProductoBuscado].unidades * carrito[posProductoBuscado].precio //* subtotal multiplica las unidades * precio
            encontrarProducto.stock--
            renderizarCatalogo(productos)
            contador++
            contadorCarrito.innerHTML = `${carrito.length + contador}`

        } else {
            carrito.push({ id: encontrarProducto.id, nombre: encontrarProducto.nombre, precio: encontrarProducto.precio, unidades: 1, subtotal: encontrarProducto.precio, imgUrl: encontrarProducto.imgUrl })
            encontrarProducto.stock--
            renderizarCatalogo(productos)
            contadorCarrito.innerHTML = `${carrito.length + contador}`
        }
        Toastify({
            text: "Producto Agregado Correctamente",
            duration: 1500,
            style: {
                background: "linear-gradient(to right,#38b000,#619b8a)",
            }
        }).showToast();

        //* Seteo un key como carrito y le doy el value , del array carrito como string con stringify (luego hay que parsear a JSON para que vuelva a ser un array)
        localStorage.setItem("carrito", JSON.stringify(carrito))
        localStorage.setItem("cont", JSON.stringify(contador))
        renderizarCarrito(carrito)

    }

    function renderizarCarrito(array) {
        contCarrito.innerHTML = ""
        for (const producto of array) {
            let tarjetaCarrito = document.createElement("div")
            tarjetaCarrito.className = "tarjetaCarrito"

            tarjetaCarrito.innerHTML = `
        <h3><strong>${producto.nombre}</strong></h3>
        <p><strong>Precio:</strong> $${producto.precio}</p>
        <p><strong>Unidades:</strong> ${producto.unidades}</p>
        <p><strong>Subtotal:</strong> $${producto.subtotal}</p>
        <img src=${producto.imgUrl}>
        <button class="btnBorrar" id=${producto.id}>❌</button>
        
        `
            contCarrito.appendChild(tarjetaCarrito)
        }

        let total = carrito.reduce((acumulador, valorActual) => acumulador + valorActual.subtotal, 0)
        contCarrito.innerHTML += `
                                <div id="total">
                                    <h1>Total a Pagar: $${total}</h1>
                                    <button id="comprar">REALIZAR COMPRA</button>
                                </div>
                                `
        //* Contador total , suma subtotal a un acumulador 

        let botonBorrar = document.getElementsByClassName("btnBorrar")
        for (const boton of botonBorrar) {
            boton.addEventListener("click", eliminarProducto)
        }

        let btncomprar = document.getElementById("comprar")
        btncomprar.addEventListener("click", realizarCompra)
    }

    function eliminarProducto(e) {

        let encontrarProducto = productos.find(producto => producto.id == e.target.id)
        console.log(encontrarProducto.id)

        let posProductoBuscado = carrito.findIndex(producto => producto.id == e.target.id)
        console.log(posProductoBuscado)

        if (posProductoBuscado != -1) {
            if (carrito[posProductoBuscado].unidades >= 2) {
                carrito[posProductoBuscado].unidades--
                carrito[posProductoBuscado].subtotal = carrito[posProductoBuscado].subtotal - carrito[posProductoBuscado].precio
                localStorage.setItem("carrito", JSON.stringify(carrito))
                contador--
                encontrarProducto.stock++
                renderizarCatalogo(productos)
                contadorCarrito.innerHTML = `${carrito.length + contador}`
                localStorage.setItem("cont", JSON.stringify(contador))
            }
            else {
                encontrarProducto.stock++
                renderizarCatalogo(productos)
                carrito.splice(posProductoBuscado, 1)
                localStorage.setItem("carrito", JSON.stringify(carrito))
                contadorCarrito.innerHTML = `${carrito.length + contador}`
                localStorage.setItem("cont", JSON.stringify(contador))
            }
        }

        Toastify({
            text: "Producto Eliminado Correctamente",
            duration: 1500,
            style: {
                background: "linear-gradient(to right,#9b2226,#d62828)",
            }
        }).showToast();

        contCarrito.innerHTML = ""
        renderizarCarrito(carrito)
    }

    function filtrar() {
        let productosFiltrados = productos.filter(producto => producto.nombre.toLowerCase().includes(buscar.value.toLowerCase()) || producto.categoria.toLowerCase().includes(buscar.value.toLowerCase()))
        renderizarCatalogo(productosFiltrados)
    }

    function vaciarCarrito() {

        if (carrito.length === 0) {
            Swal.fire({
                text: 'Error , El carrito está vacio.',
                icon: 'error',
                timer: 1600,
            })
        } else {
            Swal.fire({
                title: 'Quieres vaciar el carrito?',
                text: "Se eliminaran todos los productos agregados.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Si , Vaciar!'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        text: 'Carrito vaciado correctamente.',
                        icon: 'success',
                        timer: 1600,

                    })

                    carrito = []
                    contCarrito.innerHTML = `
            <div id="total"><h1>Total a Pagar: $0</h1></div>
            `
                    localStorage.clear();
                    contadorCarrito.innerHTML = `${carrito.length}`
                }
            })
        }
    }

    function realizarCompra(){
        if (carrito.length === 0) {
            Swal.fire({
                text: 'Error , agrege productos para realizar la compra.',
                icon: 'error',
                timer: 2000,
            })
        } else {
            Swal.fire({
                title: 'Confirmar compra?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Gracias por comprar en fungeek store , vuelta pronto!',
                        text: 'Compra realizada correctamente.',
                        icon: 'success',
                        timer: 3000,

                    })

                    carrito = []
                    contCarrito.innerHTML = `
                    <div id="total"><h1>Total a Pagar: $0</h1></div>
                    `
                    localStorage.clear();
                    contadorCarrito.innerHTML = `${carrito.length}`
                }
            })
        }
    }

    divCarro.style.display = "none"
    function mostrarCarrito() {

        if (divCarro.style.display == "none") {
            divCarro.style.display = "block"
        } else {
            divCarro.style.display = "none"
        }
    }
}


