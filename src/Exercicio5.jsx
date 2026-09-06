import { useEffect, useState } from "react";

export default function Exercicio5() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        setCarregando(true)
        setErro(null)
        const resp = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status} — ${resp.statusText}`)
        }

        const dados = [] //await resp.json()

        setUsuarios(dados)
      } catch (e) {
        setErro(e.message)
      } finally {
        setCarregando(false)
      }
    }

    buscarUsuarios();
  }, []);

  if (carregando) return (
    <section id="center">
      <h1>Exercício 5</h1>
      <p>Carregando...</p>
      <br />
    </section>
  )
  if (erro)     return (
    <section id="center">
      <h1>Exercício 5</h1>
      <p>Erro: {erro}</p>
      <br />
    </section>
  )
  if (usuarios.length === 0) return (
    <section id="center">
      <h1>Exercício 5</h1>
      <p>Nenhum usuário encontrado.</p>
      <br />
    </section>
  )

  return (
    <>
      <section id="center">
        <h1>Exercício 5</h1>
        {usuarios
          .filter((_, index) => index <= 9)
          .map((usuario) => (<li key={usuario.id}>{usuario.name}</li>))
        }
        <br />
      </section>
    </>
  );
}