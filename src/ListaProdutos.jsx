import { useEffect, useState } from 'react'
import { apiGet } from './api'

export function ListaProdutos() {
  // Estado dos dados: null = ainda não carregou
  const [produtos, setProdutos] = useState(null)
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const ctrl = new AbortController()  // AbortController cancela a requisição se o componente sumir antes da resposta

    async function buscarProdutos() {
      try {
        const dados = await apiGet("/products", {
          baseURL: "/api",
          signal: ctrl.signal,
        });

        setProdutos(dados);
      } catch (e) {
        if (e.name === "AbortError") return;
        setErro(e.message)
      } finally {
        if (!ctrl.signal.aborted) {
          setCarregando(false)
        }
      }
    }

    buscarProdutos();
    return () => ctrl.abort();
  }, []);

  if (carregando) return (
    <section>
      <h1>Aula 11 - Produtos da API Express</h1>
      <p>Carregando produtos...</p>
    </section>
  );
  if (erro) return (
    <section>
      <h1>Aula 11 - Produtos da API Express</h1>
      <p>Erro: {erro}</p>
    </section>
  );

  if (produtos.length === 0) {
    return (
      <section>
        <h1>Aula 11 - Produtos da API Express</h1>
        <p>Nenhum produto encontrado.</p>
      </section>
    );
  }

  return (
    <section>
      <h1>Aula 11 - Produtos da API Express</h1>

      <ul aria-label="lista de produtos">
        {produtos.map((p) => (
          <li key={p._id ?? p.id}>
            {p.nome} — R$ {p.preco}
          </li>
        ))}
      </ul>
    </section>
  );
}