// ../utils/constants.js
export const COLORS = {
  primary: "#F5F7FA", // Light gray
  secondary: "#FFFFFF", // White
  green: "#10B981", // Green
  accent: "#00C4B4", // Teal
  textPrimary: "#1A1A1A", // Dark gray
  textSecondary: "#6B7280", // Medium gray
  background: "#F9FAFB", // Light gray fallback
  inputBackground: "#FFFFFF", // White
  border: "#E5E7EB", // Light gray
};
export function formatPrice(price) {
  if (typeof price !== "number") return "";
  return "$" + price.toFixed(2);
}
