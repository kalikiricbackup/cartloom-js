import { categories, trendingProducts } from "../../services/mockApi";
import { getRandomFourUnique } from "../../utils/Utility";
import HomePresenter from "./HomePresenter";

function HomeContainer() {
  const trendingPrds = getRandomFourUnique(trendingProducts);
  return <HomePresenter categories={categories} products={trendingPrds} />;
}

export default HomeContainer;
