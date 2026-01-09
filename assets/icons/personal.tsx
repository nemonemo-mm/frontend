import { globalGray500 } from "@/shared/ui";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface PersonalIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const PersonalIcon = ({
  size = 24,
  color = globalGray500,
  ...props
}: PersonalIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M3 20C2.99992 18.4603 3.44413 16.9533 4.27935 15.6598C5.11456 14.3664 6.30527 13.3414 7.7086 12.708C9.11193 12.0745 10.6682 11.8595 12.1908 12.0886C13.7133 12.3178 15.1373 12.9815 16.292 14"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 12C13.7614 12 16 9.76142 16 7C16 4.23858 13.7614 2 11 2C8.23858 2 6 4.23858 6 7C6 9.76142 8.23858 12 11 12Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.101 16H13.899C13.4025 16 13 16.483 13 17.0788V20.9212C13 21.517 13.4025 22 13.899 22H20.101C20.5975 22 21 21.517 21 20.9212V17.0788C21 16.483 20.5975 16 20.101 16Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15 15L15 17"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 15L19 17"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PersonalIcon;
