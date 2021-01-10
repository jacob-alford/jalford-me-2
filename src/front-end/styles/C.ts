export const C = {
  container_alt: "#1F2430",
  container: "#232834",
  text_primary: "#CBCCC6",
  text_secondary: "#616A7A",
  text_function: "#FFD580",
  text_keyword: "#FFA759",
  text_operator: "#F29E74",
  text_constructor: "#73D0FF",
  text_string: "#BAE67E",
  primary: "#60A5FA",
  success: "#54F780",
  danger: "#F73B41",
  warn: "#FFD952",
  border_radius: "16px",
  card_border: (color: string) => `1px solid ${color}`,
  divider: (thickness: 1 | 2 | 3) => `${thickness}px solid rgba(255, 255, 255, 0.23)`,
  shadow: (num: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) =>
    [
      "drop-shadow(2px 2px 6px rgba(0,0,0, 0.025))",
      "drop-shadow(2px 2px 8px rgba(0,0,0, 0.05))",
      "drop-shadow(2px 2px 8px rgba(0,0,0, 0.1))",
      "drop-shadow(2px 2px 8px rgba(0,0,0, 0.2))",
      "drop-shadow(4px 4px 9px rgba(0,0,0, 0.3))",
      "drop-shadow(6px 6px 10px rgba(0,0,0, 0.4))",
      "drop-shadow(8px 8px 11px rgba(0,0,0, 0.5))",
      "drop-shadow(10px 10px 11px rgba(0,0,0, 0.6))",
      "drop-shadow(12px 12px 20px rgba(0,0,0, 0.7))"
    ][num],
  spacing: (num: 0 | 1 | 2 | 3) => ["16px", "32px", "64px", "128px"][num]
} as const;
