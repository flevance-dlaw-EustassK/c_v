import { Link } from "react-router-dom";
import { PageContainer } from "../../components/layout/PageContainer/PageContainer";
import styles from "./NotFound.module.css";

export function NotFound() {
  return (
    <PageContainer>
      <section aria-labelledby="not-found-title" className={styles.page}>
        <span>СЛЕДУЮЩИЙ КАДР СКОРО</span>
        <h1 id="not-found-title">Кажется, мы<br />потеряли <i>сюжет.</i></h1>
        <p>Страница сменила сценарий. Давайте вернёмся к тому, что ещё предстоит посмотреть.</p>
        <Link to="/">Вернуться на главную <b>→</b></Link>
        <small>CINEVAULT&nbsp; · &nbsp;404</small>
      </section>
    </PageContainer>
  );
}
