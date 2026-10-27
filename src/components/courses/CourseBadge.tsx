import type { Course } from "@/lib/courses";

const colours: Record<Course["ball"], string> = {
  "ball-1": "bg-ball-1 text-[#0b0b0b]",
  "ball-2": "bg-ball-2 text-white",
  "ball-3": "bg-ball-3 text-white",
  gold: "bg-gold text-navy",
  emerald: "bg-emerald text-navy",
};

export default function CourseBadge({ course, size = 48 }: { course: Course; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-extrabold ${colours[course.ball]}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {course.ballNumber}
    </span>
  );
}
