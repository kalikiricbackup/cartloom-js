import { Category, Product } from "../types";

export const categories: Category[] = [
  {
    id: 1,
    name: "Mobiles",
    icon: "📱",
  },
  {
    id: 2,
    name: "Fashion",
    icon: "👕",
  },
  {
    id: 3,
    name: "Electronics",
    icon: "💻",
  },
  {
    id: 5,
    name: "Beauty",
    icon: "🧴",
  },
];

function createVariantWithOptions(
  productId: number,
  variantKey: string,
  options: Product["variants"][number]["options"],
  price: number,
  originalPrice: number,
  stock: number,
  imageBackground: string,
  imageText: string,
) {
  return {
    id: `product-${productId}-${variantKey}`,
    options,
    price,
    originalPrice,
    stock,
    images: [
      `https://placehold.co/500x500/${imageBackground}/173268?text=${imageText}+${variantKey}`,
    ],
  };
}

function createOptionVariants(
  productId: number,
  optionGroups: Array<{
    type: string;
    label: string;
    values: string[];
  }>,
  price: number,
  originalPrice: number,
  stock: number,
  imageBackground: string,
  imageText: string,
) {
  const combinations = optionGroups.reduce<Record<string, string>[]>(
    (current, group) =>
      current.flatMap((combination) =>
        group.values.map((value) => ({
          ...combination,
          [group.type]: value,
        })),
      ),
    [{}],
  );

  return combinations.map((combination, index) => {
    const variantKey = Object.values(combination)
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return createVariantWithOptions(
      productId,
      variantKey,
      optionGroups.map((group) => ({
        type: group.type,
        label: group.label,
        value: combination[group.type],
      })),
      price + index * 500,
      originalPrice + index * 500,
      Math.max(stock - index, 1),
      imageBackground,
      imageText,
    );
  });
}

