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