import { GameField } from "@/components/game/GameField";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function GameView() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к дашборду
            </Button>
          </Link>
          
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Моё месторождение
          </h1>

          <div className="w-32"></div>
        </div>
      </header>

      {/* Game Field */}
      <GameField />
    </div>
  );
}
