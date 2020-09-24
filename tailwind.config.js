module.exports = {
  purge: {
    enable: process.env.NODE_ENV === 'production',
    content: [`${__dirname}/src/**/*.html`],
  },
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    extend: {
      maxWidth: {
        content: 'max-content',
      },
    },
  },
  variants: {},
  plugins: [],
};
