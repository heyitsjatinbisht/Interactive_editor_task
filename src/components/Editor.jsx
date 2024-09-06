import React, { useEffect, useState, useRef } from "react";
import EditorJs from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Table from "@editorjs/table";
import { fetchUserDetail } from "../services/userService";
import { fetchFromOpenAI } from "../services/aiService";
import { createNote } from "../services/notesService";
import { useNavigate } from "react-router-dom";
import "../App.css";

const EditorPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const editorContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserDetail(token)
        .then((res) => setUserDetails(res))
        .catch((err) => console.error("Failed to fetch user details:", err));
    }
  }, [navigate]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.destroy(); // Clean up existing editor if it exists
    }

    if (editorContainerRef.current) {
      const editor = new EditorJs({
        holder: editorContainerRef.current,
        tools: {
          header: Header,
          list: List,
          table: Table,
        },
        data: content ? { blocks: JSON.parse(content) } : { blocks: [] },
        onChange: async () => {
          try {
            const savedData = await editor.save();
            setContent(JSON.stringify(savedData.blocks));
          } catch (error) {
            console.error("Error during onChange:", error);
          }
        },
      });

      editorRef.current = editor;

      return () => {
        if (editorRef.current) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      };
    }
  }, [content]);

  const handleAskEddie = async () => {
    const token = localStorage.getItem("token");
    if (token && editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        const prompt = savedData.blocks
          .map((block) => block.data.text || "")
          .join(" ");

        if (!prompt) {
          alert(
            "Editor content is empty. Please add some text before asking Eddie."
          );
          return;
        }

        // Fetch AI content from the API
        const aiResponse = await fetchFromOpenAI(token, prompt);
        console.log("AI Response:", aiResponse);

        // Check and parse the AI response
        let newContent;
        try {
          newContent =
            typeof aiResponse === "string"
              ? JSON.parse(aiResponse)
              : aiResponse;
        } catch (parseError) {
          console.error("Failed to parse AI response:", parseError);
          return;
        }

        // Merge AI response blocks with the current content
        if (newContent.blocks && Array.isArray(newContent.blocks)) {
          const updatedBlocks = [...savedData.blocks, ...newContent.blocks];
          await editorRef.current.render({ blocks: updatedBlocks });
          setContent(JSON.stringify(updatedBlocks));
        } else {
          console.error("Invalid format in AI response:", newContent);
        }
      } catch (error) {
        console.error("Error handling AI content:", error);
      }
    }
  };

  const handleSaveNote = async () => {
    const token = localStorage.getItem("token");
    if (token && editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        const noteData = {
          note: JSON.stringify(savedData.blocks),
          timestamp: new Date().toISOString(),
        };
        await createNote(token, noteData);
        alert("Note saved successfully!");
      } catch (error) {
        console.error("Failed to save note:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      {userDetails ? (
        <>
          <p className="text-xl">Welcome, {userDetails.firstName}!</p>

          {/* Toolbar for inserting content */}
          <div className="my-4">
            <select
              className="border border-gray-300 p-2 rounded"
              onChange={(e) => {
                const action = e.target.value;
                if (editorRef.current) {
                  const editor = editorRef.current;
                  if (action === "heading") {
                    editor.blocks.insert("header", { text: "New Heading" });
                  } else if (action === "list") {
                    editor.blocks.insert("list", {
                      items: ["Item 1", "Item 2"],
                    });
                  } else if (action === "table") {
                    editor.blocks.insert("table", {
                      content: [
                        ["Header 1", "Header 2"],
                        ["Row 1", "Row 2"],
                      ],
                    });
                  } else if (action === "askEddie") {
                    handleAskEddie();
                  }
                }
                e.target.value = "";
              }}
            >
              <option value="">-- Choose Action --</option>
              <option value="heading">Add Heading</option>
              <option value="list">Add List</option>
              <option value="table">Add Table</option>
              <option value="askEddie">Ask Eddie (AI Generated)</option>
            </select>
          </div>

          {/* Editor.js Container */}
          <div
            id="editorjs"
            ref={editorContainerRef}
            className="editorjs-container"
          ></div>

          {/* Save Note Button */}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSaveNote}
          >
            Save Note
          </button>
        </>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default EditorPage;
