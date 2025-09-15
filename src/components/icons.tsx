import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208ZM120,128,96,144V112Z"
      />
      <path
        fill="currentColor"
        d="M176,104a12,12,0,1,1-12-12A12,12,0,0,1,176,104Z"
      />
    </svg>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="1em"
      height="1em" 
      viewBox="0 0 24 24"
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M12.522 6.495a5.82 5.82 0 0 1-5.127 5.234V11.5a5.834 5.834 0 0 1-5.714 5.833h-.001a5.82 5.82 0 0 1-5.111-5.234V12.1a12.5 12.5 0 0 0 12.5-12.5v.001a5.82 5.82 0 0 1 5.127-5.234V6.25a5.834 5.834 0 0 1 5.714-5.833h.001a5.82 5.82 0 0 1 5.111 5.234V11.7c0 6.903-5.597 12.5-12.5 12.5a12.42 12.42 0 0 1-3.235-.495"/>
    </svg>
  );
}
