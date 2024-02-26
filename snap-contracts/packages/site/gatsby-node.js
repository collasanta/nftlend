exports.onCreateWebpackConfig = ({ stage, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      resolve: {
        fallback: {
          crypto: false,
        },
      },
    });
  }
};