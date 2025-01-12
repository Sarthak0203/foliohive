import Link from 'next/link';
import ProjectCard from './Components/ProjectCard';

export default function HomePage() {
  const features = [
    {
      title: 'Showcase Projects',
      description: 'Highlight your best work with an engaging and interactive layout.',
    },
    {
      title: 'Analyze Interactions',
      description: 'Track views, likes, and comments with detailed analytics.',
    },
    {
      title: 'Collaborate and Share',
      description: 'Collaborate with others and share your projects effortlessly.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold">
          Showcase Your Projects with Ease
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          An interactive platform to highlight, analyze, and share your work.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Why Choose Us?
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white shadow-lg rounded-lg text-center"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Featured Projects
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((_, index) => (
              <ProjectCard
                key={index}
                title={`Project ${index + 1}`}
                description="A brief description of the project goes here."
                link={`/projects/project-${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}