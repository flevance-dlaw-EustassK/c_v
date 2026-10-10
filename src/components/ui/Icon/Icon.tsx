import type { SVGProps } from "react";
import type { ReactNode } from "react";

export type IconName =
  | "arrow"
  | "back"
  | "check"
  | "chevron"
  | "close"
  | "film"
  | "heart"
  | "menu"
  | "play"
  | "search"
  | "star";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

const paths: Record<IconName, ReactNode> = {
  arrow: <path d="M4 12h16m-7-7 7 7-7 7" />,
  back: <path d="m15 18-6-6 6-6" />,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  close: <path d="m18 6-12 12M6 6l12 12" />,
  film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16m10-16v16M3 9h4m10 0h4M3 15h4m10 0h4" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  play: <path d="m8 5 12 7-12 7z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" />,
};

export function Icon({ name, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.65"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
