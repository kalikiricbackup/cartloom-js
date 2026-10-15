import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import PageContainer from "../../components/PageContainer/PageContainer";
import {
  addProductToWishlist,
  getWishlistErrorMessage,
  getProductById,
  removeProductFromWishlist,
} from "../../services/productService";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { Product } from "../../types";
import ProductDetailsPresenter from "./ProductDetailsPresenter";

function ProductDetailsContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const productId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isWishlisted = useAppSelector((state) =>
    state.wishlist.productIds.includes(productId),
  );
  const [isWishlistUpdating, setIsWishlistUpdating] = useState(false);
  const [wishlistDialog, setWishlistDialog] = useState<
    "login" | "variant" | "error" | null
  >(null);
  const [wishlistErrorMessage, setWishlistErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setProduct(null);
      setSelectedOptions({});
      setSelectedImageIndex(0);
      setError("");

      if (!id || !Number.isInteger(productId)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await getProductById(productId, controller.signal);
        setProduct(response);

        const initialVariant =
          response.variants.find((variant) => variant.stock > 0) ??
          response.variants[0];
        setSelectedOptions(
          initialVariant?.options.reduce(
            (options, option) => ({
              ...options,
              [option.type]: option.value,
            }),
            {} as Record<string, string>,
          ) ?? {},
        );
      } catch (requestError: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        const apiMessage = isAxiosError<{
          detail?: string;
          message?: string;
        }>(requestError)
          ? (requestError.response?.data?.detail ??
            requestError.response?.data?.message)
          : undefined;

        setError(
          typeof apiMessage === "string"
            ? apiMessage
            : "Unable to load this product. Please try again later.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => controller.abort();
  }, [id, productId]);

  const selectedVariant = useMemo(() => {
    if (!product) {
      return undefined;
    }

    return product.variants.find((variant) =>
      variant.options.every(
        (option) => selectedOptions[option.type] === option.value,
      ),
    );
  }, [product, selectedOptions]);

  if (isLoading) {
    return (
      <PageContainer>
        <p role="status">Loading product...</p>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="product-details-not-found" role="alert">
          <h1>Unable to Load Product</h1>
          <p>{error}</p>
        </div>
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer>
        <div className="product-details-not-found">
          <h1>Product Not Found</h1>
          <p>The product you are looking for does not exist.</p>
        </div>
      </PageContainer>
    );
  }

  const handleOptionChange = (type: string, value: string) => {
    const variantsForOption = product.variants.filter((variant) =>
      variant.options.some(
        (option) => option.type === type && option.value === value,
      ),
    );
    const variantsMatchingOtherSelections = variantsForOption.filter(
      (variant) =>
        Object.entries(selectedOptions).every(
          ([selectedType, selectedValue]) =>
            selectedType === type ||
            variant.options.some(
              (option) =>
                option.type === selectedType && option.value === selectedValue,
            ),
        ),
    );
    const nextVariant =
      variantsMatchingOtherSelections.find((variant) => variant.stock > 0) ??
      variantsForOption.find((variant) => variant.stock > 0) ??
      variantsMatchingOtherSelections[0] ??
      variantsForOption[0];

    if (!nextVariant) {
      return;
    }

    setSelectedOptions(
      nextVariant.options.reduce(
        (options, option) => ({
          ...options,
          [option.type]: option.value,
        }),
        {} as Record<string, string>,
      ),
    );

    setSelectedImageIndex(0);
  };

  const handleAddToCart = () => {
    console.log("Add to Cart", {
      product,
      selectedVariant,
    });
  };

  const handleBuyNow = () => {
    console.log("Buy Now", {
      product,
      selectedVariant,
    });
  };

  const closeWishlistDialog = () => {
    setWishlistDialog(null);
  };

  const confirmWishlistDialog = () => {
    if (wishlistDialog === "login") {
      closeWishlistDialog();
      navigate("/login");
      return;
    }

    closeWishlistDialog();
  };

  const handleWishlistChange = async () => {
    if (!isAuthenticated) {
      setWishlistDialog("login");
      return;
    }

    if (!selectedVariant) {
      setWishlistDialog("variant");
      return;
    }
    console.log("selectedVariant is--", selectedVariant);

    if (isWishlistUpdating) {
      return;
    }

    setIsWishlistUpdating(true);

    try {
      if (isWishlisted) {
        await removeProductFromWishlist(product.id);
        dispatch(removeFromWishlist(product.id));
      } else {
        await addProductToWishlist({
          product_id: product.id,
          variant_id: selectedVariant.variantid,
        });
        dispatch(addToWishlist(product.id));
      }
    } catch (error: unknown) {
      setWishlistErrorMessage(getWishlistErrorMessage(error));
      setWishlistDialog("error");
    } finally {
      setIsWishlistUpdating(false);
    }
  };

  const wishlistDialogContent = {
    login: {
      title: "Sign in to save this item",
      message: "Please log in first to add this item to your wishlist.",
      confirmLabel: "Go to login",
      cancelLabel: "Maybe later",
    },
    variant: {
      title: "Choose a product option",
      message:
        "Please select a variant combination before adding this item to your wishlist.",
      confirmLabel: "Got it",
      cancelLabel: "Close",
    },
    error: {
      title: "Wishlist update failed",
      message: wishlistErrorMessage,
      confirmLabel: "Got it",
      cancelLabel: "Close",
    },
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.description,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      console.log("Product URL copied to clipboard");
    } catch (error) {
      console.error("Unable to share product", error);
    }
  };

  return (
    <>
      <ProductDetailsPresenter
        product={product}
        selectedVariant={selectedVariant}
        selectedOptions={selectedOptions}
        selectedImageIndex={selectedImageIndex}
        isWishlisted={isWishlisted}
        isWishlistUpdating={isWishlistUpdating}
        onOptionChange={handleOptionChange}
        onImageChange={setSelectedImageIndex}
        onWishlistChange={handleWishlistChange}
        onShare={handleShare}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />
      {wishlistDialog && (
        <ConfirmDialog
          isOpen
          title={wishlistDialogContent[wishlistDialog].title}
          message={wishlistDialogContent[wishlistDialog].message}
          confirmLabel={wishlistDialogContent[wishlistDialog].confirmLabel}
          cancelLabel={wishlistDialogContent[wishlistDialog].cancelLabel}
          onCancel={closeWishlistDialog}
          onConfirm={confirmWishlistDialog}
        />
      )}
    </>
  );
}

export default ProductDetailsContainer;
