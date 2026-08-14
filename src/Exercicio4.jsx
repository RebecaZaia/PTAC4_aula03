import { useEffect, useState } from "react";

function Exercicio4() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function buscarUsuario() {
      const resposta = await fetch('https://jsonplaceholder.typicode.com/users/5');
      const dados = await resposta.json();
      setUsuario(dados);
    }
    buscarUsuario();
  }, []);

  if (usuario === null) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <section id="center">
        <h1>Exercício 4</h1>
        <h1>{usuario.name}</h1>
        <p>{usuario.email}</p>
        <br />
      </section>
    </>
  );
}

export default Exercicio4;