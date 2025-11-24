import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Discover Amazing Events</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of participants in our curated events. Learn,
            network, and grow with industry experts.
          </p>
          <Link
            href="/events"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Explore Events
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose EventHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Event Creation",
                description:
                  "Create and manage events with our intuitive platform",
                icon: "🎯",
              },
              {
                title: "Secure Payments",
                description:
                  "Safe and secure payment processing for all events",
                icon: "🔒",
              },
              {
                title: "Global Reach",
                description: "Connect with participants from around the world",
                icon: "🌍",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More sections can be added here */}
    </div>
  );
}
