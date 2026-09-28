import "./ProductOffers.css";

interface ProductOffersProps {
  offers: string[];
}

function ProductOffers({ offers }: ProductOffersProps) {
  if (offers.length === 0) {
    return null;
  }

  return (
    <section className="product-offers">
      <h2>Available Offers</h2>

      {offers.map((offer) => (
        <div key={offer} className="product-offers__item">
          <span>✦</span>
          <p>{offer}</p>
        </div>
      ))}
    </section>
  );
}

export default ProductOffers;
