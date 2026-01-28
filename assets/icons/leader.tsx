import * as React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface LeaderIconProps extends SvgProps {
  size?: number;
  backgroundColor?: string;
  crownColor?: string;
  borderColor?: string;
}

const LeaderIcon = ({
  size = 12,
  backgroundColor = "#F7F7F7",
  crownColor = "#9BBF9B",
  borderColor = "#9BBF9B",
  ...props
}: LeaderIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 12 12" fill="none" {...props}>
    <Circle cx="6" cy="6" r="6" fill={backgroundColor} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.07165 4.55537C2.71719 4.33013 2.27042 4.65644 2.37749 5.0626L3.14088 7.96383C3.16685 8.0623 3.22466 8.14942 3.3053 8.21161C3.38594 8.2738 3.48489 8.30758 3.58672 8.30767H8.41349C8.51541 8.30768 8.61446 8.27395 8.6952 8.21175C8.77594 8.14955 8.83381 8.06238 8.8598 7.96383L9.62319 5.0626C9.73026 4.65644 9.28349 4.33013 8.92903 4.55537L7.76596 5.29567C7.66411 5.36049 7.54093 5.38282 7.42282 5.35789C7.30471 5.33295 7.20106 5.26274 7.13411 5.16229L6.38411 4.03752C6.34196 3.97431 6.28486 3.92248 6.21787 3.88663C6.15088 3.85079 6.07608 3.83203 6.00011 3.83203C5.92413 3.83203 5.84933 3.85079 5.78235 3.88663C5.71536 3.92248 5.65826 3.97431 5.61611 4.03752L4.86611 5.16229C4.79923 5.26281 4.69562 5.33312 4.5775 5.35814C4.45938 5.38317 4.33616 5.36091 4.23426 5.29614L3.07165 4.55537Z"
      fill={crownColor}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 11.0769C8.80385 11.0769 11.0769 8.80385 11.0769 6C11.0769 3.19615 8.80385 0.923077 6 0.923077C3.19615 0.923077 0.923077 3.19615 0.923077 6C0.923077 8.80385 3.19615 11.0769 6 11.0769ZM6 12C9.31385 12 12 9.31385 12 6C12 2.68615 9.31385 0 6 0C2.68615 0 0 2.68615 0 6C0 9.31385 2.68615 12 6 12Z"
      fill={borderColor}
    />
  </Svg>
);

export default LeaderIcon;
