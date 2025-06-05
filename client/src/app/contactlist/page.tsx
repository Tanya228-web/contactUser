"use client";

import { useEffect, useState } from "react";


interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  createdAt?: string;
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/usercontacts");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.msg || "Failed to fetch contacts.");
        }

        setContacts(data.userContacts || []);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-purple-400 mb-6 text-center">
          All Contact Submissions
        </h1>

        {loading && <p className="text-gray-300">Loading contacts...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && contacts.length === 0 && (
          <p className="text-yellow-300 text-center">No contacts found.</p>
        )}

        {!loading && contacts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-700 rounded-xl overflow-hidden">
              <thead className="bg-gray-700 text-purple-300">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Country</th>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="border-t border-gray-600 hover:bg-gray-700"
                  >
                    <td className="px-4 py-2">{contact.name}</td>
                    <td className="px-4 py-2">{contact.email}</td>
                    <td className="px-4 py-2">{contact.phone}</td>
                    <td className="px-4 py-2">{contact.country}</td>
                    <td className="px-4 py-2">{contact.message}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl"
                        onClick={() =>
                          alert(`Send clicked for ${contact.email}`)
                        }
                      >
                        Send
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
