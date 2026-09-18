import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./AppLayout.css";

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-layout__content">{children}</main>
      <Footer />
    </div>
  );
}
export default AppLayout;
