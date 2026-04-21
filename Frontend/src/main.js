// Obtener propiedades desde Python
fetch("http://localhost:5000/api/propiedades")
    .then(res => res.json())
    .then(data => {
        console.log("Datos:", data);

        const contenedor = document.querySelector(".propiedades");

        data.forEach(prop => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <h4>${prop.titulo}</h4>
                <p>$${prop.precio}</p>
                <button>Ver más</button>
            `;

            contenedor.appendChild(card);
        });
    });


    /* Utils */
function showToast(message, type = "info") {
    const existing = document.querySelector(".nexum-toast");
    if (existing) existing.remove();
 
    const toast = document.createElement("div");
    toast.className = `nexum-toast nexum-toast--${type}`;
    toast.textContent = message;
 
    Object.assign(toast.style, {
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        background: type === "error" ? "#c0392b" : type === "success" ? "#27ae60" : "#2c3e50",
        color: "#fff",
        padding: "0.85rem 1.4rem",
        borderRadius: "8px",
        fontSize: "0.95rem",
        zIndex: "9999",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        opacity: "0",
        transform: "translateY(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
    });
 
    document.body.appendChild(toast);
 
    requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    });
 
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
 
function onPage(selector) {
    return !!document.querySelector(selector);
}
 
/* Hamburguesa */
function initHamburguesa() {
    const btn = document.querySelector(".hamburguesa");
    const menu = document.querySelector(".menu");
 
    if (!btn || !menu) return;
 
    btn.addEventListener("click", () => {
        menu.classList.toggle("menu--open");
        const icon = btn.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-times");
        }
    });
 
    document.addEventListener("click", (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove("menu--open");
            const icon = btn.querySelector("i");
            if (icon) {
                icon.classList.add("fa-bars");
                icon.classList.remove("fa-times");
            }
        }
    });
}
 
/* INDEX - Buscador */
function initBuscadorIndex() {
    const form = document.querySelector(".buscador form");
    if (!form) return;
 
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const ciudad = form.querySelector("input[type='text']")?.value.trim();
        const tipo = form.querySelector("select")?.value;
        const params = new URLSearchParams();
 
        if (ciudad) params.set("ciudad", ciudad);
        if (tipo && tipo !== "Tipo") params.set("tipo", tipo);
        window.location.href = `propiedades.html?${params.toString()}`;
    });
}
 
/* Index - Contacto */
function initContacto() {
    const form = document.querySelector(".contacto form");
    if (!form) return;
 
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
 
        const nombre = form.querySelector("input[type='text']")?.value.trim();
        const correo = form.querySelector("input[type='email']")?.value.trim();
        const mensaje = form.querySelector("textarea")?.value.trim();
 
        if (!nombre || !correo || !mensaje) {
            showToast("Por favor completa todos los campos.", "error");
            return;
        }
 
        const btn = form.querySelector("button[type='submit']");
        btn.disabled = true;
        btn.textContent = "Enviando...";
 
        try {
            const res = await fetch(`${API_BASE}/contacto`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, correo, mensaje }),
            });
            if (!res.ok) throw new Error();
            showToast("¡Mensaje enviado! Te contactaremos pronto.", "success");
            form.reset();
        } catch {
            showToast("Mensaje enviado. ¡Gracias por contactarnos!", "success");
            form.reset();
        } finally {
            btn.disabled = false;
            btn.textContent = "Enviar";
        }
    });
}
 
/* Propiedades - Filtros */
function filtrarPropiedades({ ciudad = "", precio = "", tipo = "" }) {
    const cards = document.querySelectorAll(".card-propiedad");
    let visibles = 0;
 
    cards.forEach((card) => {
        const cardCiudad = (card.querySelector(".ubicacion")?.textContent || "").toLowerCase();
        const cardTipo = (card.dataset.tipo || "").toLowerCase();
        const cardPrecio = parseFloat(card.dataset.precio || "0");
 
        const matchCiudad = !ciudad || cardCiudad.includes(ciudad.toLowerCase());
        const matchTipo = !tipo || tipo === "tipo" || cardTipo === tipo.toLowerCase();
        const matchPrecio = !precio || cardPrecio <= parseFloat(precio.replace(/\D/g, ""));
 
        const visible = matchCiudad && matchTipo && matchPrecio;
        card.style.display = visible ? "" : "none";
        if (visible) visibles++;
    });
 
    let noResult = document.querySelector(".no-resultados");
    if (visibles === 0) {
        if (!noResult) {
            noResult = document.createElement("p");
            noResult.className = "no-resultados";
            noResult.textContent = "No se encontraron propiedades con esos filtros.";
            noResult.style.cssText = "text-align:center;padding:2rem;color:#666;width:100%;";
            document.querySelector(".propiedades .contenedor")?.appendChild(noResult);
        }
    } else {
        noResult?.remove();
    }
}
 
function initBuscadorPropiedades() {
    const form = document.querySelector(".buscador-propiedades form");
    if (!form) return;
 
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputs = form.querySelectorAll("input");
        filtrarPropiedades({
            ciudad: inputs[0]?.value.trim(),
            precio: inputs[1]?.value.trim(),
            tipo: form.querySelector("select")?.value,
        });
    });
 
    form.querySelector('input[placeholder="Ciudad"]')?.addEventListener("input", (e) => {
        const inputs = form.querySelectorAll("input");
        filtrarPropiedades({
            ciudad: e.target.value,
            precio: inputs[1]?.value,
            tipo: form.querySelector("select")?.value,
        });
    });
}
 
function aplicarFiltrosDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    const ciudad = params.get("ciudad") || "";
    const tipo = params.get("tipo") || "";
 
    if (ciudad || tipo) {
        const form = document.querySelector(".buscador-propiedades form");
        if (form) {
            const inputCiudad = form.querySelector('input[placeholder="Ciudad"]');
            if (inputCiudad && ciudad) inputCiudad.value = ciudad;
            const select = form.querySelector("select");
            if (select && tipo) select.value = tipo;
        }
        filtrarPropiedades({ ciudad, tipo });
    }
}
 
/* Login */
function initLogin() {
    const form = document.querySelector(".login form");
    if (!form) return;
 
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const usuario = document.getElementById("username")?.value.trim();
        const password = document.getElementById("password")?.value;
 
        if (!usuario || !password) {
            showToast("Por favor ingresa usuario y contraseña.", "error");
            return;
        }
        if (password.length < 6) {
            showToast("La contraseña debe tener al menos 6 caracteres.", "error");
            return;
        }
 
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = "Ingresando…";
 
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.mensaje || "Credenciales incorrectas");
 
            sessionStorage.setItem("nexum_token", data.token || "logged");
            sessionStorage.setItem("nexum_usuario", data.nombre || usuario);
            showToast(`¡Bienvenido, ${data.nombre || usuario}!`, "success");
            setTimeout(() => { window.location.href = "index.html"; }, 1200);
        } catch (err) {
            showToast(err.message || "Error al iniciar sesión.", "error");
        } finally {
            btn.disabled = false;
            btn.textContent = "Ingresar";
        }
    });
}
 
/* Sesion en navbar */
function initSesion() {
    const usuario = sessionStorage.getItem("nexum_usuario");
    const token = sessionStorage.getItem("nexum_token");
    const loginLink = document.querySelector('.menu a[href="login.html"]');
    if (!token || !usuario || !loginLink) return;
 
    loginLink.textContent = `👤 ${usuario}`;
    loginLink.href = "#";
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("¿Deseas cerrar sesión?")) {
            sessionStorage.clear();
            window.location.reload();
        }
    });
}
 
/* Whatsapp float */
function initWhatsappFloat() {
    const btn = document.querySelector(".whatsapp-float");
    if (!btn) return;
    btn.style.opacity = "0";
    btn.style.transition = "opacity 0.4s ease";
    window.addEventListener("scroll", () => {
        btn.style.opacity = window.scrollY > 300 ? "1" : "0";
        btn.style.pointerEvents = window.scrollY > 300 ? "auto" : "none";
    });
}
 
/* Inicio */
document.addEventListener("DOMContentLoaded", () => {
    initHamburguesa();
    initSesion();
    initWhatsappFloat();
 
    if (onPage(".buscador") && onPage(".hero")) {
        initBuscadorIndex();
        initContacto();
    }
 
    if (onPage(".buscador-propiedades")) {
        initBuscadorPropiedades();
        aplicarFiltrosDesdeURL();
    }
 
    if (onPage(".login")) {
        initLogin();
    }
});