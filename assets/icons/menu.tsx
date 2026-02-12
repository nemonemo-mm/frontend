import { globalGray700 } from "@/shared/ui";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface MainIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const MenuIcon = ({
  size = 24,
  color = globalGray700,
  ...props
}: MainIconProps) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M5.3335 6.1665H18.6668Z" fill="#5F5F5F" />
    <Path
      d="M5.3335 6.1665H18.6668"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path d="M5.3335 12H17.0002Z" fill="#5F5F5F" />
    <Path
      d="M5.3335 12H17.0002"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path d="M5.3335 17.8335H18.6668Z" fill="#5F5F5F" />
    <Path
      d="M5.3335 17.8335H18.6668"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default MenuIcon;
