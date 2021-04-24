import '../styles/global.scss';
import { Header } from "../components/Header";

// Coisas que estão sempre em toda aplicação devem estar no app

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Header />
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp
