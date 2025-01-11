import Link from 'next/link';

export default function ProjectCard({ project }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-2">{project?.title}</h2>
            <p className="text-gray-600 mb-4">{project?.description}</p>
            <Link
                href={`/projects/${project?.}`}
                className="text-blue-500 font-semibold"
            >
                View Details
            </Link>
        </div>
    );
}
