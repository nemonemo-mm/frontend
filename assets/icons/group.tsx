import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface GroupIconProps extends SvgProps {
  size?: number;
  strokeColor?: string;
  fillColor?: string;
}

const GroupIcon = ({
  size = 56,
  strokeColor = "#89A889",
  fillColor = "#F4F6F0",
  ...props
}: GroupIconProps) => (
  <Svg
    width={size}
    height={size * (52 / 56)}
    viewBox="0 0 56 52"
    fill="none"
    {...props}
  >
    <Path
      d="M0 4C0 1.79086 1.79086 0 4 0H52C54.2091 0 56 1.79086 56 4V48C56 50.2091 54.2091 52 52 52H4C1.79086 52 0 50.2091 0 48V4Z"
      fill={fillColor}
    />
    <Path
      d="M28 24.6667C31.0376 24.6667 33.5 22.2789 33.5 19.3333C33.5 16.3878 31.0376 14 28 14C24.9624 14 22.5 16.3878 22.5 19.3333C22.5 22.2789 24.9624 24.6667 28 24.6667Z"
      stroke={strokeColor}
      strokeWidth="2"
    />
    <Path
      d="M17 38.0002C17 32.1335 21.95 27.3335 28 27.3335C34.05 27.3335 39 32.1335 39 38.0002"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M14.25 26C16.5282 26 18.375 24.2091 18.375 22C18.375 19.7909 16.5282 18 14.25 18C11.9718 18 10.125 19.7909 10.125 22C10.125 24.2091 11.9718 26 14.25 26Z"
      stroke={strokeColor}
      strokeWidth="2"
    />
    <Path
      d="M6 38C6 33.6 9.7125 30 14.25 30"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M41.75 26C44.0282 26 45.875 24.2091 45.875 22C45.875 19.7909 44.0282 18 41.75 18C39.4718 18 37.625 19.7909 37.625 22C37.625 24.2091 39.4718 26 41.75 26Z"
      stroke={strokeColor}
      strokeWidth="2"
    />
    <Path
      d="M50 38C50 33.6 46.2875 30 41.75 30"
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default GroupIcon;
