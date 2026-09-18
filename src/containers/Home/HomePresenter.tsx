import Button from "../../components/Button/Button";
import PageContainer from "../../components/PageContainer/PageContainer";

interface HomePresenterProps {
  userName: string;
}

function HomePresenter({ userName }: HomePresenterProps) {
  return (
    <PageContainer>
      <h1>CartLoom Home</h1>

      <p>Welcome, {userName}!</p>

      <Button onClick={() => console.log("Shop Now clicked")}>Shop Now</Button>
    </PageContainer>
  );
}

export default HomePresenter;
