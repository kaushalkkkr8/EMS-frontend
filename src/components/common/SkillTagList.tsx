// src/components/common/SkillTagList.tsx
export default function SkillTagList({ skills }: { skills: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
        >
          {skill}
        </span>
      ))}
    </div>
  )
}
