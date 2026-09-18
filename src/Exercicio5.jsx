import { useEffect, useState, useRef } from "react";

export default function Exercicio5() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [editando, setEditando] = useState(null)
  const [formulario, setFormulario] = useState({ name: "", email: "",});
  const [cadastrando, setCadastrando] = useState(false);

  const controllerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    async function buscarUsuarios() {
      try {
        setCarregando(true)
        setErro(null)
        const resp = await fetch('https://jsonplaceholder.typicode.com/users', { signal: controller.signal });
        if (!resp.ok) throw new Error(`HTTP ${resp.status} — ${resp.statusText}`);
        const dados = await resp.json();
        setUsuarios(dados)
        
      } catch (e) { if (e.name !== "AbortError") setErro(e.message);
      } finally { setCarregando(false) }
    } buscarUsuarios();
    return () => { 
      controller.abort(); 
      controllerRef.current = null; 
    };
  }, []);

  async function excluirUsuario(id) {
    const resp = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
       method: 'DELETE',
       signal: controllerRef.current?.signal
      })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return true
  }

  async function tentarExcluir(id) {
    const prev = usuarios
    setUsuarios(prev.filter(u => u.id !== id))  // otimista
    try {
      setErro(null);
      await excluirUsuario(id)
      console.log(`Usuário ${id} excluído`);
    } catch (e) {
      if (e.name !== "AbortError") { 
        setUsuarios(prev); 
        setErro(e.message); 
      }
    }
  }

  async function atualizarUsuario(id, novosDados) {
    const resp = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novosDados),
      signal: controllerRef.current?.signal
    })
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return await resp.json()
  }

  function editarUsuario(usuario) {
    setEditando(usuario)
    setFormulario({ name: usuario.name, email: usuario.email });
    setErro(null);
  }

  function alterarCampo(e) {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  }

  async function salvarFormulario(e) {
    e.preventDefault();
    try {
      setErro(null);

      if (cadastrando) {
        const novo = await criarUsuario(formulario);
        setUsuarios((prev) => [novo, ...prev]);
        setCadastrando(false);

      } else {
        const atualizado = await atualizarUsuario(editando.id, formulario);
        setUsuarios((prev) => prev.map((u) => u.id === atualizado.id ? atualizado : u));
        setEditando(null);
      }
      setFormulario({
        name: "",
        email: "",
      });
    } catch (e) { 
      if (e.name !== "AbortError") setErro(e.message);
    }
  }

  async function criarUsuario(novosDados) {
    const resp = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(novosDados),
        signal: controllerRef.current?.signal
      }
    );
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    return await resp.json();
  }

  function novoUsuario() {
    setCadastrando(true)
    setEditando(null)
    setFormulario({ name: "", email: "" });
    setErro(null);
  }

  if (carregando) return (
    <section id="center">
      <h1>Exercício 5</h1>
      <p>Carregando...</p>
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
        
        <button onClick={novoUsuario}>Novo usuário</button>

        {erro && <p>Erro: {erro}</p>}
        
        {(editando || cadastrando) && (
          <form onSubmit={salvarFormulario}>
            <h2> {cadastrando ? "Novo usuário" : "Editar usuário"} </h2>
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
            <button type="submit">{cadastrando ? "Cadastrar" : "Salvar"}</button>
            <button type="button" onClick={() => {
              setEditando(null);
              setCadastrando(false)
            }}>
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