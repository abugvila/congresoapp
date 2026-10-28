/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // El sitio se publica en el dominio propio cndp.ar, sin /congresoapp.
  env: { NEXT_PUBLIC_BASE_PATH: "" },
};
export default nextConfig;
