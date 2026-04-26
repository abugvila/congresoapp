const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const repositoryName = "congresoapp";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubActions ? `/${repositoryName}` : "",
  assetPrefix: isGithubActions ? `/${repositoryName}/` : "",
};

export default nextConfig;
