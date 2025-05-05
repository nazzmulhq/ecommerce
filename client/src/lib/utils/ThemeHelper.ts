export const getAntTheme = (theme: any) => {
  return {
    colorPrimary: theme.palette.primary.main,
    // colorTextBase: theme.palette.text.primary,
    // fontFamilyBase: theme.font.family,
    // fontSizeBase: theme.font.size.base,
    // borderRadius: theme.cardRadius,
    // colorBgBase: theme.palette.background.paper,
    // colorText:  theme.palette.text.primary,
    // boxShadow:  theme.cardShadow,
    // sizeStep:4
  };
}; /*
const generateColorPalettes=(color, type)=>{
  return {
    [`color${type}`]: '',
    [`color${type}Bg`]: '',
    [`color${type}BgHover`]: '',
    [`color${type}Border`]: '',
    [`color${type}BorderHover`]: '',
    [`color${type}Hover`]: '',
    [`color${type}Active`]: '',
    [`color${type}TextHover`]: '',
    [`color${type}Text`]: '',
    [`color${type}TextActive`]: '',
  }
}
*/
