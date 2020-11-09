module.exports = {
    plugins: [
	    require('postcss-import')({
		    path: ['./common']
	    }),
		require('postcss-for'),
        require('postcss-preset-env')({
            autoprefixer: true
        }),
		require('postcss-nested'),
		require('postcss-extend'),
		require('postcss-simple-vars'),
		require('postcss-mixins'),
    ]
};

