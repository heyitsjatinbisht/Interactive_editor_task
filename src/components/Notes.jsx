import React, { useEffect, useState } from "react";
import { getNotes } from "../services/notesService";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const notesData = await getNotes(token);
          console.log(notesData);

          setNotes(notesData);
          console.log(notes);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch notes:", error);
          setLoading(false);
        }
      }
    };

    fetchNotes();
  }, []);

  if (loading) return <p>Loading notes...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul className="list-disc pl-5">
          {notes.map((note) => (
            <li key={note.id} className="mb-2">
              <p>{note.note}</p>
              <small>{new Date(note.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notes;
