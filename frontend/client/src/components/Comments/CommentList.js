import React from 'react';
import Reply from './Reply';

const CommentList = ({ comments, postId }) => (
  <div className="space-y-4">
    {comments.map((comment) => (
      <div key={comment._id} className="bg-card-bg p-4 rounded-lg shadow-md">
        <p className="font-semibold">{comment.author?.name || 'Anonymous'}</p>
        <p>{comment.content}</p>
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-4 mt-2 border-l-2 border-primary pl-4">
            <CommentList comments={comment.replies} postId={postId} />
          </div>
        )}
        <Reply parentId={comment._id} postId={postId} />
      </div>
    ))}
  </div>
);

export default CommentList;