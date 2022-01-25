const path = require("path")

module.exports = {
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-react-helmet",

    // Dynamically generate Guides sidebar
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: `${__dirname}/src/pages/`,
      },
    },
    "gatsby-transformer-javascript-frontmatter",
    "gatsby-transformer-json",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "guides",
        path: "./src/pages/guides/",
      },
    },

    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "mafs",
        path: `${__dirname}/../build`,
      },
    },
    {
      resolve: `gatsby-transformer-code`,
      options: {
        name: `mafs`,
        extensions: ["css", "mjs"],
      },
    },

    {
      resolve: "gatsby-plugin-codegen",
      options: {
        localSchemaFile: path.join(__dirname, "schema.json"),
      },
    },
  ],
}
