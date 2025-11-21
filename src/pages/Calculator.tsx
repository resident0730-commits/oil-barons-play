import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator as CalculatorIcon } from "lucide-react";
import { ProfitabilityCalculator } from "@/components/ProfitabilityCalculator";

const Calculator = () => {
  return (
    <div className="min-h-screen hero-luxury-background font-inter">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-background/95 to-background/80 border-b border-primary/10 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-cyan-100 hover:text-cyan-50 hover:bg-cyan-500/20 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                <ArrowLeft className="h-4 w-4" />
                На главную
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary/30 to-accent/30 rounded-xl shadow-lg backdrop-blur-sm border border-primary/20">
                <CalculatorIcon className="h-5 w-5 text-yellow-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              </div>
              <h1 className="text-2xl font-bold text-yellow-300 drop-shadow-[0_0_25px_rgba(251,191,36,0.9)] [text-shadow:_3px_3px_8px_rgb(0_0_0_/_100%)]">
                Калькулятор доходности
              </h1>
            </div>
            
            <div className="w-[120px]" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Description Card */}
          <div className="mb-8 p-6 group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500 rounded-3xl shadow-xl animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-purple-400/40 transition-all duration-500"></div>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            <div className="relative">
              <h2 className="text-2xl font-bold mb-3 text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] [text-shadow:_3px_3px_8px_rgb(0_0_0_/_100%)]">
                Планируйте свой доход с точностью
              </h2>
              <p className="text-purple-100 leading-relaxed text-lg drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] [text-shadow:_2px_2px_6px_rgb(0_0_0_/_100%)]">
                Используйте наш калькулятор, чтобы рассчитать оптимальную стратегию инвестиций. 
                Узнайте, какие скважины и пакеты купить для достижения желаемого дохода, 
                рассчитайте срок окупаемости и спланируйте свою нефтяную империю.
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="px-4 py-2 bg-cyan-400/30 border-2 border-cyan-300/80 rounded-full text-sm font-bold text-white shadow-[0_0_15px_rgba(34,211,238,0.6)] backdrop-blur-sm [text-shadow:_2px_2px_6px_rgb(0_0_0_/_100%)]">
                  Расчет в любой валюте
                </div>
                <div className="px-4 py-2 bg-purple-400/30 border-2 border-purple-300/80 rounded-full text-sm font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] backdrop-blur-sm [text-shadow:_2px_2px_6px_rgb(0_0_0_/_100%)]">
                  Оптимизация бюджета
                </div>
                <div className="px-4 py-2 bg-emerald-400/30 border-2 border-emerald-300/80 rounded-full text-sm font-bold text-white shadow-[0_0_15px_rgba(52,211,153,0.6)] backdrop-blur-sm [text-shadow:_2px_2px_6px_rgb(0_0_0_/_100%)]">
                  Прогноз доходности
                </div>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className="animate-fade-in">
            <ProfitabilityCalculator />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Calculator;
