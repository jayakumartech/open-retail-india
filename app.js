const $ = (s) => document.querySelector(s);
const STORE = "open-retail-india-v1";
const initial = { products: [], bills: [], lang: "en", dark: false };
let state = load();
function load(){ try{return {...initial,...JSON.parse(localStorage.getItem(STORE)||"{}")}}catch{return {...initial}} }
function save(){localStorage.setItem(STORE,JSON.stringify(state));render()}
const translations = {
 en:{overview:"OVERVIEW",dashboard:"Dashboard",welcome:"Your shop, at a glance.",todaySales:"Today's sales",salesCaption:"Total billed today",products:"Products",productsCaption:"Items in catalogue",lowStock:"Low stock",stockCaption:"Need attention",quickActions:"QUICK ACTIONS",getStarted:"Get started",addProduct:"Add product",addProductSub:"Build your catalogue",newSale:"New sale",newSaleSub:"Create a bill",inventory:"Inventory",inventorySub:"View stock levels",backup:"Backup data",backupSub:"Export your records",catalogue:"CATALOGUE",recentProducts:"Products",item:"Item",price:"Price",qty:"Qty",emptyProducts:"No products yet. Add your first product.",recentActivity:"ACTIVITY",recentBills:"Recent bills",emptyBills:"No bills created yet.",productName:"Product name",sellingPrice:"Selling price (₹)",quantity:"Quantity",sku:"Product code (optional)",saveProduct:"Save product",selectProduct:"Select product",billTotal:"Bill total",createBill:"Create bill",saleNote:"Demo billing only. GST, invoice PDF and returns will be added in upcoming releases."},
 ta:{overview:"கண்ணோட்டம்",dashboard:"முகப்பு",welcome:"உங்கள் கடையின் இன்றைய நிலை.",todaySales:"இன்றைய விற்பனை",salesCaption:"இன்றைய மொத்த பில்",products:"பொருட்கள்",productsCaption:"பட்டியலில் உள்ளவை",lowStock:"குறைந்த இருப்பு",stockCaption:"கவனம் தேவை",quickActions:"விரைவு செயல்கள்",getStarted:"தொடங்கலாம்",addProduct:"பொருள் சேர்க்க",addProductSub:"பொருள் பட்டியல் உருவாக்கு",newSale:"புதிய விற்பனை",newSaleSub:"பில் உருவாக்கு",inventory:"சரக்கு இருப்பு",inventorySub:"இருப்பைப் பார்",backup:"காப்புப்பிரதி",backupSub:"தரவை ஏற்றுமதி செய்",catalogue:"பட்டியல்",recentProducts:"பொருட்கள்",item:"பொருள்",price:"விலை",qty:"அளவு",emptyProducts:"பொருட்கள் இல்லை. முதலில் ஒன்றைச் சேர்க்கவும்.",recentActivity:"செயல்பாடு",recentBills:"சமீபத்திய பில்கள்",emptyBills:"இதுவரை பில்கள் இல்லை.",productName:"பொருளின் பெயர்",sellingPrice:"விற்பனை விலை (₹)",quantity:"அளவு",sku:"பொருள் குறியீடு (விருப்பம்)",saveProduct:"பொருளைச் சேமி",selectProduct:"பொருளைத் தேர்வு செய்",billTotal:"மொத்த பில்",createBill:"பில் உருவாக்கு",saleNote:"இது ஆரம்ப Demo billing. GST, PDF invoice, returns அடுத்த பதிப்புகளில் சேர்க்கப்படும்."}
};
function t(k){return (translations[state.lang]||translations.en)[k]||k}
function money(n){return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(n||0)}
function todayKey(){return new Date().toLocaleDateString("en-CA")}
function render(){
 document.documentElement.lang=state.lang==="ta"?"ta":"en";
 document.body.classList.toggle("dark",state.dark);
 $("#langBtn").textContent=state.lang==="en"?"தமிழ்":"English";
 $("#today").textContent=new Date().toLocaleDateString(state.lang==="ta"?"ta-IN":"en-IN",{day:"numeric",month:"short",year:"numeric"});
 document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
 const todays=state.bills.filter(b=>b.date===todayKey()).reduce((s,b)=>s+b.total,0);
 $("#salesValue").textContent=money(todays);$("#productCount").textContent=state.products.length;
 $("#lowStockCount").textContent=state.products.filter(p=>p.qty<=5).length;
 $("#catalogueCount").textContent=`${state.products.length} ${state.lang==="ta"?"பொருட்கள்":"items"}`;
 $("#productRows").innerHTML=state.products.length?state.products.map(p=>`<tr><td><b>${escapeHtml(p.name)}</b><br><small>${escapeHtml(p.sku||"")}</small></td><td>${money(p.price)}</td><td>${p.qty}</td></tr>`).join(""):`<tr><td colspan="3" class="empty">${t("emptyProducts")}</td></tr>`;
 $("#billList").innerHTML=state.bills.length?[...state.bills].reverse().slice(0,5).map(b=>`<div class="bill"><div><b>${escapeHtml(b.name)}</b><small>${new Date(b.created).toLocaleString()}</small></div><strong>${money(b.total)}</strong></div>`).join(""):`<p class="empty">${t("emptyBills")}</p>`;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function open(id){$("#"+id).showModal()}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$("#"+b.dataset.close).close()));
$("#addProductBtn").onclick=()=>open("productDialog");
$("#newSaleBtn").onclick=()=>{if(!state.products.length){toast(state.lang==="ta"?"முதலில் ஒரு பொருளைச் சேர்க்கவும்":"Add a product first");return}populateSale();open("saleDialog")};
$("#viewStockBtn").onclick=()=>$("#inventoryPanel").scrollIntoView({behavior:"smooth"});
$("#langBtn").onclick=()=>{state.lang=state.lang==="en"?"ta":"en";save()};
$("#themeBtn").onclick=()=>{state.dark=!state.dark;save()};
$("#backupBtn").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="open-retail-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup exported")};
$("#productForm").onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);state.products.push({id:crypto.randomUUID(),name:f.get("name").trim(),price:Number(f.get("price")),qty:Number(f.get("qty")),sku:f.get("sku").trim()});e.currentTarget.reset();$("#productDialog").close();save();toast(state.lang==="ta"?"பொருள் சேமிக்கப்பட்டது":"Product saved")};
function populateSale(){const s=$("#saleProduct");s.innerHTML=state.products.filter(p=>p.qty>0).map(p=>`<option value="${p.id}">${escapeHtml(p.name)} — ${money(p.price)} (${p.qty} available)</option>`).join("");updateTotal()}
function updateTotal(){const p=state.products.find(x=>x.id===$("#saleProduct").value);$("#saleTotal").textContent=money(p?p.price*Number($("#saleForm [name=qty]").value||1):0)}
$("#saleProduct").onchange=updateTotal;$("#saleForm [name=qty]").oninput=updateTotal;
$("#saleForm").onsubmit=e=>{e.preventDefault();const id=$("#saleProduct").value,p=state.products.find(x=>x.id===id),qty=Number($("#saleForm [name=qty]").value);if(!p||qty<1||qty>p.qty){toast("Invalid quantity / insufficient stock");return}p.qty-=qty;state.bills.push({id:crypto.randomUUID(),name:p.name,qty,total:p.price*qty,date:todayKey(),created:new Date().toISOString()});e.currentTarget.reset();$("#saleDialog").close();save();toast("Bill created · "+money(p.price*qty))};
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();
