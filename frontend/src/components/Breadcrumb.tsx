import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`bg-white border-b border-orange-100 ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-500">
          <li className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-1 text-gray-400 hover:text-orange-600 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only">Home</span>
            </Link>
          </li>

          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
              {item.to && i < items.length - 1 ? (
                <Link
                  to={item.to}
                  className="hover:text-orange-600 transition-colors truncate max-w-[180px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium truncate max-w-[220px]">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
