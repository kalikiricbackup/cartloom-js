import { trendingProducts } from "../../services/mockApi";
import WishlistPresenter from "./WishlistPresenter";

function WishlistContainer() {
  return <WishlistPresenter products={trendingProducts} />;
}

export default WishlistContainer;
