import Link from "next/link";

export default function EventCard({ event }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* <img
        src={event.image || "/event-placeholder.jpg"}
        alt={event.title}
        className="w-full h-48 object-cover"
      /> */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.shortDescription}
        </p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${event.price}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(event.date)}
          </span>
        </div>
        <Link
          href={`/events/${event._id}`}
          className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
