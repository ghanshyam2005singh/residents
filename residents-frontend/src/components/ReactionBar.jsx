import React from "react";
import PropTypes from "prop-types";

export const ReactionBar = ({
  reactions,
  onReact,
  pending,
  error,
}) => {
  const upCount = reactions.filter(r => r.type === "up").length;
  const downCount = reactions.filter(r => r.type === "down").length;
  const heartCount = reactions.filter(r => r.type === "heart").length;

  return (
    <div className="reaction-bar">
      <button disabled={pending} onClick={() => onReact("up")}>👍 {upCount}</button>
      <button disabled={pending} onClick={() => onReact("down")}>👎 {downCount}</button>
      <button disabled={pending} onClick={() => onReact("heart")}>❤️ {heartCount}</button>
      {error && <span className="error-state">{error}</span>}
    </div>
  );
};

ReactionBar.propTypes = {
  reactions: PropTypes.array.isRequired,
  onReact: PropTypes.func.isRequired,
  pending: PropTypes.bool,
  error: PropTypes.string,
};