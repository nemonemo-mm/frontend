import { globalGray500 } from "@/shared/ui";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface ChevronLeftIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const ChevronLeftIcon = ({
  size = 16,
  color = globalGray500,
  ...props
}: ChevronLeftIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 9 16" fill="none" {...props}>
    <Path
      d="M7.625 14.625L0.625 7.625L7.625 0.625"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ChevronLeftIcon;
