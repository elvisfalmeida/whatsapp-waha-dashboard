'use client';

import { env } from "~/env.js";

export default function Footer() {
  // Mostra o rodape por padrao quando a variavel nao estiver definida como "false".
  const shouldShowFooter = env.NEXT_PUBLIC_SHOW_FOOTER !== "false";

  if (!shouldShowFooter) {
    return null;
  }

  return (
    <footer className="mt-auto border-t bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center space-x-2 text-gray-600">
            <span>Feito por Aaron com</span>
            <span className="text-red-500">amor</span>
            <span>e codigo</span>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/jevil25"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
            >
              <span>GitHub</span>
            </a>

            <a
              href="https://www.youtube.com/@JevilCodes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-red-600"
            >
              <span>YouTube</span>
            </a>

            <a
              href="https://x.com/jevil257"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-blue-500"
            >
              <span>X</span>
            </a>
          </div>

          <div className="text-sm text-gray-500">
            <span>{new Date().getFullYear()} Gerenciador de Grupos do WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
