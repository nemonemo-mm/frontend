import * as React from "react";
import Svg, { Path, Rect, SvgProps } from "react-native-svg";

interface SquaredPlusIconProps extends SvgProps {
  size?: number;
}

const SquaredPlusIcon = ({
  size = 60,
  color,
  ...props
}: SquaredPlusIconProps) => (
  <Svg
    width={size + 2}
    height={size + 2}
    viewBox="0 0 60 60"
    fill="none"
    {...props}
  >
    <Rect width={size + 2} height={size + 2} rx={10} fill="#F7F7F7" />
    <Rect x={2} y={2} width={56} height={56} rx={8} fill={color} />
    <Path
      d="M12 30H48"
      stroke="#F7F7F7"
      strokeWidth={3}
      strokeLinecap="round"
    />
    <Path
      d="M30 12L30 48"
      stroke="#F7F7F7"
      strokeWidth={3}
      strokeLinecap="round"
    />
  </Svg>
);

export default SquaredPlusIcon;
