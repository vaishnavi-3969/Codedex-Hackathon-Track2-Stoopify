import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { app } from '../db/Firebase';
import { useAuth0 } from '@auth0/auth0-react';
import { FaCheckCircle, FaTimesCircle, FaEdit, FaTrash, FaShare } from 'react-icons/fa';
import Loading from '../components/Loading';
import Confetti from 'react-confetti';

const StoopSaleDetail = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth0();
    const [sale, setSale] = useState(null);
    const [isRSVPed, setIsRSVPed] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const fetchSale = async () => {
            const db = getFirestore(app);
            const saleRef = doc(db, 'stoopSales', id);
            const saleSnapshot = await getDoc(saleRef);

            if (saleSnapshot.exists()) {
                const data = saleSnapshot.data();
                setSale(data);
                if (isAuthenticated && data.rsvps && data.rsvps.some(rsvp => rsvp.userEmail === user.email)) {
                    setIsRSVPed(true);
                } else {
                    setIsRSVPed(false);
                }
                if (data.comments) {
                    setComments(data.comments);
                }
            } else {
                console.log('No such document!');
            }
        };

        fetchSale();
    }, [id, isAuthenticated, user]);

    const handleRSVP = async () => {
        if (isAuthenticated) {
            const db = getFirestore(app);
            const saleRef = doc(db, 'stoopSales', id);

            try {
                if (isRSVPed) {
                    await updateDoc(saleRef, {
                        rsvps: arrayRemove(sale.rsvps.find(rsvp => rsvp.userEmail === user.email))
                    });
                } else {
                    const userObject = {
                        userName: user.name,
                        userEmail: user.email,
                        userPicture: user.picture
                    };
                    await updateDoc(saleRef, {
                        rsvps: arrayUnion(userObject)
                    });
                    setShowConfetti(true); 
                }
                // toggle RSVP status
                setIsRSVPed(!isRSVPed);
                // Update the local state
                const updatedRSVPs = isRSVPed
                    ? sale.rsvps.filter(rsvp => rsvp.userEmail !== user.email)
                    : [...sale.rsvps, { userName: user.name, userEmail: user.email, userPicture: user.picture }];
                setSale({ ...sale, rsvps: updatedRSVPs });
            } catch (error) {
                console.error('Error updating document: ', error);
            }
        }
    };

    const handleAddComment = async () => {
        if (newComment.trim() !== '') {
            const db = getFirestore(app);
            const saleRef = doc(db, 'stoopSales', id);

            try {
                const commentObject = {
                    userName: user.name,
                    userEmail: user.email,
                    userPicture: user.picture,
                    commentText: newComment,
                    timestamp: new Date().toISOString()
                };

                await updateDoc(saleRef, {
                    comments: arrayUnion(commentObject)
                });

                setComments([...comments, commentObject]);
                setNewComment('');
            } catch (error) {
                console.error('Error adding comment: ', error);
            }
        }
    };

    const handleDeleteComment = async (comment) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            const db = getFirestore(app);
            const saleRef = doc(db, 'stoopSales', id);

            try {
                await updateDoc(saleRef, {
                    comments: arrayRemove(comment)
                });

                setComments(comments.filter(c => c !== comment));
            } catch (error) {
                console.error('Error deleting comment: ', error);
            }
        }
    };

    const handleEditPost = () => {
        console.log('Editing post...');
    };

    const handleDeletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const db = getFirestore(app);
            const saleRef = doc(db, 'stoopSales', id);

            try {
                await updateDoc(saleRef, {
                    deleted: true
                });
                console.log('Post deleted successfully.');
            } catch (error) {
                console.error('Error deleting post: ', error);
            }
        }
    };

    const handleShareEvent = () => {
        const shareUrl = `${window.location.origin}/stoopSale/${id}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => alert('Event link copied to clipboard!'))
            .catch(err => console.error('Failed to copy: ', err));
    };

    if (!sale) return <Loading />;

    return (
        <div className="max-w-4xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
            {showConfetti && <Confetti />}
            <h1 className="mb-6 text-3xl font-bold text-center">{sale.title}</h1>
            <p className="mb-2 text-gray-600">{sale.description}</p>
            <p className="text-gray-600">{sale.date} at {sale.time}</p>
            <p className="text-gray-600">{sale.location}</p>
            <h2 className="mt-6 text-lg font-semibold">RSVPs</h2>
            <p className="text-gray-600">{sale.rsvps.length} people are attending:</p>
            <ul className="pl-8 list-disc">
                {sale.rsvps && sale.rsvps.map((rsvp, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                        <img src={rsvp.userPicture} alt={`${rsvp.userName}'s avatar`} className="w-6 h-6 rounded-full" />
                        <span>{rsvp.userName}</span>
                        {sale.ownerEmail === rsvp.userEmail && (
                            <span className="ml-2 text-sm text-gray-500">(Owner)</span>
                        )}
                    </li>
                ))}
            </ul>
            {isAuthenticated && (
                <div className="flex justify-center mt-6 space-x-4">
                    {sale.ownerEmail === user.email && (
                        <>
                            <button
                                onClick={handleEditPost}
                                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
                            >
                                <FaEdit /> Edit Post
                            </button>
                            <button
                                onClick={handleDeletePost}
                                className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg focus:outline-none hover:bg-red-600"
                            >
                                <FaTrash /> Delete Post
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleRSVP}
                        className={`px-4 py-2 rounded-lg focus:outline-none ${isRSVPed ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white flex items-center gap-2`}
                    >
                        {isRSVPed ? <FaTimesCircle /> : <FaCheckCircle />}
                        <span>{isRSVPed ? 'Un-RSVP' : 'RSVP'}</span>
                    </button>
                    <button
                        onClick={handleShareEvent}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-gray-500 rounded-lg focus:outline-none hover:bg-gray-600"
                    >
                        <FaShare /> Share Event
                    </button>
                </div>
            )}
            <div className="mt-8">
                <h2 className="mb-4 text-lg font-semibold">Comments</h2>
                {isAuthenticated && (
                    <div className="flex items-center mb-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        />
                        <button
                            onClick={handleAddComment}
                            className="px-4 py-2 ml-2 text-white bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600"
                        >
                            Post
                        </button>
                    </div>
                )}
                {comments.length === 0 ? (
                    <p className="text-gray-600">No comments yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {comments.map((comment, index) => (
                            <li key={index} className="pt-4 border-t border-gray-300">
                                <div className="flex items-center mb-2">
                                    <img src={comment.userPicture} alt={`${comment.userName}'s avatar`} className="w-8 h-8 rounded-full" />
                                    <span className="ml-2 font-semibold">{comment.userName}</span>
                                    {sale.ownerEmail === comment.userEmail && (
                                        <span className="ml-2 text-sm text-gray-500">(Owner)</span>
                                    )}
                                    {isAuthenticated && comment.userEmail === user.email && (
                                        <button
                                            onClick={() => handleDeleteComment(comment)}
                                            className="ml-auto text-red-500 focus:outline-none"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-600">{comment.commentText}</p>
                                <p className="mt-1 text-xs text-gray-400">{new Date(comment.timestamp).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default StoopSaleDetail;