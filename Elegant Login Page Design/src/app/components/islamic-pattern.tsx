export function IslamicPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-5"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="islamic-pattern"
          x="0"
          y="0"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          {/* Star Pattern */}
          <path
            d="M50 10 L60 40 L90 40 L65 57 L75 87 L50 70 L25 87 L35 57 L10 40 L40 40 Z"
            fill="none"
            stroke="#1a4d4d"
            strokeWidth="0.5"
          />
          {/* Octagon */}
          <path
            d="M30 20 L70 20 L85 35 L85 65 L70 80 L30 80 L15 65 L15 35 Z"
            fill="none"
            stroke="#d4af7a"
            strokeWidth="0.5"
          />
          {/* Small circles */}
          <circle cx="50" cy="50" r="5" fill="none" stroke="#1a4d4d" strokeWidth="0.5" />
          <circle cx="20" cy="20" r="3" fill="none" stroke="#d4af7a" strokeWidth="0.5" />
          <circle cx="80" cy="20" r="3" fill="none" stroke="#d4af7a" strokeWidth="0.5" />
          <circle cx="20" cy="80" r="3" fill="none" stroke="#d4af7a" strokeWidth="0.5" />
          <circle cx="80" cy="80" r="3" fill="none" stroke="#d4af7a" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
    </svg>
  );
}
