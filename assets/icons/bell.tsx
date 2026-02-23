import { globalGray700 } from "@/shared/ui";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface MainIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const BellIcon = ({
  size = 20,
  color = globalGray700,
  ...props
}: MainIconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <Path
      d="M8.55615 17.5C8.70244 17.7532 8.91283 17.9634 9.16619 18.1095C9.41955 18.2557 9.70694 18.3326 9.99949 18.3326C10.292 18.3326 10.5794 18.2557 10.8328 18.1095C11.0861 17.9634 11.2965 17.7532 11.4428 17.5"
      stroke={color}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.71772 12.7717C2.60886 12.891 2.53702 13.0394 2.51094 13.1988C2.48486 13.3582 2.50566 13.5217 2.57081 13.6695C2.63597 13.8173 2.74267 13.943 2.87794 14.0312C3.0132 14.1195 3.17121 14.1666 3.33272 14.1667H16.6661C16.8276 14.1667 16.9856 14.1199 17.1209 14.0318C17.2563 13.9437 17.3631 13.8181 17.4285 13.6704C17.4938 13.5228 17.5148 13.3593 17.4889 13.1998C17.4631 13.0404 17.3914 12.892 17.2827 12.7725C16.1744 11.63 14.9994 10.4159 14.9994 6.66669C14.9994 5.3406 14.4726 4.06883 13.5349 3.13115C12.5972 2.19347 11.3255 1.66669 9.99939 1.66669C8.67331 1.66669 7.40154 2.19347 6.46386 3.13115C5.52618 4.06883 4.99939 5.3406 4.99939 6.66669C4.99939 10.4159 3.82356 11.63 2.71772 12.7717Z"
      stroke={color}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BellIcon;
