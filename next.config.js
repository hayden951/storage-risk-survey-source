/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/widget.js", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] }];
  }
};
module.exports = nextConfig;
 
