module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['tests/steps/**/*.ts'],
        paths: ['tests/features/**/*.feature'],
        format: [
            'progress-bar',
            'html:reports/cucumber-report.html'
        ],
        formatOptions: {
            snippetInterface: 'async-await'
        }
    }
};
