export default function TicketAvatar({ initials, avatarClass }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarClass}`}
    >
      {initials}
    </span>
  )
}
