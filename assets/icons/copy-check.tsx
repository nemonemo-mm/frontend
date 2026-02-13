import { globalGray700 } from "@/shared/ui";
import * as React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from "react-native-svg";

interface MainIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const CopyCheckIcon = ({
  size = 24,
  color = globalGray700,
  ...props
}: MainIconProps) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <G clip-path="url(#clip0_758_53156)">
      <Path
        d="M12 14.5002L13.6667 16.1668L17 12.8335"
        stroke="#5F5F5F"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M18.6665 8.6665H10.3332C9.4127 8.6665 8.6665 9.4127 8.6665 10.3332V18.6665C8.6665 19.587 9.4127 20.3332 10.3332 20.3332H18.6665C19.587 20.3332 20.3332 19.587 20.3332 18.6665V10.3332C20.3332 9.4127 19.587 8.6665 18.6665 8.6665Z"
        stroke="#5F5F5F"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M5.33317 15.3332C4.4165 15.3332 3.6665 14.5832 3.6665 13.6665V5.33317C3.6665 4.4165 4.4165 3.6665 5.33317 3.6665H13.6665C14.5832 3.6665 15.3332 4.4165 15.3332 5.33317"
        stroke="#5F5F5F"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_758_53156">
        <Rect width="20" height="20" fill="white" transform="translate(2 2)" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default CopyCheckIcon;
