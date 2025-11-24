"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PrivateRoute from "@/component/PrivetRoute/PrivetRoute";

function ManageEventsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    date: "",
    image: "",
    category: "conference",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        // Filter events to show only those created by the current user
        const userEvents = data.filter(
          (event) => event.createdBy._id === session?.user?.id
        );
        setEvents(userEvents);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((event) => event._id !== eventId));
        alert("Event deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error deleting event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error deleting event");
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event._id);
    setEditFormData({
      title: event.title,
      shortDescription: event.shortDescription,
      fullDescription: event.fullDescription,
      price: event.price.toString(),
      date: new Date(event.date).toISOString().split("T")[0],
      image: event.image || "",
      category: event.category,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editFormData,
          price: parseFloat(editFormData.price),
        }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(
          events.map((event) => (event._id === eventId ? updatedEvent : event))
        );
        setEditingEvent(null);
        alert("Event updated successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error updating event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Error updating event");
    }
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setEditFormData({
      title: "",
      shortDescription: "",
      fullDescription: "",
      price: "",
      date: "",
      image: "",
      category: "conference",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    // <div className="min-h-screen bg-gray-50">
    //   <div className="max-w-7xl mx-auto px-4 py-8">
    //     <div className="flex justify-between items-center mb-6">
    //       <h1 className="text-3xl font-bold text-gray-800">
    //         Manage Your Events
    //       </h1>
    //       <Link
    //         href="/add-events"
    //         className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
    //       >
    //         Add New Event
    //       </Link>
    //     </div>

    //     {events.length === 0 ? (
    //       <div className="text-center py-12 bg-white rounded-lg shadow-md">
    //         <div className="text-gray-500 text-lg mb-4">
    //           You have not created any events yet.
    //         </div>
    //         <Link
    //           href="/add-events"
    //           className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
    //         >
    //           Create Your First Event
    //         </Link>
    //       </div>
    //     ) : (
    //       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    //         {events.map((event) => (
    //           <div
    //             key={event._id}
    //             className="bg-white rounded-lg shadow-md overflow-hidden"
    //           >
    //             {/* <img
    //               src={event.image || '/event-placeholder.jpg'}
    //               alt={event.title}
    //               className="w-full h-48 object-cover"
    //             /> */}

    //             <div className="p-6">
    //               {editingEvent === event._id ? (
    //                 // Edit Form
    //                 <div className="space-y-3">
    //                   <input
    //                     type="text"
    //                     name="title"
    //                     value={editFormData.title}
    //                     onChange={handleEditChange}
    //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     placeholder="Event Title"
    //                   />
    //                   <textarea
    //                     name="shortDescription"
    //                     value={editFormData.shortDescription}
    //                     onChange={handleEditChange}
    //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     placeholder="Short Description"
    //                     rows="2"
    //                   />
    //                   <div className="grid grid-cols-2 gap-3">
    //                     <input
    //                       type="number"
    //                       name="price"
    //                       value={editFormData.price}
    //                       onChange={handleEditChange}
    //                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                       placeholder="Price"
    //                       step="0.01"
    //                     />
    //                     <input
    //                       type="date"
    //                       name="date"
    //                       value={editFormData.date}
    //                       onChange={handleEditChange}
    //                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                     />
    //                   </div>
    //                   <select
    //                     name="category"
    //                     value={editFormData.category}
    //                     onChange={handleEditChange}
    //                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                   >
    //                     <option value="conference">Conference</option>
    //                     <option value="workshop">Workshop</option>
    //                     <option value="seminar">Seminar</option>
    //                     <option value="social">Social</option>
    //                     <option value="sports">Sports</option>
    //                   </select>
    //                   <div className="flex space-x-2">
    //                     <button
    //                       onClick={() => handleUpdate(event._id)}
    //                       className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
    //                     >
    //                       Save
    //                     </button>
    //                     <button
    //                       onClick={cancelEdit}
    //                       className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition"
    //                     >
    //                       Cancel
    //                     </button>
    //                   </div>
    //                 </div>
    //               ) : (
    //                 // Display Mode
    //                 <>
    //                   <h3 className="text-xl font-semibold text-gray-800 mb-2">
    //                     {event.title}
    //                   </h3>
    //                   <p className="text-gray-600 mb-3 line-clamp-2">
    //                     {event.shortDescription}
    //                   </p>
    //                   <div className="flex justify-between items-center mb-4">
    //                     <span className="text-2xl font-bold text-blue-600">
    //                       ${event.price}
    //                     </span>
    //                     <span className="text-sm text-gray-500">
    //                       {formatDate(event.date)}
    //                     </span>
    //                   </div>
    //                   <div className="flex justify-between items-center">
    //                     <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
    //                       {event.category}
    //                     </span>
    //                     <div className="flex space-x-2">
    //                       <button
    //                         onClick={() => handleEdit(event)}
    //                         className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm"
    //                       >
    //                         Edit
    //                       </button>
    //                       <button
    //                         onClick={() => handleDelete(event._id)}
    //                         className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
    //                       >
    //                         Delete
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </>
    //               )}
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>
    // </div>
    <div></div>
  );
}

export default function ManageEvents() {
  return (
    <PrivateRoute>
      <ManageEventsContent />
    </PrivateRoute>
  );
}
