import "./ProductGallery.css";

interface ProductGalleryProps {
  images: string[];

  selectedImageIndex: number;

  onImageChange: (index: number) => void;
}

function ProductGallery({
  images,
  selectedImageIndex,
  onImageChange,
}: ProductGalleryProps) {
  const selectedImage = images[selectedImageIndex] ?? images[0];

  return (
    <div className="product-gallery">
      <div className="product-gallery__thumbnails">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            className={
              index === selectedImageIndex
                ? "product-gallery__thumbnail product-gallery__thumbnail--active"
                : "product-gallery__thumbnail"
            }
            onClick={() => onImageChange(index)}
          >
            <img src={image} alt={`Product view ${index + 1}`} />
          </button>
        ))}
      </div>

      <div className="product-gallery__main">
        <img src={selectedImage} alt="Selected product" />
      </div>
    </div>
  );
}

export default ProductGallery;
