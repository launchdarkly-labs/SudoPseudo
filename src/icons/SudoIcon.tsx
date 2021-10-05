import * as React from "react";
interface iconProps {
  size?: number;
  fill?: string;
  style?: React.CSSProperties;
}
export const SudoIcon = ({ size, fill }: iconProps): JSX.Element => {
  return (
    <svg
      height={size}
      width={size}
      fill={fill}
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enableBackground="new 0 0 100 100"
    >
      <g>
        <g>
          <g>
            <path d="M61.54,28h21.637v21.637H61.54V28z M39.181,72h21.637V50.363H39.181V72z M16.823,72H38.46V50.363H16.823V72z      M39.181,49.637h21.637V28H39.181V49.637z"></path>
          </g>
        </g>
      </g>
    </svg>
  );
};
