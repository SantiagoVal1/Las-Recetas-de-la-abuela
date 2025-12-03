/* cart.js
 - Maneja el render del carrito, edición de cantidades y total
*/
const CART_KEY = 'carrito_abuelita';
const PRODUCTS_KEY = 'productos_abuelita';

function loadCart(){ const raw = localStorage.getItem(CART_KEY); if(!raw) return {}; try{return JSON.parse(raw)}catch{return {}} }
function saveCart(obj){ localStorage.setItem(CART_KEY, JSON.stringify(obj)); updateCartCount(); }
function loadProducts(){ const raw = localStorage.getItem(PRODUCTS_KEY); if(!raw) return []; try{return JSON.parse(raw)}catch{return []} }

// ✅ función para formatear COP
function formatCOP(value){
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCart();
  document.getElementById('clearCart').addEventListener('click', ()=>{
    if(confirm('¿Quieres vaciar el carrito?')){
      localStorage.removeItem(CART_KEY);
      renderCart();
    }
  });
});

function renderCart(){
  const cart = loadCart();
  const products = loadProducts();
  const list = document.getElementById('cart-list');
  list.innerHTML = '';

  const ids = Object.keys(cart);
  if(ids.length === 0){
    list.innerHTML = '<p>Tu carrito está vacío. Ve al <a href="index.html">catálogo</a> para añadir productos.</p>';
    document.getElementById('total').textContent = 'Total: ' + formatCOP(0);
    updateCartCount();
    return;
  }

  let total = 0;
  ids.forEach(id => {
    const quantity = cart[id];
    const prod = products.find(p => p.id === id) || {title:'Producto eliminado', price:0, img:'assets/default.jpg'};
    const subtotal = (Number(prod.price) || 0) * quantity;
    total += subtotal;

    const item = document.createElement('div');
    item.style.display = 'flex';
    item.style.gap = '12px';
    item.style.alignItems = 'center';
    item.style.padding = '8px 0';
    item.innerHTML = `
      <img src="${prod.img}" alt="${prod.title}" style="width:90px;height:70px;object-fit:cover;border-radius:8px" />
      <div style="flex:1">
        <div style="font-weight:700">${prod.title}</div>
        <div style="color:var(--muted);font-size:14px">${formatCOP(Number(prod.price||0))} c/u</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <button class="btn btn-ghost" onclick="changeQty('${id}', -1)">-</button>
        <div style="min-width:28px;text-align:center">${quantity}</div>
        <button class="btn btn-ghost" onclick="changeQty('${id}', 1)">+</button>
      </div>
      <div style="min-width:110px;text-align:right;font-weight:800">${formatCOP(subtotal)}</div>
      <div><button class="btn btn-ghost" onclick="removeItem('${id}')">Eliminar</button></div>
    `;
    list.appendChild(item);
  });

  document.getElementById('total').textContent = `Total: ${formatCOP(total)}`;
  updateCartCount();
}

function changeQty(id, delta){
  const cart = loadCart();
  if(!cart[id]) return;
  cart[id] += delta;
  if(cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderCart();
}

function removeItem(id){
  const cart = loadCart();
  if(cart[id]){
    delete cart[id];
    saveCart(cart);
    renderCart();
  }
}

function updateCartCount(){
  const cart = loadCart();
  const count = Object.values(cart).reduce((s,n)=> s+n, 0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = count;
}

window.changeQty = changeQty;
window.removeItem = removeItem;
