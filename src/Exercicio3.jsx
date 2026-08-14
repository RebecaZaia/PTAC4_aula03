import { useEffect, useState } from 'react'

function Exercicio3() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function buscarUsuarios() {
      const resposta = await fetch("https://reqres.in/api/users?page=2");
      const dados = await resposta.json();
      setUsuarios(dados.data);
    }
    buscarUsuarios();
  }, []);
  console.log(usuarios);

  return (
    <>
      <section id="center">
        <h1>Exercício 3</h1>

        <ul>
          {usuarios.map((usuario) => (
            <li key={usuario.id}>
              {usuario.first_name} {usuario.last_name} - {usuario.email}
            </li>
          ))}
        </ul>
        <br />
      </section>
    </>
  )
}

export default Exercicio3