import { useEffect, useState, useRef } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "./api";

const listarUsuarios = (signal) => apiGet("/users", { signal });
const criarUsuario = (dados, signal) => apiPost("/users", dados, { signal });
const atualizarUsuario = (id, dados, signal) => apiPut(`/users/${id}`, dados, { signal });
const excluirUsuario = (id, signal) => apiDelete(`/users/${id}`, { signal });

export default function Exercicio5() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [editando, setEditando] = useState(null)
  const [formulario, setFormulario] = useState({ name: "", email: "",});
  const [cadastrando, setCadastrando] = useState(false);

  const controllerRef = useRef(null);

  function tratarErro(e) {
    if (e.name === "AbortError") { return }
    if (e.name === "ApiError" && e.status === 404) { setErro("Recurso não encontrado") }
    else if (e.name === "ApiError" && e.status >= 500) { setErro("Erro no servidor") } 
    else if (e instanceof TypeError && e.message === "Failed to fetch") { setErro("Falha de rede")} 
    else { setErro(e.message) }
  }

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    async function buscarUsuarios() {
      try {
        setCarregando(true)
        setErro(null)
        const dados = await listarUsuarios(controller.signal);
        console.log(dados);
        setUsuarios(dados)
      } 
      catch (e) { tratarErro(e)} 
      finally { setCarregando(false) }
    } buscarUsuarios();
    return () => { 
      controller.abort(); 
      controllerRef.current = null; 
    };
  }, []);

  async function tentarExcluir(id) {
    const prev = usuarios
    setUsuarios(prev.filter(u => u.id !== id))  //Exclusão otimista
    try {
      setErro(null);
      await excluirUsuario(id, controllerRef.current?.signal)
      console.log(`Usuário ${id} excluído`);
    } catch (e) {
      if (e.name !== "AbortError") { 
        setUsuarios(prev); 
        tratarErro(e); 
      }
    }
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
        const novo = await criarUsuario(formulario, controllerRef.current?.signal);
        setUsuarios((prev) => [novo, ...prev]);
        setCadastrando(false);

      } else {
        const atualizado = await atualizarUsuario(editando.id, formulario, controllerRef.current?.signal);
        setUsuarios((prev) => prev.map((u) => u.id === atualizado.id ? atualizado : u));
        setEditando(null);
      }
      setFormulario({
        name: "",
        email: "",
      });
    } catch (e) { tratarErro(e) }
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