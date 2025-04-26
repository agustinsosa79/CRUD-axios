const d = document
    $table = d.querySelector(".crud-table")
    $form = d.querySelector(".crud-form")
    $title = d.querySelector(".crud-title")
    $template = d.querySelector(".crud-template")
    $fragment = d.createDocumentFragment()


    const getAll = async () => {
        try {
            let res = await axios.get("https://680c46912ea307e081d39732.mockapi.io/titanes"),
                json = await res.data

            json.forEach(el => {
                $template.content.querySelector(".name").textContent = el.nombre
                $template.content.querySelector(".poder").textContent = el.poder

                $template.content.querySelector(".edit").dataset.name = el.nombre
                $template.content.querySelector(".edit").dataset.poder = el.poder
                $template.content.querySelector(".edit").dataset.id = el.id
                $template.content.querySelector(".delete").dataset.id = el.id

                let $clone = d.importNode($template.content, true)

                $fragment.appendChild($clone)
            });

            $table.querySelector("tbody").appendChild($fragment)
        } catch (err) {
            let message = err.statusText || "Ocurrio un error"
            $table.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`)
        }
    }

    d.addEventListener("DOMContentLoaded", getAll)

    d.addEventListener("submit", async e => {
        if (e.target === $form) {
            e.preventDefault()

            if (!e.target.id.value) {
                // Create POST
                try {
                    let options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        data: JSON.stringify({
                            nombre: e.target.nombre.value,
                            poder: e.target.poder.value
                        })
                    }

                    let res = await axios("https://680c46912ea307e081d39732.mockapi.io/titanes", options)
                        json = await res.data

                    location.reload()
                } catch (err) {
                    let message = err.statusText || "Ocurrio un error";
                    $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
                }
            } else {
                // Update PUT
                try {
                    let options = {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        },
                        data: JSON.stringify({
                            nombre: e.target.nombre.value,
                            poder: e.target.poder.value
                        })
                    };

                    let res = await axios(`https://680c46912ea307e081d39732.mockapi.io/titanes/${e.target.id.value}`, options);
                        json = await res.data;

                    location.reload()
                } catch (err) {
                    let message = err.statusText || "Ocurrió un error";
                    $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
                }
            }
        }
    })

    
    d.addEventListener("click", async e => {
        if (e.target.matches(".edit")) {
            $title.textContent = "Editar Titan";
            $form.nombre.value = e.target.dataset.name;
            $form.poder.value = e.target.dataset.poder;
            $form.id.value = e.target.dataset.id;
        }

        if (e.target.matches(".delete")) {
            try {
                let isConfirmed = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);
                if (isConfirmed) {
                    let options = {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        }
                    };

                    let res = await axios(`https://680c46912ea307e081d39732.mockapi.io/titanes/${e.target.dataset.id}`, options);
                    let json = await res.data;

                    getAll();
                }
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                alert(`Error ${err.status}: ${message}`);
            }
        }
    })