import Button from "../../components/Button/Button";
import PageContainer from "../../components/PageContainer/PageContainer";
import { HomeCategory, Product } from "../../types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePresenter.css";
import ProductGrid from "../../components/ProductGrid/ProductGrid";

interface HomePresenterProps {
  bestDeals: Product[];
  categories: HomeCategory[];
  isLoading: boolean;
  error: string;
}

function HomePresenter({
  categories,
  bestDeals,
  isLoading,
  error,
}: HomePresenterProps) {
  const navigate = useNavigate();
  const [showAllDeals, setShowAllDeals] = useState(false);
  const visibleProducts = showAllDeals ? bestDeals : bestDeals.slice(0, 4);

  return (
    <PageContainer>
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">LOOT MORE. PAY LESS.</p>
          <h1>
            Big Savings.
            <br />
            Big Discounts.
          </h1>
          <p className="home-hero__description">
            Discover deals in mobiles, fashion, home, and electronics.
          </p>
          <Button onClick={() => navigate("/products")}>Shop Now</Button>
        </div>
        <div className="home-hero__image">🎧</div>
      </section>
      {/* Categories */}
      <section className="home-section">
        <div className="page-heading">
          <h2>Top Categories</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              className="category-card"
              type="button"
              onClick={() => navigate(`/products/${category.name}`)}
            >
              <img src={category.icon} alt="" />
              <strong>{category.name}</strong>
            </button>
          ))}
        </div>
      </section>
      {/* Trending Deals */}
      <section className="home-section">
        <div className="page-heading">
          <h2>Best Deals</h2>
          {!isLoading && bestDeals.length > 4 && (
            <button
              type="button"
              className="view-all-button"
              aria-expanded={showAllDeals}
              onClick={() => setShowAllDeals((current) => !current)}
            >
              {showAllDeals ? "View less" : "View all"}
            </button>
          )}
        </div>
        {isLoading ? (
          <p role="status">Loading deals...</p>
        ) : error ? (
          <p className="products-empty-state" role="alert">
            {error}
          </p>
        ) : visibleProducts.length > 0 ? (
          <ProductGrid products={visibleProducts} columns={4} />
        ) : (
          <h4 className="products-empty-state">
            No item(s) found based on your filter.
          </h4>
        )}
      </section>
    </PageContainer>
  );
}

export default HomePresenter;
