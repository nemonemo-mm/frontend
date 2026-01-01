import { ReactNode } from "react";
import { StyleSheet, Text, TextProps } from "react-native";

interface NemoTextProps extends TextProps {
  level: "h1" | "h2" | "h3" | "body1" | "body2" | "body3" | "tabInActive";
  children: ReactNode;
}
//텍스트를 쓸 때 사용하는 텍스트 컴포넌트.
//인라인 블록 효과를 위한 텍스트 컴포넌트는 기본 컴포넌트로만 사용
const NemoText = ({ level, children, ...props }: NemoTextProps) => {
  return (
    <Text style={style[`text_${level}` as keyof typeof style]} {...props}>
      {children}
    </Text>
  );
};

/**
 * port const globalTypographyH2 = "500 16px/18 pretendard";
export const globalTypographyH1 = "500 18px/20 pretendard";
export const globalTypographyH3 = "600 16px/20 pretendard";
export const globalTypographyBody1 = "500 14px/16 pretendard";
export const globalTypographyBody2 = "400 14px/16 pretendard";
export const globalTypographyBody3 = "400 12px/16 pretendard";
export const globalTypographyCaption = "600 12px/14 pretendard";
export const globalTypographyTabinactive = "400 16px/18 pretendard";
export const globalTypographyBody2Tight = "400 14px/16 pretendard";
export const globalTypographyBody2wide = "400 14px/20 pretendard";
 */
const style = StyleSheet.create({
  text_h1: {
    fontWeight: "500",
    fontFamily: "Pretendard-Regular",
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: 0,
  },
  text_h2: {
    fontWeight: "500",
    fontFamily: "Pretendard-Regular",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0,
  },
  text_h3: {
    fontWeight: "600",
    fontFamily: "Pretendard-Regular",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
  },
  text_body1: {
    fontWeight: "500",
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0,
  },
  text_body2: {
    fontWeight: "400",
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0,
  },
  text_body3: {
    fontWeight: "400",
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  text_tabInActive: {
    fontWeight: "400",
    fontFamily: "Pretendard-Regular",
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0,
  },
});

export default NemoText;
