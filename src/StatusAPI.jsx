import { useEffect, useState } from 'react'

export default function StatusAPI() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const controle = new AbortController()
    const signal = controle.signal

    async function buscar() {
      try {
        setCarregando(true)
        setErro(null)

        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const resp = await fetch('https://jsonplaceholder.typicode.com/users', { signal })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        setUsuarios(data)
      } catch (e) {
        if (e.name !== 'AbortError') {
          setErro(e.message)
        }
      } finally {
        setCarregando(false)
      }
    }

    buscar()
    return () => controle.abort()
  }, [])

  if (carregando) return (
    <section id="center">
        <h1>Aula 04 -Exercício 5</h1>
        <p>Carregando...</p>
    </section>
  )
  if (erro)     return (
  <section id="center">
    <h1>Aula 04 -Exercício 5</h1>
    <p>Erro: {erro}</p>
  </section>
)
  if (usuarios.length === 0) return (
    <section id="center">
      <h1>Aula 04 -Exercício 5</h1>
      <p>Nenhum item encontrado.</p>
    </section>
  )

  return (
    <>
      <section id="center">
        <h1>Aula 04 -Exercício 5</h1>
        <h2>Status da API</h2> 
        <p>Sucesso: {usuarios.length} itens carregados.</p>
      </section>
    </>
  )
}