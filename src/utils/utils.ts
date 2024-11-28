export const formatCurrency = (value: number) => {
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
