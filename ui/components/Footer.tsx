"use client";

import HealthIndicator from "./HealthIndicator";

export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <p>&copy; 2025 Todo App. Built with Spring Boot & Next.js</p>
          </div>

          <div className="flex items-center gap-4">
            <HealthIndicator />
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          <p>
            Deployed with CI/CD • Managed by Puppet • Infrastructure by
            Terraform
          </p>
        </div>
      </div>
    </footer>
  );
}
