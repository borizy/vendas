(() => {
"use strict";
const el = (id) => document.getElementById(id);
const money = (value) => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(value);
const safe = (text) => String(text).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
const readList = (key) => {try {const v=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(v)?v:[]}catch{return []}};
let products=[], store={}, cart=readList("aurora-cart-v2"), favorites=readList("aurora-favorites-v2"), activeCategory="", favoritesOnly=false;
function persist(){localStorage.setItem("aurora-cart-v2",JSON.stringify(cart));localStorage.setItem("aurora-favorites-v2",JSON.stringify(favorites))}
const findProduct = id => products.find(p=>p.id===id && p.active!==false);
const items = () => cart.map(c=>({product:findProduct(c.id),qty:Math.min(20,Math.max(1,Number(c.qty)||1))})).filter(x=>x.product);
const subtotal = () => items().reduce((sum,x)=>sum + Math.round(x.product.price*100)*x.qty,0)/100;
function showStatus(text,success=false){const s=el("checkoutStatus");s.textContent=text;s.classList.toggle("success",success)}
function updateCounts(){el("bagCount").textContent=cart.reduce((s,x)=>s+x.qty,0);el("favoritesCount").textContent=favorites.length;}
function renderCategories(){
 const categories=[["Todos","✧"],["Lábios","♡"],["Rosto","✿"],["Olhos","◉"],["Cuidados","❀"],["Acessórios","✦"]].filter(([name])=>name==="Todos"||products.some(p=>p.category===name));
 const box=el("categoryTiles");box.replaceChildren();
 categories.forEach(([name,icon])=>{const b=document.createElement("button");b.type="button";b.className="category-tile"+((activeCategory===(name==="Todos"?"":name))?" active":"");b.innerHTML="<span>"+safe(icon)+"</span>"+safe(name);b.addEventListener("click",()=>{activeCategory=name==="Todos"?"":name;favoritesOnly=false;renderCategories();renderProducts();document.getElementById("catalogo").scrollIntoView({behavior:"smooth"});});box.append(b)});
}
function renderProducts(){
 const search=el("searchInput").value.trim().toLocaleLowerCase("pt-BR"),brand=el("brandSelect").value,sort=el("sortSelect").value;
 let filtered=products.filter(p=>p.active!==false).filter(p=>(!activeCategory||p.category===activeCategory)&&(!brand||p.brand===brand)&&(!favoritesOnly||favorites.includes(p.id))&&(!search||(p.name+" "+p.brand+" "+p.category).toLocaleLowerCase("pt-BR").includes(search)));
 if(sort==="asc")filtered.sort((a,b)=>a.price-b.price);
 if(sort==="desc")filtered.sort((a,b)=>b.price-a.price);
 if(sort==="name")filtered.sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
 el("countLabel").textContent=filtered.length+" produto(s) encontrado(s)";
 el("emptyState").hidden=filtered.length>0; el("emptyState").textContent=products.length===0?"Nosso catálogo está sendo preparado. Em breve, novidades por aqui! ♡":"Nenhum produto encontrado. Tente outra busca.";
 const grid=el("productsGrid");grid.replaceChildren();
 filtered.forEach(p=>{
  const article=document.createElement("article");article.className="product-card";
  const image=document.createElement("div");image.className="product-image";
  const img=document.createElement("img");img.src=p.image;img.alt=p.name;img.loading="lazy";img.onerror=()=>{img.style.opacity=".15"};image.append(img);
  const fav=document.createElement("button");fav.className="fav"+(favorites.includes(p.id)?" active":"");fav.type="button";fav.textContent=favorites.includes(p.id)?"♥":"♡";fav.setAttribute("aria-label","Favoritar "+p.name);
  fav.addEventListener("click",()=>{favorites=favorites.includes(p.id)?favorites.filter(v=>v!==p.id):favorites.concat([p.id]);persist();updateCounts();renderProducts()});
  const meta=document.createElement("div");meta.className="product-meta";
  const c=document.createElement("span");c.className="product-category";c.textContent=p.category+" · "+p.brand;
  const h=document.createElement("h3");h.textContent=p.name;
  const row=document.createElement("div");row.className="price-line";
  const price=document.createElement("strong");price.textContent=money(p.price);
  const add=document.createElement("button");add.className="add-product";add.type="button";add.textContent="+";add.setAttribute("aria-label","Adicionar "+p.name+" à sacola");add.onclick=()=>addCart(p.id);
  row.append(price,add);meta.append(c,h,row);article.append(image,fav,meta);grid.append(article);
 });
}
function addCart(id){const p=findProduct(id);if(!p)return;const existing=cart.find(x=>x.id===id);if(existing){if(existing.qty>=20)return;existing.qty++}else cart.push({id,qty:1});persist();updateCounts();renderCart();openCart()}
function renderCart(){const box=el("cartItems");box.replaceChildren();const list=items();if(!list.length){const t=document.createElement("p");t.className="muted";t.textContent="Sua sacola ainda está vazia. Escolha seus favoritos!";box.append(t)}
 list.forEach(({product:p,qty})=>{const row=document.createElement("div");row.className="cart-line";const img=document.createElement("img");img.src=p.image;img.alt=p.name;const main=document.createElement("main");const name=document.createElement("strong");name.textContent=p.name;const price=document.createElement("small");price.textContent=money(p.price*qty);
 const ctr=document.createElement("div");ctr.className="qty-controls";const less=document.createElement("button");less.type="button";less.textContent="−";less.setAttribute("aria-label","Diminuir "+p.name);less.onclick=()=>changeQty(p.id,-1);const count=document.createElement("span");count.textContent=qty;const more=document.createElement("button");more.type="button";more.textContent="+";more.setAttribute("aria-label","Aumentar "+p.name);more.onclick=()=>changeQty(p.id,1);ctr.append(less,count,more);main.append(name,price,ctr);row.append(img,main);box.append(row)});
 el("cartSubtotal").textContent=money(subtotal());el("checkoutButton").disabled=!list.length;
}
function changeQty(id,delta){const x=cart.find(x=>x.id===id);if(!x)return;x.qty=Math.max(0,Math.min(20,x.qty+delta));cart=cart.filter(x=>x.qty>0);persist();updateCounts();renderCart();renderSummary()}
function openCart(){el("overlay").hidden=false;el("cartDrawer").classList.add("open");el("cartDrawer").setAttribute("aria-hidden","false")}
function closeCart(){el("overlay").hidden=true;el("cartDrawer").classList.remove("open");el("cartDrawer").setAttribute("aria-hidden","true")}
function delivery(){return document.querySelector('input[name="delivery"]:checked')?.value||"retirada"}
function payment(){return document.querySelector('input[name="payment"]:checked')?.value||"Pix"}
function address(){return {cep:el("addressCep").value.trim(),street:el("addressStreet").value.trim(),number:el("addressNumber").value.trim(),neighborhood:el("addressNeighborhood").value.trim(),city:el("addressCity").value.trim(),complement:el("addressComplement").value.trim()}}
function previewMessage(){const arr=items();const lines=["🛍️ *NOVO PEDIDO — AURORA GLAMOUR*","","👤 *CLIENTE*","Nome: "+(el("customerName").value.trim()||"A preencher"),"WhatsApp: "+(el("customerPhone").value.trim()||"A preencher"),"","🛍️ *PRODUTOS*"];arr.forEach(({product:p,qty},i)=>lines.push((i+1)+". "+p.name+" — "+p.brand+" | "+qty+" × "+money(p.price)+" = "+money(p.price*qty)));lines.push("","Subtotal: "+money(subtotal()),"Frete: "+(delivery()==="entrega"?"A confirmar":"Não se aplica"),"TOTAL PARCIAL: "+money(subtotal()),"","🚚 *RECEBIMENTO*",delivery()==="entrega"?"Entrega: "+[address().street,address().number,address().neighborhood,address().city,address().cep,address().complement].filter(Boolean).join(", "):"Retirada na loja","","💳 *PAGAMENTO*",payment()+(payment()==="Dinheiro" && el("changeFor").value.trim()?" — troco para "+el("changeFor").value.trim():""));if(el("orderNotes").value.trim())lines.push("","Observações: "+el("orderNotes").value.trim());lines.push("","Aguardando a confirmação da loja. ♡");return lines.join("\n")}
function renderSummary(){const box=el("summaryItems");box.replaceChildren();items().forEach(({product:p,qty})=>{const row=document.createElement("div");row.className="summary-item";const label=document.createElement("span");label.textContent=qty+" × "+p.name;const val=document.createElement("strong");val.textContent=money(p.price*qty);row.append(label,val);box.append(row)});el("summarySubtotal").textContent=money(subtotal());el("summaryShipping").textContent=delivery()==="entrega"?"A confirmar":"Não se aplica";el("summaryTotal").textContent=money(subtotal());el("summaryMessage").textContent=previewMessage()}
let captchaWidget=null;
function initCaptcha(){const cfg=store.automaticOrders;if(!cfg?.enabled || !cfg?.turnstileSiteKey)return;const render=()=>{if(window.turnstile&&!captchaWidget){captchaWidget=window.turnstile.render("#captchaBox",{sitekey:cfg.turnstileSiteKey,theme:"light"})}};if(window.turnstile){render();return}const script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.defer=true;script.onload=render;document.head.append(script)}
function openCheckout(){if(!items().length)return;closeCart();showStatus("");renderSummary();el("checkoutDialog").showModal();initCaptcha()}
function updateConditionalFields(){const isDelivery=delivery()==="entrega";el("addressFields").hidden=!isDelivery;["addressCep","addressStreet","addressNumber","addressNeighborhood","addressCity"].forEach(id=>el(id).required=isDelivery);el("changeBox").hidden=payment()!=="Dinheiro";renderSummary()}
async function submitOrder(ev){ev.preventDefault();if(!items().length)return showStatus("Sua sacola está vazia.");const cfg=store.automaticOrders;if(!cfg?.enabled||!cfg?.endpoint||!cfg?.turnstileSiteKey){return showStatus("O envio automático ainda não está ativado pela loja. Nenhum pedido foi enviado.")}const phone=el("customerPhone").value.replace(/\D/g,"");if(phone.length<10||phone.length>13)return showStatus("Informe um WhatsApp válido com DDD.");if(delivery()==="entrega" && !address().street)return showStatus("Preencha o endereço de entrega.");const token=window.turnstile?.getResponse(captchaWidget);if(!token)return showStatus("Conclua a verificação de segurança para finalizar.");
 const btn=el("submitOrder");btn.disabled=true;showStatus("Enviando a notificação do pedido...");
 try{const payload={customer:{name:el("customerName").value.trim(),phone},items:items().map(({product:p,qty})=>({id:p.id,qty})),delivery:{method:delivery(),address:delivery()==="entrega"?address():null},payment:{method:payment(),changeFor:payment()==="Dinheiro"?el("changeFor").value.trim():""},notes:el("orderNotes").value.trim(),turnstileToken:token};const resp=await fetch(cfg.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await resp.json();if(!resp.ok||!data.success)throw Error(data.error||"Não foi possível avisar a loja.");showStatus("Pedido recebido pelo sistema de notificações. Abrindo o contato da loja...",true);cart=[];persist();updateCounts();renderCart();const target=String(store.whatsappNumber||"").replace(/\D/g,"");if(target){setTimeout(()=>{window.location.assign("https://wa.me/"+target)},900)}}
 catch(err){showStatus(err.message||"Falha no envio: tente novamente.");if(window.turnstile&&captchaWidget!==null)window.turnstile.reset(captchaWidget)}finally{btn.disabled=false}
}
async function init(){try{const [a,b]=await Promise.all([fetch("./data/products.json",{cache:"no-cache"}),fetch("./data/store.json",{cache:"no-cache"})]);if(!a.ok||!b.ok)throw Error("Catálogo indisponível");const source=await a.json();products=(Array.isArray(source)?source:source.products).filter(p=>typeof p.id==="string"&&typeof p.name==="string"&&Number.isFinite(Number(p.price))&&Number(p.price)>=0).map(p=>({...p,price:Number(p.price)}));store=await b.json();cart=cart.filter(x=>findProduct(x.id));favorites=favorites.filter(id=>Boolean(findProduct(id)));persist();const brands=[...new Set(products.map(p=>p.brand))].sort();brands.forEach(brand=>{const o=document.createElement("option");o.value=brand;o.textContent=brand;el("brandSelect").append(o)});const wa="https://wa.me/"+String(store.whatsappNumber||"").replace(/\D/g,"");el("aboutWhatsapp").href=wa;el("footerWhatsapp").href=wa;el("footerInstagram").href=store.instagramUrl||"#";renderCategories();renderProducts();renderCart();updateCounts();}
 catch(e){el("countLabel").textContent="Não foi possível carregar o catálogo.";el("emptyState").hidden=false;el("emptyState").textContent="Verifique data/products.json e tente novamente.";console.error(e)}}
el("searchButton").onclick=()=>{document.querySelector("#catalogo").scrollIntoView({behavior:"smooth"});el("searchInput").focus()};
el("favoriteButton").onclick=()=>{favoritesOnly=!favoritesOnly;renderProducts();document.querySelector("#catalogo").scrollIntoView({behavior:"smooth"})};
el("searchInput").oninput=renderProducts;el("brandSelect").onchange=renderProducts;el("sortSelect").onchange=renderProducts;
el("clearFilter").onclick=()=>{activeCategory="";favoritesOnly=false;el("brandSelect").value="";el("searchInput").value="";el("sortSelect").value="default";renderCategories();renderProducts()};
el("cartButton").onclick=()=>{renderCart();openCart()};el("closeCart").onclick=closeCart;el("overlay").onclick=closeCart;el("checkoutButton").onclick=openCheckout;el("closeCheckout").onclick=()=>el("checkoutDialog").close();
document.querySelectorAll('input[name="delivery"],input[name="payment"]').forEach(x=>x.onchange=updateConditionalFields);
["customerName","customerPhone","addressCep","addressStreet","addressNumber","addressNeighborhood","addressCity","addressComplement","changeFor","orderNotes"].forEach(id=>el(id).addEventListener("input",renderSummary));
el("checkoutForm").addEventListener("submit",submitOrder);window.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});init();
})();