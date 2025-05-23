export const formatPrice = (price) => {
  return `₹${parseInt(price).toLocaleString("en-IN")}`;
};
