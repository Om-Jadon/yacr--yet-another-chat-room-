import React from "react";
import { useState, useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";

function Avatar({ username, size = 35 }) {
  const [imgError, setImgError] = useState(false);
  const avatar = useMemo(() => {
    return createAvatar(adventurerNeutral, {
      seed: username,
      size: size,
    }).toDataUri();
  }, []);

  const initials = username
    .split(" ")
    .map((w) => w[0].toUpperCase())
    .join("")
    .slice(0, 2);

  if (imgError) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-sm">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={avatar}
      alt={username}
      onError={() => setImgError(true)}
      className="rounded-full"
    />
  );
}

export default Avatar;
