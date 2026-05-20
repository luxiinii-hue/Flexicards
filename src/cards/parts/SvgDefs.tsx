/**
 * Shared SVG <defs> — filters, patterns used across the card rendering tree.
 */
export function CardSvgDefs(): JSX.Element {
  return (
    <defs>
      <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="text-soft" x="-5%" y="-5%" width="110%" height="110%">
        <feGaussianBlur stdDeviation="0.5" />
      </filter>
      <pattern id="parchment" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="#f7f0dd" />
        <circle cx="6" cy="14" r="0.5" fill="#c5b388" opacity="0.4" />
        <circle cx="22" cy="28" r="0.5" fill="#c5b388" opacity="0.3" />
        <circle cx="32" cy="6" r="0.4" fill="#c5b388" opacity="0.3" />
      </pattern>
    </defs>
  );
}
