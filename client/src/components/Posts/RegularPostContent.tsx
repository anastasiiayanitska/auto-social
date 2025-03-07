import React from "react";

const RegularPostContent: React.FC<{ post: any }> = ({ post }) => {
  return (
    <div className="post-content regular-post">
      <p>{post.content}</p>
    </div>
  );
};

export default RegularPostContent;
