import { globalGray500 } from "@/shared/ui";
import * as React from "react";
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Mask,
  Rect,
  SvgProps,
} from "react-native-svg";

interface UserIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const UserIcon = ({ size, color = globalGray500, ...props }: UserIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 56 56" fill="none" {...props}>
    <G clipPath="url(#clip0_1_221)">
      <Circle cx="28" cy="28" r="28" fill="#F2F3F2" />
      <Mask
        id="mask0_1_221"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="56"
        height="56"
      >
        <Circle cx="28" cy="28" r="28" fill="#F2F3F2" />
      </Mask>
      <G mask="url(#mask0_1_221)">
        <Circle cx="28" cy="58" r="23" fill="#888888" />
      </G>
      <Circle cx="28.5" cy="22.5" r="11.5" fill="#888888" />
    </G>
    <Defs>
      <ClipPath id="clip0_1_221">
        <Rect width="56" height="56" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default UserIcon;