export const trendingProducts: Product[] = [
  {
    id: 1,
    name: "Apple iPhone 15",
    description:
      "Apple iPhone 15 with an advanced camera system, powerful performance and beautiful design.",
    category: "Mobiles",
    subCategory: "Smartphones",
    brand: "Apple",
    rating: 4.8,
    reviews: 18,
    badge: "BESTSELLER",
    offers: [
      "Bank Offer Flat ₹2,000 off on HDFC Bank Cards",
      "No Cost EMI Starting from ₹3,333/month",
      "Exchange Offer Up to ₹10,000 off",
    ],
    variants: [
      {
        id: "iphone15-pink-128",
        options: [
          {
            type: "color",
            label: "Color",
            value: "Pink",
          },
          {
            type: "storage",
            label: "Storage",
            value: "128 GB",
          },
        ],

        price: 69999,
        originalPrice: 79999,
        stock: 8,
        images: [
          "https://placehold.co/500x500/fce4ec/173268?text=iPhone+Pink+Front",
          "https://placehold.co/500x500/f8bbd0/173268?text=iPhone+Pink+Back",
          "https://placehold.co/500x500/f48fb1/173268?text=iPhone+Pink+Side",
          "https://placehold.co/500x500/f06292/ffffff?text=iPhone+Pink+Camera",
        ],
      },

      {
        id: "iphone15-pink-256",
        options: [
          {
            type: "color",
            label: "Color",
            value: "Pink",
          },

          {
            type: "storage",
            label: "Storage",
            value: "256 GB",
          },
        ],

        price: 79999,
        originalPrice: 89999,
        stock: 5,
        images: [
          "https://placehold.co/500x500/fce4ec/173268?text=iPhone+Pink+Front",
          "https://placehold.co/500x500/f8bbd0/173268?text=iPhone+Pink+Back",
          "https://placehold.co/500x500/f48fb1/173268?text=iPhone+Pink+Side",
          "https://placehold.co/500x500/f06292/ffffff?text=iPhone+Pink+Camera",
        ],
      },

      {
        id: "iphone15-blue-128",
        options: [
          {
            type: "color",
            label: "Color",
            value: "Blue",
          },

          {
            type: "storage",
            label: "Storage",
            value: "128 GB",
          },
        ],

        price: 68999,
        originalPrice: 78999,
        stock: 12,
        images: [
          "https://placehold.co/500x500/e3f2fd/173268?text=iPhone+Blue+Front",
          "https://placehold.co/500x500/90caf9/173268?text=iPhone+Blue+Back",
          "https://placehold.co/500x500/64b5f6/173268?text=iPhone+Blue+Side",
          "https://placehold.co/500x500/42a5f5/ffffff?text=iPhone+Blue+Camera",
        ],
      },

      {
        id: "iphone15-black-128",
        options: [
          {
            type: "color",
            label: "Color",
            value: "Black",
          },

          {
            type: "storage",
            label: "Storage",
            value: "128 GB",
          },
        ],

        price: 67999,
        originalPrice: 77999,
        stock: 0,
        images: [
          "https://placehold.co/500x500/eeeeee/173268?text=iPhone+Black+Front",
          "https://placehold.co/500x500/424242/ffffff?text=iPhone+Black+Back",
          "https://placehold.co/500x500/212121/ffffff?text=iPhone+Black+Side",
          "https://placehold.co/500x500/000000/ffffff?text=iPhone+Black+Camera",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Samsung Galaxy S24",
    description: "Premium Samsung smartphone.",
    category: "Mobiles",
    subCategory: "Smartphones",
    brand: "Samsung",
    rating: 1.7,
    reviews: 11,
    offers: ["Bank Offer Flat ₹1,500 off on select cards"],
    variants: [
      ...[
        ["Onyx Black", "111111"],
        ["Marble Gray", "b0bec5"],
        ["Cobalt Violet", "b39ddb"],
        ["Amber Yellow", "fff176"],
      ].flatMap(([color, imageBackground], colorIndex) =>
        ["128 GB", "256 GB"].map((storage, storageIndex) =>
          createVariantWithOptions(
            2,
            `${color.toLowerCase().replace(/\s+/g, "-")}-${storage
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
            [
              { type: "color", label: "Color", value: color },
              { type: "storage", label: "Storage", value: storage },
            ],
            74999 + colorIndex * 1000 + storageIndex * 5000,
            81999 + colorIndex * 1000 + storageIndex * 5000,
            12 - colorIndex - storageIndex,
            imageBackground,
            "Galaxy+S24",
          ),
        ),
      ),
    ],
  },
  {
    id: 3,
    name: "OnePlus 12R",
    description: "Powerful OnePlus smartphone.",
    category: "Mobiles",
    subCategory: "Smartphones",
    brand: "OnePlus",
    rating: 3.6,
    reviews: 14,
    offers: ["No Cost EMI available on select cards"],
    variants: createOptionVariants(
      3,
      [
        { type: "color", label: "Color", values: ["Cool Blue", "Iron Gray"] },
        { type: "storage", label: "Storage", values: ["128 GB", "256 GB"] },
      ],
      39999,
      44999,
      9,
      "e3f2fd",
      "OnePlus+12R",
    ),
  },
  {
    id: 4,
    name: "Google Pixel 9",
    description: "Google Pixel smartphone.",
    category: "Mobiles",
    subCategory: "Smartphones",
    brand: "Google",
    rating: 4.8,
    reviews: 21,
    offers: ["Exchange Offer Up to ₹8,000 off"],
    variants: createOptionVariants(
      4,
      [
        {
          type: "color",
          label: "Color",
          values: ["Obsidian", "Porcelain", "Wintergreen", "Peony"],
        },
        { type: "storage", label: "Storage", values: ["128 GB", "256 GB"] },
      ],
      79999,
      89999,
      7,
      "f3e5f5",
      "Pixel+9",
    ),
  },
  {
    id: 5,
    name: "iPhone 15 Pro",
    description: "Premium Apple smartphone.",
    category: "Mobiles",
    subCategory: "Smartphones",
    brand: "Apple",
    rating: 1.9,
    reviews: 32,
    offers: ["Bank Offer Flat ₹2,000 off on HDFC Bank Cards"],
    variants: createOptionVariants(
      5,
      [
        {
          type: "color",
          label: "Color",
          values: [
            "Natural Titanium",
            "Blue Titanium",
            "Black Titanium",
            "White Titanium",
          ],
        },
        {
          type: "storage",
          label: "Storage",
          values: ["128 GB", "256 GB", "512 GB"],
        },
      ],
      129999,
      139999,
      5,
      "e0e0e0",
      "iPhone+15+Pro",
    ),
  },
  {
    id: 6,
    name: "Samsung Galaxy A55",
    description: "Samsung mid-range smartphone.",
    category: "Mobiles",
    subCategory: "Smartphones",
    brand: "Samsung",
    rating: 2.5,
    reviews: 25,
    offers: ["Additional exchange bonus up to ₹3,000"],
    variants: createOptionVariants(
      6,
      [
        {
          type: "color",
          label: "Color",
          values: [
            "Awesome Navy",
            "Awesome Iceblue",
            "Awesome Lilac",
            "Awesome Lemon",
          ],
        },
        { type: "storage", label: "Storage", values: ["128 GB", "256 GB"] },
      ],
      34999,
      39999,
      14,
      "e8eaf6",
      "Galaxy+A55",
    ),
  },
  {
    id: 7,
    name: "MacBook Air M3",
    description: "Lightweight Apple laptop for work and study.",
    category: "Electronics",
    subCategory: "Laptops",
    brand: "Apple",
    rating: 3.8,
    reviews: 27,
    offers: ["No Cost EMI Starting from ₹4,792/month"],
    variants: createOptionVariants(
      7,
      [
        {
          type: "color",
          label: "Color",
          values: ["Midnight", "Starlight", "Silver", "Space Gray"],
        },
        { type: "memory", label: "Memory", values: ["8 GB", "16 GB"] },
        { type: "storage", label: "Storage", values: ["256 GB", "512 GB"] },
      ],
      114999,
      124999,
      6,
      "e3f2fd",
      "MacBook+Air+M3",
    ),
    badge: "TRENDING",
  },
  {
    id: 8,
    name: "Samsung Galaxy Book4",
    description: "Slim Samsung laptop with a bright display.",
    category: "Electronics",
    subCategory: "Laptops",
    brand: "Samsung",
    rating: 2.5,
    reviews: 16,
    offers: ["Free wireless mouse with select orders"],
    variants: createOptionVariants(
      8,
      [
        { type: "color", label: "Color", values: ["Gray", "Silver"] },
        { type: "memory", label: "Memory", values: ["16 GB", "32 GB"] },
        { type: "storage", label: "Storage", values: ["512 GB", "1 TB"] },
      ],
      84999,
      94999,
      8,
      "eceff1",
      "Galaxy+Book4",
    ),
  },
  {
    id: 9,
    name: "iPad Air",
    description: "Powerful Apple tablet for creativity and entertainment.",
    category: "Electronics",
    subCategory: "Tablets",
    brand: "Apple",
    rating: 4.7,
    reviews: 22,
    offers: ["Bank Offer Flat ₹1,000 off on select cards"],
    variants: createOptionVariants(
      9,
      [
        {
          type: "color",
          label: "Color",
          values: ["Blue", "Purple", "Starlight", "Space Gray"],
        },
        {
          type: "storage",
          label: "Storage",
          values: ["128 GB", "256 GB", "512 GB"],
        },
      ],
      59999,
      64999,
      10,
      "e3f2fd",
      "iPad+Air",
    ),
  },
  {
    id: 10,
    name: "OnePlus Pad 2",
    description: "Fast OnePlus tablet with a smooth high-refresh display.",
    category: "Electronics",
    subCategory: "Tablets",
    brand: "OnePlus",
    rating: 1.6,
    reviews: 19,
    offers: ["Free folio case on prepaid orders"],
    variants: createOptionVariants(
      10,
      [
        {
          type: "color",
          label: "Color",
          values: ["Halo Green", "Nimbus Gray"],
        },
        {
          type: "storage",
          label: "Storage",
          values: ["128 GB", "256 GB", "512 GB"],
        },
      ],
      39999,
      44999,
      11,
      "e8f5e9",
      "OnePlus+Pad+2",
    ),
  },
  {
    id: 11,
    name: "Apple Magic Keyboard",
    description: "Compact wireless keyboard for Apple devices.",
    category: "Electronics",
    subCategory: "Accessories",
    brand: "Apple",
    rating: 1.4,
    reviews: 13,
    offers: ["Flat ₹500 off on orders above ₹5,000"],
    variants: createOptionVariants(
      11,
      [
        { type: "color", label: "Color", values: ["White", "Black"] },
        {
          type: "layout",
          label: "Layout",
          values: ["US English", "UK English"],
        },
      ],
      9999,
      11999,
      18,
      "eeeeee",
      "Magic+Keyboard",
    ),
  },
  {
    id: 12,
    name: "Samsung Galaxy Buds3",
    description: "Wireless Samsung earbuds with active noise cancellation.",
    category: "Electronics",
    subCategory: "Accessories",
    brand: "Samsung",
    rating: 2.3,
    reviews: 17,
    offers: ["Extra 5% off with select bank cards"],
    variants: createOptionVariants(
      12,
      [
        { type: "color", label: "Color", values: ["White", "Silver"] },
        {
          type: "bundle",
          label: "Bundle",
          values: ["Earbuds Only", "With Wireless Charging Case"],
        },
      ],
      12999,
      14999,
      15,
      "f5f5f5",
      "Galaxy+Buds3",
    ),
  },
  {
    id: 13,
    name: "Nike Air Max 270",
    description: "Cushioned everyday sneakers with a breathable design.",
    category: "Fashion",
    subCategory: "Footwear",
    brand: "Nike",
    rating: 4.6,
    reviews: 34,
    offers: ["Buy 2 fashion items and get 10% off"],
    variants: createOptionVariants(
      13,
      [
        { type: "color", label: "Color", values: ["Black", "White", "Red"] },
        {
          type: "size",
          label: "Size",
          values: ["UK 7", "UK 8", "UK 9", "UK 10"],
        },
      ],
      8999,
      10999,
      13,
      "fce4ec",
      "Air+Max+270",
    ),
    badge: "TRENDING",
  },
  {
    id: 14,
    name: "Adidas Essentials Hoodie",
    description: "Soft cotton-blend hoodie for comfortable everyday wear.",
    category: "Fashion",
    subCategory: "Clothing",
    brand: "Adidas",
    rating: 4.4,
    reviews: 26,
    offers: ["Extra 10% off on prepaid orders"],
    variants: createOptionVariants(
      14,
      [
        { type: "color", label: "Color", values: ["Black", "Gray", "Navy"] },
        {
          type: "size",
          label: "Size",
          values: ["Small", "Medium", "Large", "XL"],
        },
      ],
      2499,
      3499,
      20,
      "e0e0e0",
      "Essentials+Hoodie",
    ),
  },
  {
    id: 15,
    name: "Nike Everyday Backpack",
    description: "Durable laptop backpack with spacious storage.",
    category: "Fashion",
    subCategory: "Bags",
    brand: "Nike",
    rating: 4.3,
    reviews: 18,
    offers: ["Free delivery on this product"],
    variants: createOptionVariants(
      15,
      [
        { type: "color", label: "Color", values: ["Black", "Gray", "Navy"] },
        { type: "capacity", label: "Capacity", values: ["20 L", "25 L"] },
      ],
      2999,
      3999,
      16,
      "eceff1",
      "Everyday+Backpack",
    ),
  },
  {
    id: 16,
    name: "Sony WH-1000XM5",
    description: "Premium wireless headphones with active noise cancellation.",
    category: "Electronics",
    subCategory: "Audio",
    brand: "Sony",
    rating: 4.8,
    reviews: 41,
    offers: ["No Cost EMI Starting from ₹2,250/month"],
    variants: createOptionVariants(
      16,
      [
        { type: "color", label: "Color", values: ["Black", "Silver"] },
        {
          type: "bundle",
          label: "Bundle",
          values: ["Headphones Only", "With Travel Case"],
        },
      ],
      26999,
      34990,
      4,
      "eeeeee",
      "WH-1000XM5",
    ),
    badge: "BESTSELLER",
  },
  {
    id: 17,
    name: "Canon EOS R50",
    description: "Compact mirrorless camera for photos and video.",
    category: "Electronics",
    subCategory: "Cameras",
    brand: "Canon",
    rating: 4.7,
    reviews: 15,
    offers: ["Free camera bag with this product"],
    variants: createOptionVariants(
      17,
      [
        { type: "color", label: "Color", values: ["Black"] },
        {
          type: "configuration",
          label: "Configuration",
          values: ["Body Only", "18-45mm Kit"],
        },
      ],
      64999,
      72999,
      5,
      "eeeeee",
      "EOS+R50",
    ),
  },
  {
    id: 18,
    name: "Lakme Absolute Skin Dew Serum",
    description: "Hydrating face serum for a fresh, glowing look.",
    category: "Beauty",
    subCategory: "Skincare",
    brand: "Lakme",
    rating: 4.5,
    reviews: 29,
    offers: ["Buy 2 skincare products and save 10%"],
    variants: createOptionVariants(
      18,
      [
        { type: "size", label: "Size", values: ["30 ml", "50 ml"] },
        { type: "pack", label: "Pack", values: ["Single", "Pack of 2"] },
      ],
      699,
      899,
      24,
      "e0f7fa",
      "Skin+Dew+Serum",
    ),
  },
  {
    id: 19,
    name: "Maybelline Fit Me Foundation",
    description: "Lightweight foundation with a natural matte finish.",
    category: "Beauty",
    subCategory: "Makeup",
    brand: "Maybelline",
    rating: 4.4,
    reviews: 37,
    offers: ["Flat ₹100 off on beauty orders above ₹999"],
    variants: createOptionVariants(
      19,
      [
        {
          type: "shade",
          label: "Shade",
          values: ["Porcelain", "Natural Beige", "Warm Nude", "Sun Beige"],
        },
        { type: "size", label: "Size", values: ["30 ml", "50 ml"] },
      ],
      549,
      699,
      30,
      "fff3e0",
      "Fit+Me+Foundation",
    ),
  },
  {
    id: 20,
    name: "Lakme Nourish Hair Mask",
    description: "Nourishing hair mask for smooth, manageable hair.",
    category: "Beauty",
    subCategory: "Haircare",
    brand: "Lakme",
    rating: 4.2,
    reviews: 21,
    offers: ["Extra 5% off on prepaid orders"],
    variants: createOptionVariants(
      20,
      [
        { type: "size", label: "Size", values: ["250 g", "500 g"] },
        { type: "pack", label: "Pack", values: ["Single", "Pack of 2"] },
      ],
      449,
      599,
      22,
      "fff8e1",
      "Nourish+Hair+Mask",
    ),
  },
];

export const productRating = [4, 3, 2, 1];
