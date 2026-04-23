export function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount || 0);
}

export function getRelatedProducts(products, currentSlug, limit = 4) {
  const current = products.find((item) => item.slug === currentSlug);

  if (!current) {
    return products.slice(0, limit);
  }

  const sameCategory = products.filter(
    (item) => item.slug !== currentSlug && item.category?.slug === current.category?.slug
  );
  const fallback = products.filter(
    (item) => item.slug !== currentSlug && item.category?.slug !== current.category?.slug
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}
