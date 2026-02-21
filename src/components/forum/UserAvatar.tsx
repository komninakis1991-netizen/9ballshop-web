export default function UserAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const letter = (name || "?")[0].toUpperCase();
  // Derive a consistent hue from the name string
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        backgroundColor: `hsl(${hue}, 50%, 40%)`,
      }}
    >
      {letter}
    </div>
  );
}
