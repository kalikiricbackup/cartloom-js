import Button from "../../components/Button/Button";
import PageContainer from "../../components/PageContainer/PageContainer";
import { Category, Product } from "../../types";
import { useNavigate } from "react-router-dom";
import "./HomePresenter.css";

interface HomePresenterProps {
  userName: string;
  products: Product[];
  categories: Category[];
}

function HomePresenter({ userName, categories, products }: HomePresenterProps) {
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
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.id} className="home-product-card">
              <div className="home-product-card__image">
                <button
                  type="button"
                  className="wishlist-button"
                  aria-label={`Add ${product.name} to wishlist`}
                >
                  ♡
                </button>
                <span className="product-image">
                  {product.variants[0]?.images[0] ?? ""}
                </span>
              </div>
              <div className="home-product-card__content">
                {product.badge && (
                  <p className="product-badge">{product.badge}</p>
                )}
                <h3>{product.name}</h3>
                <p className="product-rating">
                  ★ {product.rating}
                  <span> ({product.reviews} left)</span>
                </p>
                <div className="product-price">
                  <strong>
                    ₹{product.variants[0]?.price.toLocaleString("en-IN")}
                  </strong>
                  <del>
                    ₹
                    {product.variants[0]?.originalPrice.toLocaleString("en-IN")}
                  </del>
                </div>
                <Button
                  onClick={() => {
                    console.log(`Add ${product.name} to cart`);
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

export default HomePresenter;
