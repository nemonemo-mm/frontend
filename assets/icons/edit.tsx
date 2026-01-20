import { globalGray700 } from "@/shared/ui";
import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface EditIconProps extends SvgProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const EditIcon = ({
  size = 24,
  color = globalGray700,
  backgroundColor = "white",
  ...props
}: EditIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
      fill={backgroundColor}
    />
    <Path
      d="M14.8961 6.53255C15.2371 6.19156 15.6995 6 16.1818 6C16.664 6 17.1265 6.19156 17.4675 6.53255C17.8084 6.87353 18 7.33601 18 7.81823C18 8.30046 17.8084 8.76293 17.4675 9.10392L9.7422 16.83C9.53868 17.0334 9.28724 17.1822 9.01107 17.2629L6.54856 17.9829C6.4748 18.0044 6.39662 18.0057 6.3222 17.9866C6.24778 17.9675 6.17985 17.9288 6.12552 17.8745C6.0712 17.8202 6.03248 17.7522 6.01341 17.6778C5.99434 17.6034 5.99563 17.5252 6.01714 17.4514L6.73713 14.9889C6.81815 14.713 6.96729 14.4618 7.17083 14.2587L14.8961 6.53255Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default EditIcon;
