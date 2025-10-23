// Archivo JavaScript principal

// Global Variables
let currentStep = 0;
let cart = [];
let products = [
    {
        id: 1,
        nombre: "Laptop Profesional",
        precio: 1999,
        imagen: "img/laptop-7334774_1920.jpg",
        descripcion: "Laptop de alta gama para profesionales"
    },
    {
        id: 2,
        nombre: "Teclado Mecánico",
        precio: 120,
        imagen: "img/keyboard-7386244_1920.jpg",
        descripcion: "Teclado mecánico para gaming"
    },
    {
        id: 3,
        nombre: "Auriculares Inalámbricos",
        precio: 75,
        imagen: "img/beats-3273952_1920.jpg",
        descripcion: "Auriculares con cancelación de ruido"
    },
    {
        id: 4,
        nombre: "Monitor UltraWide",
        precio: 490,
        imagen: "img/Monitor UltraWide-2557299_1920.jpg",
        descripcion: "Monitor ultrawide para productividad"
    },
    {
        id: 5,
        nombre: "Mouse Ergonómico",
        precio: 60,
        imagen: "img/Mouse-2341642_1920.jpg",
        descripcion: "Mouse ergonómico inalámbrico"
    },
    {
        id: 6,
        nombre: "Silla Gamer",
        precio: 300,
        imagen: "img/chair gamer-7862491.jpg",
        descripcion: "Silla ergonómica para gaming"
    },
    {
        id: 7,
        nombre: "Webcam HD",
        precio: 85,
        imagen: "img/web-cam-796227_1920.jpg",
        descripcion: "Webcam 1080p para videoconferencias"
    },
    {
        id: 8,
        nombre: "Impresora Multifunción",
        precio: 245,
        imagen: "img/printer-1516578_1920.jpg",
        descripcion: "Impresora multifunción a color"
    }
];

let adminProducts = [
    { id: 1, nombre: "Camiseta", precio: 149.99 },
    { id: 2, nombre: "Pantalón", precio: 229.50 }
];


// Page Navigation
function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.add('d-none');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.remove('d-none');
        targetPage.classList.add('fade-in');
        
        // Load page-specific content
        switch(pageName) {
            case 'catalogo':
                loadProducts();
                break;
            case 'carrito':
                initCheckout();
                break;
            case 'admin':
                loadAdminProducts();
                break;
        }
    }
    
    // Update navbar active state
    updateNavbar(pageName);
}

function updateNavbar(activePage) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
}

// Product Functions
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-3 mb-4';
    
    col.innerHTML = `
        <div class="card product-card h-100">
            <img src="${product.imagen}" class="card-img-top product-image" alt="${product.nombre}">
            <div class="card-body text-center">
                <h5 class="card-title">${product.nombre}</h5>
                <p class="text-primary fw-bold">$${product.precio}</p>
                <button class="btn btn-warning" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart me-2"></i>Agregar
                </button>
            </div>
        </div>
    `;
    
    return col;
}

function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm)
    );
    
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="col-12 text-center text-muted">No se encontraron productos.</div>';
    } else {
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsGrid.appendChild(productCard);
        });
    }
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.cantidad++;
        } else {
            cart.push({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen,
                cantidad: 1
            });
        }
        updateCartCount();
        showPage('carrito');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    if (currentStep === 0) {
        loadCartStep();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
    cartCount.textContent = totalItems;
}

// Checkout Functions
function initCheckout() {
    currentStep = 0;
    updateStepper();
    loadCartStep();
    updateCheckoutButtons();
}

