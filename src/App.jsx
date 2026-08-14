import "./App.css";
import Exercicio1 from "./Exercicio1";
import Exercicio2 from "./Exercicio2";
import Exercicio4 from "./Exercicio4";
import Exercicio5 from "./Exercicio5";

function App() {
  return (
    <>
      <Exercicio1 />
      <Exercicio2 />
      <section id="center">
        <h1>Exercício 3</h1>
        <p>A API ReqRes está retornando erro 401 (Unauthorized), tanto no fetch quanto ao acessar o link diretamente. Por isso, os dados do exercício não estão sendo carregados.</p>
        <br />
      </section>
      <Exercicio4 />
      <Exercicio5 />
    </>
  )
}

export default App