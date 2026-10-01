import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old résumé URL, kept working for links shared before the per-language CVs
      { source: "/mathyu-cv-es.pdf", destination: "/cv/mathyu-cardozo-cv-es.pdf", permanent: true },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
