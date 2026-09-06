import { useEffect, useState } from 'react'

export default function Exercicio2() {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    const controle = new AbortController()  // cria um controle
    const signal = controle.signal

    async function buscarComentarios() {
      try{
        const resposta = await fetch(
        "https://jsonplaceholder.typicode.com/comments?postId=1",
        { signal }
      );
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
      const dados = await resposta.json();
      setComentarios(dados);
      } catch (erro) {
        if (erro.name !== "AbortError") {
          console.error(erro.message);
        }
      }
    }
    buscarComentarios();
    return () => controle.abort()
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