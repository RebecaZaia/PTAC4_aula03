import { useEffect, useState } from "react";

export default function Exercicio5() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [editando, setEditando] = useState(null)
  const [formulario, setFormulario] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        setCarregando(true)
        setErro(null)
        const resp = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status} — ${resp.statusText}`)
        }

        const dados = await resp.json()

        setUsuarios(dados)
      } catch (e) {
        setErro(e.message)
      } finally {
        setCarregando(false)
      }
    }

    buscarUsuarios();
  }, []);

  async function excluirUsuario(id) {
    const resp = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'DELETE',
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    // em jsonplaceholder, responde 200 com corpo vazio ({})
    return true
  }

  async function tentarExcluir(id) {
    const prev = usuarios
    setUsuarios(prev.filter(u => u.id !== id))  // otimista
    try {
      await excluirUsuario(id)
      console.log(`Usuário ${id} excluído`);
    } catch (e) {
      setUsuarios(prev)  // desfaz
      setErro(e.message)
    }
  }

  async function atualizarUsuario(id, novosDados) {
    const resp = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novosDados),
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return await resp.json()
  }

  function editarUsuario(usuario) {
    setEditando(usuario);
    setFormulario({
      name: usuario.name,
      email: usuario.email,
    });
  }

  function alterarCampo(e) {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  }

  async function salvarEdicao(e) {
    e.preventDefault();
    try {
      const atualizado = await atualizarUsuario(editando.id, formulario);
      setUsuarios((prev) =>
        prev.map((u) => u.id === atualizado.id ? atualizado : u)
      );

      setEditando(null);
      setFormulario({
        name: "",
        email: "",
      });
    } catch (e) { setErro(e.message);}
  }

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
        
        {editando && (
          <form onSubmit={salvarEdicao}>
            <h2>Editar usuário</h2>
            <input
              name="name"
              value={formulario.name}
              onChange={alterarCampo}
              placeholder="Nome"
            />
            <input
              name="email"
              value={formulario.email}
              onChange={alterarCampo}
              placeholder="E-mail"
            />
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => setEditando(null)}>
              Cancelar
            </button>
          </form>
        )}

        <ul>
        {usuarios
          .filter((_, index) => index <= 9)
          .map((u) => (
          <li key={u.id}>
          {u.name} - {u.email}
          <button onClick={() => editarUsuario(u)}>Editar</button>
          <button onClick={() => tentarExcluir(u.id)}>Excluir</button>
        </li>
        ))
        }
        </ul>
        <br />
      </section>
    </>
  );
}