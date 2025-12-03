/* pago.js - prepara resumen del pedido y simula el pago */
const CART_KEY = 'carrito_abuelita';
const PRODUCTS_KEY = 'productos_abuelita';

function loadCart(){ const raw = localStorage.getItem(CART_KEY); if(!raw) return {}; try{return JSON.parse(raw)}catch{return {}} }
function loadProducts(){ const raw = localStorage.getItem(PRODUCTS_KEY); if(!raw) return []; try{return JSON.parse(raw)}catch{return []} }

document.addEventListener('DOMContentLoaded', ()=>{
  renderSummary();
  document.getElementById('paymentForm').addEventListener('submit', e=>{
    e.preventDefault();
    simulatePayment();
  });
});

function renderSummary(){
  const cart = loadCart();
  const products = loadProducts();
  const ids = Object.keys(cart);
  const container = document.getElementById('order-summary');
  if(ids.length === 0){ container.innerHTML = '<p>Carrito vacío. <a href="index.html">Ir al catálogo</a></p>'; return; }

  let total = 0;
  const ul = document.createElement('div');
  ids.forEach(id => {
    const q = cart[id];
    const p = products.find(x => x.id===id) || {title:'Producto eliminado', price:0};
    const subtotal = (Number(p.price) || 0) * q;
    total += subtotal;
    const line = document.createElement('div');
    line.style.display='flex';
    line.style.justifyContent='space-between';
    line.style.padding='6px 0';
    line.innerHTML = `<div>${p.title} x ${q}</div><div>$${subtotal.toFixed(2)}</div>`;
    ul.appendChild(line);
  });
  const hr = document.createElement('hr');
  hr.style.margin='10px 0';
  const tot = document.createElement('div');
  tot.style.fontWeight='900';
  tot.style.textAlign='right';
  tot.textContent = `Total: $${total.toFixed(2)}`;
  container.innerHTML = '';
  container.appendChild(ul);
  container.appendChild(hr);
  container.appendChild(tot);
}

function simulatePayment(){
  const name = document.getElementById('name').value.trim();
  const address = document.getElementById('address').value.trim();
  if(!name || !address) return alert('Completa nombre y dirección.');

  // Simulación: limpiar carrito y mostrar confirmación
  localStorage.removeItem(CART_KEY);
  alert(`Pago simulado exitoso. \nGracias ${name}.\nTu pedido será preparado y enviado a: ${address}`);
  window.location.href = 'index.html';
}
