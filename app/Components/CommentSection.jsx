"use client";

import { useState } from "react";

export default function CommentSection({ comments, onAddComment }) {
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment("");
        }
    };

    return (
        <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Comments</h3>
            <ul className="space-y-2">
                {comments.map((comment, index) => (
                    <li key={index} className="bg-gray-100 p-2 rounded">
                        {comment}
                    </li>
                ))}
            </ul>
            <div className="flex mt-4">
                <input
                    type="text"
                    className="border p-2 flex-1 rounded"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
                    onClick={handleAddComment}
                >
                    Add
                </button>
            </div>
        </div>
    );
}
