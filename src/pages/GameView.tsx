import { GameField } from "@/components/game/GameField";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function GameView() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Adaptive for mobile */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 h-9 sm:h-10 px-2 sm:px-4">
              <ArrowLeft className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Назад к дашборду</span>
              <span className="sm:hidden">Назад</span>
            </Button>
          </Link>
          
          <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
            Моё месторождение
          </h1>

          <div className="w-16 sm:w-32"></div>
        </div>
      </header>

      {/* Game Field */}
      <GameField />
    </div>
  );
}
