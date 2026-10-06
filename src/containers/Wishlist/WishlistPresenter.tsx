import PageContainer from "../../components/PageContainer/PageContainer";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import { Product } from "../../types";
import "./WishlistPresenter.css";

interface WishlistPresenterProps {
  products: Product[];
}

function WishlistPresenter({ products }: WishlistPresenterProps) {
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
        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} />
        ) : (
          <p className="wishlist-page__empty">Your wishlist is empty.</p>
        )}
      </div>
    </PageContainer>
  );
}

export default WishlistPresenter;
