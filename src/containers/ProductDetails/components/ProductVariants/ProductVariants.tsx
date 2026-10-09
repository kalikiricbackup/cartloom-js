import { Product } from "../../../../types";
import "./ProductVariants.css";

interface ProductVariantsProps {
  product: Product;

  selectedOptions: Record<string, string>;

  onOptionChange: (type: string, value: string) => void;
}

function ProductVariants({
  product,
  selectedOptions,
  onOptionChange,
}: ProductVariantsProps) {
  const optionGroups = Array.from(
    new Set(
      product.variants.flatMap((variant) =>
        variant.options.map((option) => option.type),
      ),
    ),
  );

  return (
    <div className="product-variants">
      {optionGroups.map((type) => {
        const options = Array.from(
          new Set(
            product.variants.flatMap((variant) =>
              variant.options
                .filter((option) => option.type === type)
                .map((option) => option.value),
            ),
          ),
        );

        const label =
          product.variants
            .flatMap((variant) => variant.options)
            .find((option) => option.type === type)?.label ?? type;

        return (
          <section key={type} className="product-variants__group">
            <h3>
              {label}: <span>{selectedOptions[type] ?? "Select an option"}</span>
            </h3>

            <div className="product-variants__options">
              {options.map((value) => {
                const isSelected = selectedOptions[type] === value;

                const matchingVariants = product.variants.filter(
                  (variant) =>
                    variant.options.some(
                      (option) =>
                        option.type === type && option.value === value,
                    ) &&
                    Object.entries(selectedOptions).every(
                      ([selectedType, selectedValue]) =>
                        selectedType === type ||
                        variant.options.some(
                          (option) =>
                            option.type === selectedType &&
                            option.value === selectedValue,
                        ),
                    ),
                );

                const isUnavailable = matchingVariants.length === 0;
                const isOutOfStock =
                  !isUnavailable &&
                  matchingVariants.every((variant) => variant.stock === 0);

                return (
                  <button
                    key={value}
                    type="button"
                    className={
                      isSelected
                        ? "product-variants__option product-variants__option--selected"
                        : "product-variants__option"
                    }
                    disabled={isUnavailable || isOutOfStock}
                    onClick={() => onOptionChange(type, value)}
                  >
                    {value}

                    {isUnavailable && (
                      <span className="unavailable-option">Unavailable</span>
                    )}
                    {isOutOfStock && (
                      <span className="out-of-stock">Out of stock</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default ProductVariants;
