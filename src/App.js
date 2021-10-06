import { useFormik } from "formik"
import { useState } from "react"

import "./header.css"
import "./content.css"
import "./article.css"

//app
const App = () => {

  const [fotos, setFotos] = useState([])
  const [pagina, setPagina] = useState(0)

  const abrir = (url) => window.open(url)

  const buscarMas = async () => {
    pagina == 0 ? setPagina(pagina + 1) : console.log("")
    const response = await fetch("https://api.unsplash.com/search/photos?page=" + pagina + "&per_page=" + 10 + "&query=" + formik.values.search, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': process.env.REACT_APP_MI_ID
      }
    })
    const data = await response.json()
    data.results.length > 0 ? setFotos(data.results) : alert("no hay resultados")
  }


  const formik = useFormik({
    initialValues: {
      search: ""
    },
    onSubmit: buscarMas,
    validate: (values) => {
      const errors = {}
      if (!values.search) {
        errors.search = "debe ingresar un valor"
      } else if (values.search.length < 3) {
        errors.search = "ingrese al menos 3 caracteres"
      }
      return errors
    },
  })

  // console.log(fotos)

  return (
    <div>
      <header>
        <form onSubmit={formik.handleSubmit}>
          <input
            name="search"
            onChange={formik.handleChange}
            value={formik.values.search}
            placeholder="Buscar una imagen"
          />
          {formik.errors.search ? <div className="errores">{formik.errors.search}</div> : null}
        </form>
      </header>
      <div className="container">
        {
          pagina >= 1 ?
            <div className="botones">
              <button onClick={() => {
                pagina > 1 ? setPagina(pagina - 1) : console.log(pagina)
                buscarMas()
              }}> ATRAS
              </button>
              <button onClick={() => {
                setPagina(pagina + 1)
                console.log(pagina)
                buscarMas()
              }}> ADELANTE
              </button>
            </div>
            : null
        }
        <div className="center">
          {
            fotos.map(x =>
              <article key={x.id} onClick={() => { abrir(x.links.html) }}>
                <img src={x.urls.regular} />
                <p>{[x.description, x.alt_description].join(" - ")}</p>
              </article>
            )
          }
        </div>
      </div>
    </div>

  )
}

export default App