function loadCartStep() {
    const content = document.getElementById('checkout-content');
    
    if (cart.length === 0) {
        content.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h3 class="text-muted">No hay artículos en el carrito</h3>
                <button class="btn btn-primary mt-3" onclick="showPage('catalogo')">
                    Ver Catálogo
                </button>
            </div>
        `;
        return;
    }
    
    let cartHTML = '<h3 class="h5 fw-bold mb-4 text-center">Resumen del carrito</h3>';
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        cartHTML += `
            <div class="cart-item d-flex align-items-center">
                <img src="${item.imagen}" class="cart-item-image me-3" alt="${item.nombre}">
                <div class="flex-grow-1">
                    <h6 class="fw-semibold">${item.nombre}</h6>
                    <small class="text-muted">Precio: $${item.precio}</small><br>
                    <small class="text-muted">Cantidad: ${item.cantidad}</small>
                </div>
                <div class="text-end">
                    <div class="fw-bold text-primary">$${subtotal.toFixed(2)}</div>
                    <button class="btn btn-sm btn-outline-danger mt-1" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
        <div class="mt-4 p-3 bg-light rounded">
            <div class="d-flex justify-content-between">
                <strong>Total: $${total.toFixed(2)}</strong>
            </div>
        </div>
    `;
    
    content.innerHTML = cartHTML;
}

function loadDataStep() {
    const content = document.getElementById('checkout-content');
    content.innerHTML = `
        <h3 class="h5 fw-bold mb-4 text-center">Datos de Entrega</h3>
        <form id="checkout-form">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Nombre completo</label>
                    <input type="text" class="form-control" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" required>
                </div>
                <div class="col-12 mb-3">
                    <label class="form-label">Dirección</label>
                    <input type="text" class="form-control" required>
                </div>
                <div class="col-12 mb-3">
                    <label class="form-label">Correo electrónico</label>
                    <input type="email" class="form-control" required>
                </div>
            </div>
        </form>
    `;
}

function loadConfirmStep() {
    const content = document.getElementById('checkout-content');
    content.innerHTML = `
        <h3 class="h5 fw-bold mb-4 text-center">Confirmación</h3>
        <p class="text-center text-muted mb-4">
            Revisa que toda la información sea correcta y confirma tu compra.
        </p>
        <div class="text-center">
            <button class="btn btn-outline-secondary me-3" onclick="goToStep(0)">
                Modificar Pedido
            </button>
            <button class="btn btn-success" onclick="confirmPurchase()">
                Confirmar Compra
            </button>
        </div>
    `;
}

function nextStep() {
    if (currentStep < 2) {
        currentStep++;
        updateStepper();
        loadCurrentStep();
        updateCheckoutButtons();
    }
}

function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        updateStepper();
        loadCurrentStep();
        updateCheckoutButtons();
    }
}

function goToStep(step) {
    currentStep = step;
    updateStepper();
    loadCurrentStep();
    updateCheckoutButtons();
}

function loadCurrentStep() {
    switch(currentStep) {
        case 0:
            loadCartStep();
            break;
        case 1:
            loadDataStep();
            break;
        case 2:
            loadConfirmStep();
            break;
    }
}

function updateStepper() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function updateCheckoutButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (currentStep === 0) {
        prevBtn.classList.add('d-none');
    } else {
        prevBtn.classList.remove('d-none');
    }
    
    if (currentStep === 2) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
        nextBtn.disabled = (currentStep === 0 && cart.length === 0);
    }
}

function confirmPurchase() {
    alert('¡Compra confirmada! Gracias por tu pedido.');
    cart = [];
    updateCartCount();
    showPage('home');
}

// Admin Functions
function loadAdminProducts() {
    const tableBody = document.getElementById('productos-admin-table');
    tableBody.innerHTML = '';
    
    adminProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.nombre}</td>
            <td>$${product.precio.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2" onclick="editProduct(${product.id})">
                    Editar
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})">
                    Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editProduct(id) {
    alert('Función de editar producto (ID: ' + id + ')');
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        adminProducts = adminProducts.filter(p => p.id !== id);
        loadAdminProducts();
    }
}

// Form Handlers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
    showPage('home');
    updateCartCount();
    
    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Funcionalidad de login');
        });
    }
    
    // Registro form handler
    const registroForm = document.getElementById('registro-form');
    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Funcionalidad de registro');
        });
    }
    
    // Admin product form handler
    const productoForm = document.getElementById('producto-form');
    if (productoForm) {
        productoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('producto-nombre').value;
            const descripcion = document.getElementById('producto-descripcion').value;
            const precio = parseFloat(document.getElementById('producto-precio').value);
            const imagen = document.getElementById('producto-imagen').value;
            
            const newId = Math.max(...adminProducts.map(p => p.id)) + 1;
            adminProducts.push({
                id: newId,
                nombre: nombre,
                precio: precio
            });
            
            // Add to main products catalog too
            products.push({
                id: products.length + 1,
                nombre: nombre,
                precio: precio,
                imagen: imagen || 'https://via.placeholder.com/400x300',
                descripcion: descripcion
            });
            
            loadAdminProducts();
            productoForm.reset();
            alert('Producto agregado exitosamente');
        });
    }
});


