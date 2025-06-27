// src/components/common/CapacityBar.tsx
import { Progress } from '@/components/ui/progress'

export default function CapacityBar({ value }: { value: number }) {
  return (
    <div>
      <p className="text-sm mb-1">{value}% Allocated</p>
      <Progress value={value} />
    </div>
  )
}
