//* Arreglo de productos
const productos = [
    { id: 1, nombre: "Naruto Uzumaki", precio: 7500, serie: "Naruto Shippuden", stock: 30, categoria: "Funko", imgUrl: "./img/FunkoNaruto.jpg" },
    { id: 2, nombre: "Goku SSJ", precio: 10000, serie: "Dragon Ball Z", stock: 35, categoria: "Figura", imgUrl: "./img/FiguraGoku.jpg" },
    { id: 3, nombre: "Nezuko Kamado", precio: 7800, serie: "Kimetsu no Yaiba", stock: 38, categoria: "Funko", imgUrl: "./img/FunkoNezuko.jpg" },
    { id: 4, nombre: "Levi Ackerman", precio: 9200, serie: "Shingeky no kiojin", stock: 16, categoria: "Llavero", imgUrl: "./img/LlaveroFunkoLevi.jpg" },
    { id: 5, nombre: "Tanjiro Kamado", precio: 6500, serie: "Kimetsu no Yaiba", stock: 20, categoria: "Funko", imgUrl: "./img/FunkoTanjiro.jpg" },
    { id: 6, nombre: "Gaara", precio: 8000, serie: "Naruto Shippuden", stock: 15, categoria: "Figura", imgUrl: "./img/FiguraGaara.jpg" },
    { id: 7, nombre: "Daenerys Targaryen", precio: 9600, serie: "Game of Thrones", stock: 32, categoria: "Figura", imgUrl: "./img/FiguraDaenerys.jpg" },
    { id: 8, nombre: "Rick", precio: 10000, serie: "Rick y Morty", stock: 18, categoria: "Llavero", imgUrl: "./img/LlaveroFunkoRick.jpg" },
    { id: 9, nombre: "Eren Jaeger", precio: 9500, serie: "Shingeki no kyojin", stock: 22, categoria: "Figura", imgUrl: "./img/FiguraEren.jpg" },
    { id: 10, nombre: "Jhon Snow", precio: 8800, serie: "Game of Thrones", stock: 26, categoria: "Llavero", imgUrl: "./img/LlaveroFunkoJonSnow.jpg" },
    { id: 11, nombre: "Vegeta", precio: 9200, serie: "Dragon Ball Z", stock: 24, categoria: "Figura", imgUrl: "./img/FiguraVegeta.jpg" },
    { id: 12, nombre: "Morty", precio: 8000, serie: "Rick y Morty", stock: 10, categoria: "Funko", imgUrl: "./img/FunkoMorty.jpg" },
]

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


mostrar.addEventListener("click", mostrarCarrito)

//*Eventos
botonCatalogo.onclick = () => renderizarCatalogo(productos)
buscar.addEventListener("input", filtrar)
btnVaciar.addEventListener("click", vaciarCarrito)


//* Renderizo el catalogo
renderizarCatalogo(productos)

//* Si encuentra la key carrito en el localStorage , lo parsea a Json , creando un array carrito con el value guardado en localstorage
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
}
contador = JSON.parse(localStorage.getItem("cont"))

//* Renderizo el carrito , si es que tiene contenido en localStorage , ya parseado , se renderiza
renderizarCarrito(carrito)
console.log()
contadorCarrito.innerHTML = `${carrito.length+contador}`

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
    console.log(encontrarProducto) //* ALMACENA el OBJETO ENCONTRADO
    let posProductoBuscado = carrito.findIndex(producto => producto.id == e.target.id) //* Guardo la posicion si encuentra el producto , si no lo encuentra guarda -1
    console.log(posProductoBuscado) //* ALMACENA la POSICION si es que encontro un producto de igual ID
    if (posProductoBuscado != -1) { //* Se ejecuta SI es que se ENCONTRO el producto con findIndex
        carrito[posProductoBuscado].unidades++ //* aumento en 1 , el contador de unidades
        carrito[posProductoBuscado].subtotal = carrito[posProductoBuscado].unidades * carrito[posProductoBuscado].precio //* subtotal multiplica las unidades * precio
        encontrarProducto.stock--
        renderizarCatalogo(productos)
        contador++
        contadorCarrito.innerHTML = `${carrito.length+contador}`
        
    } else {
        carrito.push({id: encontrarProducto.id, nombre: encontrarProducto.nombre, precio: encontrarProducto.precio, unidades: 1, subtotal: encontrarProducto.precio, imgUrl: encontrarProducto.imgUrl })
        encontrarProducto.stock--
        renderizarCatalogo(productos)
        contadorCarrito.innerHTML = `${carrito.length+contador}`
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
        <button onClick=eliminarProducto(${producto.id})>❌</button>
        
        `
        contCarrito.appendChild(tarjetaCarrito)
    }

    let total = carrito.reduce((acumulador, valorActual) => acumulador + valorActual.subtotal, 0)
    contCarrito.innerHTML += `
    <div id="total"><h1>Total a Pagar: $${total}</h1></div>
    `
    //* Contador total , suma subtotal a un acumulador 
}

function eliminarProducto(id) {

    let encontrarProducto = productos.find(producto => producto.id == id)
    console.log(encontrarProducto.id)

    let posProductoBuscado = carrito.findIndex(producto => producto.id == id)
    console.log(posProductoBuscado)

    if (posProductoBuscado != -1) {
        if (carrito[posProductoBuscado].unidades >= 2) {
            carrito[posProductoBuscado].unidades--
            carrito[posProductoBuscado].subtotal = carrito[posProductoBuscado].subtotal - carrito[posProductoBuscado].precio
            localStorage.setItem("carrito", JSON.stringify(carrito))
            contador--
            contadorCarrito.innerHTML = `${carrito.length+contador}`
            localStorage.setItem("cont", JSON.stringify(contador))
        }
        else {
            carrito.splice(posProductoBuscado, 1)
            localStorage.setItem("carrito", JSON.stringify(carrito))
            contadorCarrito.innerHTML = `${carrito.length+contador}`
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
            text: 'Error , El carrito está vacio',
            icon: 'error',
            timer: 1600,
        })
    } else {
        Swal.fire({
            title: 'Quieres vaciar el carrito?',
            text: "Se eliminaran todos los productos agregados",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si , Vaciar!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    text: 'Carrito vaciado correctamente',
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

divCarro.style.display = "none"
function mostrarCarrito() {

    if (divCarro.style.display == "none") {
        divCarro.style.display = "block"
    } else {
        divCarro.style.display = "none"
    }
}
