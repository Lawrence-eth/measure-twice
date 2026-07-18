import { LearningLab } from "@/components/LearningLab";
import { getLesson } from "@/lib/lessons";

export default function Home() {
  return <LearningLab lesson={getLesson("await-microtask")} />;
}
