// SPA - se desabilitar javascript do navegador para de buscar os dados
// SSR - se desabilitar javascript do navegador continua a buscar os dados, já que já foi montado o html pelo next.js server
// SSG - a página estática é exibida por x tempo, independente do número de pessoas que acessar nesse meio período,
//       vão acessar o mesmo conteúdo, fica mais performático. Não precisa de resposta real-time

import { useEffect } from "react";
import { GetStaticProps } from 'next';

type Episode = {
  id: string;
  title: string;
  members: string;
    // ...
}

type HomeProps = {
  episodes: Episode[]; //Array<Episode> 
}

export default function Home(props: HomeProps) {

  // Modelo SPA
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  // }, [])

  // No SSR ocorre na camada do servidor Next js log o print ocorre no servidor
  console.log(props.episodes);

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

// Modelo SSR, é chamado toda vez que acessam a home
// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }


// SSG só funciona em produção, para isso é necessário fazer uma build e rodar em prod
// yarn build
// yarn start
export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch('http://localhost:3333/episodes?_limit=12&_sort=published_at&_order=desc');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8, // a cada 8 horas, será feita uma nova requisição ao api
  }
}