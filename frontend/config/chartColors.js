const colors = [
    '#5899DA',
    '#E8743B',
    '#19A979',
    '#ED4A7B',
    '#945ECF',
    '#13A4B4',
    '#525DF4',
    '#BF399E',
    '#6C8893',
    '#EE6868',
    '#EE6868',
];

function rgbToRgba(rgb, alpha) {
    return rgb.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
}

export const BAR_COLORS = colors.map((color) => ({
    backgroundColor: rgbToRgba(color, 0.8),
    borderColor: color,
    borderWidth: 1,
}));
