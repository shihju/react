// SPA - se desabilitar javascript do navegador para de buscar os dados
// SSR - se desabilitar javascript do navegador continua a buscar os dados, já que já foi montado o html pelo next.js server
// SSG - a página estática é exibida por x tempo, independente do número de pessoas que acessar nesse meio período,
//       vão acessar o mesmo conteúdo, fica mais performático. Não precisa de resposta real-time

import { useEffect } from "react";
import { GetStaticProps } from 'next';
import { api } from "../services/api";
import Image from 'next/image';

import { format, parseISO } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import styles from './home.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  latestEpisodes: Episode[]; //Array<Episode> 
  allEpisodes: Episode[];

}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {

  // Modelo SPA
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  // }, [])

  // No SSR ocorre na camada do servidor Next js log o print ocorre no servidor
  // console.log(props.episodes);

  // dont format data here, cause it is going to be done everytime
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos episódios</h2>

        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title} 
                  objectFit="cover"
                /> 

                <div className={styles.episodeDetails}>
                  <a href={`/episodes/${episode.id}`}>{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="./play-green.svg" alt="Tocar áudio"/>
                </button>
                
              </li>   
            )
          })}
        </ul>

      </section>


      <section className={styles.allEpisodes}>
          <h2>Todos episódios</h2>
          <table cellSpacing={0}>
            <thead>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </thead>

            <tbody>
              {
                allEpisodes.map(episode => {
                  return (
                    <tr key={episode.id}>
                      <td style={{ width: 72}}>
                        <Image 
                          width={120}
                          height={120}
                          src={episode.thumbnail}
                          alt={episode.title}
                          objectFit="cover"
                        />
                      </td>
                      <td>
                        <a href="">{episode.title}</a>
                      </td>
                      <td>{episode.members}</td>
                      <td style={{ width: 100}}>{episode.publishedAt}</td>
                      <td>{episode.durationAsString}</td>
                      <td>
                        <button type="button">
                          <img src="./play-green.svg" alt="Tocar áudio" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
      </section>
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
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes = data.map( episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBr}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }

  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);


  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8, // a cada 8 horas, será feita uma nova requisição ao api
  }
}