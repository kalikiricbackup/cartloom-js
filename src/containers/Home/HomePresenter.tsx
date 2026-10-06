import Button from "../../components/Button/Button";
import PageContainer from "../../components/PageContainer/PageContainer";
import { Category, Product } from "../../types";
import { useNavigate } from "react-router-dom";
import "./HomePresenter.css";
import ProductGrid from "../../components/ProductGrid/ProductGrid";

interface HomePresenterProps {
  products: Product[];
  categories: Category[];
}

function HomePresenter({ categories, products }: HomePresenterProps) {
  const navigate = useNavigate();

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
              <span>{category.icon}</span>
              <strong>{category.name}</strong>
            </button>
          ))}
        </div>
      </section>
      {/* Trending Deals */}
      <section className="home-section">
        <div className="page-heading">
          <h2>Trending Deals</h2>
          <button
            type="button"
            className="view-all-button"
            onClick={() => navigate("/products")}
          >
            View all
          </button>
        </div>
        {products.length > 0 ? (
          <ProductGrid products={products} columns={4} />
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
