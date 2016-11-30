module.exports = {
    entry: "./client/src/app.tsx",
    output: {
        filename: "./build/global/app.js",
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.less$/, loader: "style!css!less!" },
            { test: /\.(ttf|otf|eot|svg|woff(2)?)$/, loader: 'file-loader?name=build/global/fonts/[name].[ext]' },
            { test: /\.css$/, loader: 'file-loader?name=build/global/css/[name].[ext]' },
            { test: /\.html$/, loader: 'file-loader?name=build/views/[name].[ext]' },
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    //externals: {
    //    "react": "React",
    //    "react-dom": "ReactDOM"
    //},
};