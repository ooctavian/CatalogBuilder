export function format(value: number | null) {
  if (value === null) return "";
  return (value / 100).toLocaleString("en-US") + " \u{24}";
}

export function parseCurrency(input: string) {
  const nums = input.replace(/(,|\$|\s)/g, "").trim();
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
  return nums === "" ? null : Number.NaN;
}

export function formatCurrency(value: number | null) {
  if (value === null) return "";
  return `${value.toLocaleString("en-US")} \u{24}`;
}
