export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="927"
      height="927"
      fill="none"
      viewBox="0 0 927 927"
      className={className}
    >
      <circle
        cx="463.5"
        cy="463.5"
        r="427.5"
        stroke="currentColor"
        strokeWidth="72"
      ></circle>
      <path
        fill="currentColor"
        d="M170.146 463.5H585.012V878.366H170.146z"
        transform="rotate(-45 170.146 463.5)"
      ></path>
    </svg>
  );
}
