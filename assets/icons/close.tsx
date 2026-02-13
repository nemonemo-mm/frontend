import { globalGray700 } from "@/shared/ui";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface MainIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const CloseIcon = ({
  size = 24,
  color = globalGray700,
  ...props
}: MainIconProps) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 7L7 17"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M7 7L17 17"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default CloseIcon;
