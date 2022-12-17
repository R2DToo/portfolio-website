import styles from "../styles/layout.module.css";
import NavBar from "../components/NavBar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      <main className={styles.main}>{children}</main>
    </>
  );
}
