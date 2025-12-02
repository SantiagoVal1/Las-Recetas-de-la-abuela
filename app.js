const PRODUCTS_KEY = 'productos_abuelita';
const CART_KEY = 'carrito_abuelita';

const defaultProducts = [
  {
    id: 'p1',
    title: 'Mermelada de Fresa Casera',
    price: 8500,
    img: '../assets/mermelada.jpg',
    desc: 'Mermelada hecha con fresas locales y receta secreta de la abuela.'
  },
  {
    id: 'p2',
    title: 'Arequipe Artesanal',
    price: 7000,
    img: '../assets/arequipe.jpg',
    desc: 'Arequipe Artesanal hecho con ingredientes naturales y mucho amor.'
  },
  {
    id: 'p3',
    title: 'Sazonador de la Abuela',
    price: 5500,
    img: '../assets/sazonador.jpg',
    desc: 'Mezcla de especias para darle sabor casero a tus comidas.'
  },
  {
    id: 'p4',
    title: 'Galletas de Mantequilla',
    price: 4000,
    img: '../assets/galletas-mantequilla.jpg',
    desc: 'Crujientes y suaves, hechas con mantequilla real como se hacía antes.'
  }
];

// ✅ NUEVA función para formatear COP
function formatCOP(value){
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
}

// utils
function uid(prefix='p'){
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}
function saveProducts(arr){ localStorage.setItem(PRODUCTS_KEY, JSON.stringify(arr)) }
function loadProducts(){ 
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if(!raw) { saveProducts(defaultProducts); return defaultProducts.slice() }
  try { return JSON.parse(raw) } catch{ return defaultProducts.slice() }
}
function saveCart(obj){ localStorage.setItem(CART_KEY, JSON.stringify(obj)) }
function loadCart(){ const raw = localStorage.getItem(CART_KEY); if(!raw) return {}; try{return JSON.parse(raw)}catch{return {}} }

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('anio').textContent = new Date().getFullYear();
  renderCatalog();
  updateCartCount();
});

// Render
function renderCatalog(){
  const container = document.querySelector('#catalogo');
  if(!container) return;
  container.innerHTML = '';
  const products = loadProducts();
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" loading="lazy" />
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="actions">
        <div class="price">${formatCOP(Number(p.price))}</div>
        <div>
          <button class="btn btn-ghost" onclick="viewProduct('${p.id}')">Ver</button>
          <button class="btn btn-primary" onclick="addToCart('${p.id}')">Agregar</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// simple view (alert)
function viewProduct(id){
  const p = loadProducts().find(x => x.id === id);
  if(!p) return alert('Producto no encontrado');
  alert(`${p.title}\n\n${p.desc}\n\nPrecio: ${formatCOP(Number(p.price))}`);
}

// add to cart
function addToCart(id){
  const cart = loadCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  updateCartCount();
  // feedback
  const p = loadProducts().find(x => x.id === id);
  if(p) {
    showToast(`Añadido: ${p.title}`);
  } else {
    showToast('Producto añadido');
  }
}

function updateCartCount(){
  const cart = loadCart();
  const count = Object.values(cart).reduce((s,n)=> s+n, 0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = count;
  const link = document.getElementById('carrito-link');
  if(link) link.href = 'carrito.html';
}

// small toast
function showToast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.bottom = '18px';
  t.style.right = '18px';
  t.style.background = 'var(--accent)';
  t.style.color = 'white';
  t.style.padding = '10px 14px';
  t.style.borderRadius = '10px';
  t.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
  t.style.zIndex = 9999;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 1800);
}

// Expose functions to global (so onclick inline works)
window.addToCart = addToCart;
window.viewProduct = viewProduct;
window.renderCatalog = renderCatalog;

