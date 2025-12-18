import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="150"
      height="40"
      {...props}
    >
      <g className="font-headline">
        <text
          x="10"
          y="35"
          className="text-4xl font-bold fill-primary"
        >
          Riva
        </text>
        <text
          x="95"
          y="35"
          className="text-4xl font-semibold fill-foreground"
        >
          Agro
        </text>
      </g>
    </svg>
  );
}
