type InstagramIconProps = {
  className?: string;
};

export default function InstagramIcon({ className = "" }: InstagramIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <rect
        x="4.25"
        y="4.25"
        width="15.5"
        height="15.5"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.9" cy="7.1" r="1.15" fill="currentColor" />
    </svg>
  );
}
