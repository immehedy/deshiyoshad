import Image from "next/image";
import { User } from "lucide-react";

const gradients = [
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-sky-500 to-indigo-400",
  "from-rose-500 to-pink-400",
  "from-violet-500 to-purple-400",
  "from-lime-500 to-green-400",
];

export function ReviewerAvatar({
  name,
  avatarUrl,
  index = 0,
  size = 44,
}: {
  name: string;
  avatarUrl: string | null;
  index?: number;
  size?: number;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const seed =
    index +
    name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const gradient = gradients[seed % gradients.length];

  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${gradient} shadow-soft ring-2 ring-white`}
      style={{ width: size, height: size }}>
      <User
        size={Math.round(size * 0.5)}
        className="text-white"
        strokeWidth={2.5}
        fill="currentColor"
        fillOpacity={0.25}
      />
    </span>
  );
}
