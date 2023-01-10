module.exports = {
  siteMetadata: {
    title: `FilmDrop Dashboard`,
    description: `Cirrus dashboard for the FilmDrop Project`,
    siteUrl: `https://dashboard.dev.demo.filmdrop.io/`,
  },
  plugins: [
    'gatsby-plugin-resolve-src',
    'gatsby-plugin-sass',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-create-client-paths',
      options: {
        prefixes: [
          '/collections/*'
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.inline\.svg$/,
        }
      }
    }  
  ],
}
