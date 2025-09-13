import { AchievementsSystem } from "@/components/AchievementsSystem";

export default function Achievements() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Достижения</h1>
          <p className="text-muted-foreground">
            Выполняйте задания и получайте награды
          </p>
        </div>
        
        <AchievementsSystem />
      </div>
    </div>
  );
}