import { useEffect, useState } from 'react'

function Exercicio2() {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    async function buscarComentarios() {
      const resposta = await fetch("https://jsonplaceholder.typicode.com/comments?postId=1");
      const dados = await resposta.json();
      setComentarios(dados);
    }
    buscarComentarios();
  }, []);
  console.log(comentarios);

  return (
    <>
      <section id="center">
        <h1>Exercício 2</h1>

        <ul>
          {comentarios.map((comentario) => (
            <li key={comentario.id}>
              <strong>{comentario.name}</strong> - {comentario.email}
              {/* <p>{comentario.body}</p> */}
            </li>
          ))}
        </ul>
        <br />
      </section>
    </>
  )
}

export default Exercicio2