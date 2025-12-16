export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      {/* Broken lightbulb representing failed ideas */}
      <circle
        cx="50"
        cy="60"
        r="25"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeDasharray="5,5"
        opacity="0.6"
      />
      
      {/* Crack lines */}
      <path
        d="M 35 60 L 65 60 M 45 50 L 55 70 M 40 55 L 60 65"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Archive box/folder base */}
      <rect
        x="30"
        y="20"
        width="40"
        height="25"
        rx="3"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
      />
      
      {/* Folder tab */}
      <path
        d="M 30 20 L 30 15 L 50 15 L 53 20"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
      />
      
      {/* Base stand */}
      <rect
        x="45"
        y="85"
        width="10"
        height="10"
        rx="2"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M 42 87 L 58 87"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
