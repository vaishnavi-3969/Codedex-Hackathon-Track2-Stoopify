import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { app } from '../db/Firebase';
import { FaCommentAlt, FaPaperPlane } from 'react-icons/fa';

const Community = () => {
    const db = getFirestore(app);
    const [threads, setThreads] = useState([]);
    const [newThread, setNewThread] = useState("");
    const [newComment, setNewComment] = useState({});

    useEffect(() => {
        const fetchThreads = async () => {
            const threadsSnapshot = await getDocs(collection(db, 'threads'));
            const threadsData = threadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setThreads(threadsData);
        };

        fetchThreads();
    }, []);

    const handleNewThread = async () => {
        if (newThread.trim() !== "") {
            await addDoc(collection(db, 'threads'), {
                content: newThread,
                comments: [],
                createdAt: new Date()
            });
            setNewThread("");
            const threadsSnapshot = await getDocs(collection(db, 'threads'));
            const threadsData = threadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setThreads(threadsData);
        }
    };

    const handleNewComment = async (threadId) => {
        if (newComment[threadId]?.trim() !== "") {
            const threadRef = doc(db, 'threads', threadId);
            await updateDoc(threadRef, {
                comments: arrayUnion({ content: newComment[threadId], createdAt: new Date() })
            });
            setNewComment(prevState => ({ ...prevState, [threadId]: "" }));
            const threadsSnapshot = await getDocs(collection(db, 'threads'));
            const threadsData = threadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setThreads(threadsData);
        }
    };

    return (
        <div className="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
            <h1 className="mb-6 text-3xl font-bold text-center">Community</h1>
            <div className="mb-6">
                <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg"
                    rows="3"
                    placeholder="What's on your mind?"
                    value={newThread}
                    onChange={(e) => setNewThread(e.target.value)}
                ></textarea>
                <button
                    className="flex items-center px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    onClick={handleNewThread}
                >
                    <FaPaperPlane className="mr-2" /> Post Thread
                </button>
            </div>
            <div>
                {threads.map((thread) => (
                    <div key={thread.id} className="p-4 mb-6 border border-gray-300 rounded-lg">
                        <p className="mb-2 text-gray-800">{thread.content}</p>
                        <div className="pl-4 mb-2 border-l-2 border-gray-300">
                            {thread.comments.map((comment, index) => (
                                <p key={index} className="mb-2 text-gray-600">{comment.content}</p>
                            ))}
                        </div>
                        <div className="flex items-center">
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                rows="1"
                                placeholder="Add a comment..."
                                value={newComment[thread.id] || ""}
                                onChange={(e) => setNewComment(prevState => ({ ...prevState, [thread.id]: e.target.value }))}
                            ></textarea>
                            <button
                                className="flex items-center px-4 py-2 ml-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
                                onClick={() => handleNewComment(thread.id)}
                            >
                                <FaCommentAlt className="mr-2" /> Comment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Community;