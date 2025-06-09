"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import Modal from "react-modal";

const resendSchema = z.object({
  email: z.string().email("Invalid email address"),
  resendMsg: z.string().min(5, "Resend message is too short"),
});

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
  status: string;
  createdAt?: string;
}

export default function ContactListPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/usercontacts");
        const data = await res.json();

        if (!res.ok) throw new Error(data.msg || "Failed to fetch contacts.");

        setContacts(data.userContacts || []);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleResend = async () => {
    if (!selectedEmail) {
      alert("No email selected");
      return;
    }

    const result = resendSchema.safeParse({
      email: selectedEmail,
      resendMsg: customMessage,
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      alert(errors.email?.[0] || errors.resendMsg?.[0] || "Validation error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedEmail,
          resendMsg: customMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to resend email");

      alert("Resend email sent successfully!");
      setModalIsOpen(false);
      setCustomMessage("");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleStatus = async (status: string, id: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/statusupdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, id }),
      });

      await res.json();

      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id ? { ...contact, status } : contact
        )
      );
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

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
                  <th className="px-4 py-2 text-left">Status</th>
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
                      <select
                        value={contact.status}
                        onChange={(e) =>
                          handleStatus(e.target.value, contact._id)
                        }
                        className="bg-gray-800 text-white rounded-md p-1"
                      >
                        <option value="sent">sent</option>
                        <option value="failed">failed</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl"
                        onClick={() => {
                          setSelectedEmail(contact.email);
                          setCustomMessage("");
                          setModalIsOpen(true);
                        }}
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirm Resend"
        className="bg-white p-6 max-w-lg mx-auto mt-40 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-bold mb-4 text-black">Resend Email</h2>
        <p className="text-black mb-2">
          Are you sure you want to resend the email to{" "}
          <strong>{selectedEmail}</strong>?
        </p>

        <textarea
          rows={4}
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
          placeholder="Enter your custom message..."
        />

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalIsOpen(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleResend}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Confirm Resend
          </button>
        </div>
      </Modal>
    </main>
  );
}
