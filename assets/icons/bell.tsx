import { globalGray700 } from "@/shared/ui";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface MainIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const BellIcon = ({
  size = 24,
  color = globalGray700,
  ...props
}: MainIconProps) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.5566 19.5C10.7029 19.7532 10.9133 19.9634 11.1667 20.1095C11.42 20.2557 11.7074 20.3326 12 20.3326C12.2925 20.3326 12.5799 20.2557 12.8333 20.1095C13.0866 19.9634 13.297 19.7532 13.4433 19.5"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M4.71772 14.7715C4.60886 14.8908 4.53702 15.0392 4.51094 15.1986C4.48486 15.358 4.50566 15.5215 4.57081 15.6693C4.63597 15.8171 4.74267 15.9428 4.87794 16.0311C5.0132 16.1193 5.17121 16.1664 5.33272 16.1665H18.6661C18.8276 16.1666 18.9856 16.1197 19.1209 16.0316C19.2563 15.9435 19.3631 15.818 19.4285 15.6703C19.4938 15.5226 19.5148 15.3591 19.4889 15.1997C19.4631 15.0402 19.3914 14.8918 19.2827 14.7723C18.1744 13.6298 16.9994 12.4157 16.9994 8.6665C16.9994 7.34042 16.4726 6.06865 15.5349 5.13097C14.5972 4.19329 13.3255 3.6665 11.9994 3.6665C10.6733 3.6665 9.40154 4.19329 8.46386 5.13097C7.52618 6.06865 6.99939 7.34042 6.99939 8.6665C6.99939 12.4157 5.82356 13.6298 4.71772 14.7715Z"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default BellIcon;
