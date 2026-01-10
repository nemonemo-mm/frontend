import { globalGray500 } from "@/shared/ui";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface MyPageIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const MyPageIcon = ({
  size = 24,
  color = globalGray500,
  ...props
}: MyPageIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M4 5H20H4Z" fill={color} />
    <Path
      d="M4 5H20"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M4 12H20H4Z" fill={color} />
    <Path
      d="M4 12H20"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M4 19H20H4Z" fill={color} />
    <Path
      d="M4 19H20"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default MyPageIcon;
