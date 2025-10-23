import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <div className="flex flex-wrap -mb-1">
            {links.map((link, key) => (
                <div key={key} className="mr-1 mb-1">
                    {link.url === null ? (
                        <div
                            className={`px-4 py-2 text-sm border rounded ${
                                link.active
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'text-gray-400 border-gray-300'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            href={link.url}
                            className={`px-4 py-2 text-sm border rounded hover:bg-gray-100 ${
                                link.active
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'text-gray-700 border-gray-300'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
} 