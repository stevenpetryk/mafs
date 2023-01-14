export function FunctionIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 12C3 12 3.5 7.5 7.5 7.5C11.5 7.5 12 3 12 3"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function EllipseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.3284 10.3284C9.12204 11.5348 7.70611 12.2725 6.41056 12.5081C5.11266 12.7441 3.98723 12.4725 3.25736 11.7426C2.5275 11.0128 2.25596 9.88735 2.49194 8.58945C2.72749 7.2939 3.46518 5.87797 4.67157 4.67158C5.87796 3.46519 7.29389 2.7275 8.58944 2.49194C9.88734 2.25596 11.0128 2.5275 11.7426 3.25737C12.4725 3.98723 12.744 5.11267 12.5081 6.41056C12.2725 7.70612 11.5348 9.12204 10.3284 10.3284Z"
        stroke="currentColor"
      />
    </svg>
  )
}

export function LinesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3 12L12 3" stroke="currentColor" strokeLinecap="round" />
      <circle cx="11.5" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="3.5" cy="11.5" r="1.5" fill="currentColor" />
    </svg>
  )
}
