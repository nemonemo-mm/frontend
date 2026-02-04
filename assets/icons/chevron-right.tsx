import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface ChevronRightIconProps extends SvgProps {
  size?: number;
}

const ChevronRightIcon = ({ size = 24, ...props }: ChevronRightIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 8 14" fill="none" {...props}>
    <Path
      d="M0.625 12.625L6.625 6.625L0.625 0.625"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default ChevronRightIcon;
