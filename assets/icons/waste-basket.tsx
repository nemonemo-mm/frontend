import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface WasteBasketIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const WasteBasketIcon = ({
  size = 12,
  color = "#5F5F5F",
  ...props
}: WasteBasketIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M8.33398 9.1665V14.1665"
      stroke={color}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11.666 9.1665V14.1665"
      stroke={color}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.8327 5V16.6667C15.8327 17.1087 15.6571 17.5326 15.3445 17.8452C15.032 18.1577 14.608 18.3333 14.166 18.3333H5.83268C5.39065 18.3333 4.96673 18.1577 4.65417 17.8452C4.34161 17.5326 4.16602 17.1087 4.16602 16.6667V5"
      stroke={color}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M2.5 5H17.5"
      stroke={color}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6.66602 4.99984V3.33317C6.66602 2.89114 6.84161 2.46722 7.15417 2.15466C7.46673 1.8421 7.89065 1.6665 8.33268 1.6665H11.666C12.108 1.6665 12.532 1.8421 12.8445 2.15466C13.1571 2.46722 13.3327 2.89114 13.3327 3.33317V4.99984"
      stroke={color}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default WasteBasketIcon;
