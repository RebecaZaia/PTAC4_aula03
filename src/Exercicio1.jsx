import { useEffect, useState } from 'react'

function Exercicio1() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function buscarPosts() {
      const resposta = await fetch("https://jsonplaceholder.typicode.com/posts");
      const dados = await resposta.json();
      setPosts(dados.slice(0, 10));
    }
    buscarPosts();
  }, []);
  console.log(posts);

  return (
    <>
      <section id="center">
        <h1>Exercício 1</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {post.id} - {post.title}
            </li>
          ))}
        </ul>
        <br />
      </section>
    </>
  )
}

export default Exercicio1