import { globalGray700 } from "@/shared/ui";
import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";

interface CopyIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const CopyIcon = ({
  size = 24,
  color = globalGray700,
  ...props
}: CopyIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    {/* Match CopyCheckIcon's visual padding: render 20x20 glyph inside 24x24 canvas */}
    <G transform="translate(2 2)">
      <Path
        d="M16.666 6.66675H8.33268C7.41221 6.66675 6.66602 7.41294 6.66602 8.33341V16.6667C6.66602 17.5872 7.41221 18.3334 8.33268 18.3334H16.666C17.5865 18.3334 18.3327 17.5872 18.3327 16.6667V8.33341C18.3327 7.41294 17.5865 6.66675 16.666 6.66675Z"
        stroke={color}
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M3.33268 13.3334C2.41602 13.3334 1.66602 12.5834 1.66602 11.6667V3.33341C1.66602 2.41675 2.41602 1.66675 3.33268 1.66675H11.666C12.5827 1.66675 13.3327 2.41675 13.3327 3.33341"
        stroke={color}
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </G>
  </Svg>
);

export default CopyIcon;
