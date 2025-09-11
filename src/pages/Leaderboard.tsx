import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Leaderboard as LeaderboardComponent } from '@/components/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link to="/dashboard">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Назад
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h1 className="text-2xl font-bold">Рейтинг игроков</h1>
          </div>
        </div>
        
        <div className="space-y-6">
          <LeaderboardComponent maxEntries={50} />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;