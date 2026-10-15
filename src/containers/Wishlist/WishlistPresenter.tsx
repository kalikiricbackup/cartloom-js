import PageContainer from "../../components/PageContainer/PageContainer";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import { WishlistItem } from "../../services/productService";
import "./WishlistPresenter.css";

interface WishlistPresenterProps {
  items: WishlistItem[];
  isLoading: boolean;
  error: string;
}

function WishlistPresenter({ items, isLoading, error }: WishlistPresenterProps) {
  const products = items.map((item) => item.product);

  return (
    <PageContainer>
      <div className="wishlist-page">
        <div className="wishlist-page__breadcrumb">
          <span>Home</span>
          <span>›</span>
          <span>Wishlist</span>
        </div>
        <header className="wishlist-page__header">
          <h1>My Wishlist</h1>
          <span>{products.length} Products</span>
        </header>
        {isLoading ? (
          <p role="status">Loading wishlist...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : products.length > 0 ? (
          <ProductGrid
            products={products}
            selectedVariants={items.map((item) => item.variant)}
            columns={4}
          />
        ) : (
          <p className="wishlist-page__empty">Your wishlist is empty.</p>
        )}
      </div>
    </PageContainer>
  );
}

export default WishlistPresenter;
