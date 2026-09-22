import { categories, trendingProducts } from "../../services/mockApi";
import { getRandomFourUnique } from "../../utils/Utility";
import HomePresenter from "./HomePresenter";

function HomeContainer() {
  const userName = "Sainath";
  const trendingPrds = getRandomFourUnique(trendingProducts);
  return (
    <HomePresenter
      userName={userName}
      categories={categories}
      products={trendingPrds}
    />
  );
}

export default HomeContainer;
