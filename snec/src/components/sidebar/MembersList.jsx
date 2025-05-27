import React from "react";

export default function MembersList({ members }) {
  if (!members) return null;
  return (
    <ul>
      {members.map(member => (
        <li key={member}>{member}</li>
      ))}
    </ul>
  );
}
