const { hostname } = require('os')

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "whatdididothismonth-imgs.s3.us-east-1.amazonaws.com",
            port: '',
            pathname: '/*'
        }]
    }
}

module.exports = nextConfig
