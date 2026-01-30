import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface RemoveMemberIconProps extends SvgProps {
  size?: number;
}

const RemoveMemberIcon = ({ size = 24, ...props }: RemoveMemberIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
    <Path
      d="M1.66602 17.4999C1.66595 16.2169 2.03613 14.961 2.73214 13.8832C3.42815 12.8053 4.42041 11.9511 5.58985 11.4233C6.75929 10.8954 8.05621 10.7162 9.32498 10.9072C10.5938 11.0981 11.7805 11.6512 12.7427 12.4999"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M8.33268 10.8333C10.6339 10.8333 12.4993 8.96785 12.4993 6.66667C12.4993 4.36548 10.6339 2.5 8.33268 2.5C6.0315 2.5 4.16602 4.36548 4.16602 6.66667C4.16602 8.96785 6.0315 10.8333 8.33268 10.8333Z"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <Path
      d="M18.334 15.8334H13.334"
      stroke="#5F5F5F"
      stroke-width="1.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default RemoveMemberIcon;
