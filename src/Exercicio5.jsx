import { useEffect, useState } from "react";
import ListaUsuarios from "./ListaUsuarios";

function Exercicio5() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function buscarUsuarios() {
      const resposta = await fetch('https://jsonplaceholder.typicode.com/users');
      const dados = await resposta.json();
      setUsuarios(dados);
    }

    buscarUsuarios();
  }, []);

  return (
    <>
      <section id="center">
        <h1>Exercício 5</h1>
        <ListaUsuarios usuarios={usuarios} />
      </section>
    </>
  );
}

export default Exercicio5;