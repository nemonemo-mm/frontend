import { globalGray500 } from "@/shared/ui";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface TeamSettingProps extends SvgProps {
  size?: number;
  color?: string;
}

const TeamSetting = ({
  size = 24,
  color = globalGray500,
  ...props
}: TeamSettingProps) => (
  <Svg width={size} height={size} viewBox={`0 0 24 24`} fill="none">
    <Path
      d="M16.9998 19.5002C16.9998 17.7321 16.2975 16.0364 15.0472 14.7861C13.797 13.5359 12.1013 12.8335 10.3332 12.8335C8.56506 12.8335 6.86937 13.5359 5.61913 14.7861C4.36888 16.0364 3.6665 17.7321 3.6665 19.5002"
      stroke={color}
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M10.3332 12.8333C12.6344 12.8333 14.4998 10.9679 14.4998 8.66667C14.4998 6.36548 12.6344 4.5 10.3332 4.5C8.03198 4.5 6.1665 6.36548 6.1665 8.66667C6.1665 10.9679 8.03198 12.8333 10.3332 12.8333Z"
      stroke={color}
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M20.3333 18.6668C20.3333 15.8585 18.6667 13.2502 17 12.0002C17.5478 11.5891 17.9859 11.0494 18.2755 10.4287C18.565 9.80804 18.6971 9.12555 18.66 8.44166C18.6229 7.75777 18.4178 7.09357 18.0629 6.50783C17.7079 5.92209 17.2141 5.43288 16.625 5.0835"
      stroke={color}
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default TeamSetting;
