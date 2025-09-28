import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Crown, Gift, Star, Sparkles, Zap, Clock, Users } from 'lucide-react';
import { ExclusiveAccessBanner } from './ExclusiveAccessBanner';
import GiveawayPreview from './GiveawayPreview';

export const PromoBanner = () => {
  return (
    <section className="relative overflow-hidden py-6">
      <div className="container mx-auto px-6 relative">
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-primary/30 shadow-2xl overflow-hidden relative group animate-fade-in">
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-30 animate-glow-pulse -z-10 blur-sm"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-2 right-4">
              <Crown className="h-8 w-8 text-primary rotate-12 animate-glow-pulse" />
            </div>
            <div className="absolute bottom-2 left-4">
              <Gift className="h-6 w-6 text-accent -rotate-12 animate-pulse" />
            </div>
          </div>

          <CardContent className="p-6 md:p-8 relative z-10">
            <div className="text-center space-y-6">
              {/* Main Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <Badge className="bg-gradient-to-r from-primary via-accent to-primary text-white border-0 px-3 py-1 text-sm font-bold shadow-xl">
                    <Star className="w-4 h-4 mr-1 animate-spin" />
                    🎯 СПЕЦИАЛЬНЫЕ ПРЕДЛОЖЕНИЯ
                  </Badge>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent font-playfair tracking-wide">
                  Эксклюзивные возможности
                </h2>
                
                <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  🚀 Присоединяйтесь к элите и участвуйте в премиум розыгрыше с призами на миллионы! 🎁
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {/* Exclusive Access Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="group relative cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/15 to-primary/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                      <Card className="relative bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 backdrop-blur-xl border-2 border-primary/40 hover:border-primary/60 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover-scale overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
                        <CardContent className="p-4 text-center space-y-3">
                          <div className="flex items-center justify-center">
                            <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                              <Crown className="h-6 w-6 text-primary animate-glow-pulse" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                              Эксклюзивный доступ
                            </h3>
                            <p className="text-sm text-slate-300">
                              Присоединяйтесь к элитному сообществу нефтяных магнатов
                            </p>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-2 py-1">
                              <Users className="w-3 h-3 mr-1" />
                              Лимитированно
                            </Badge>
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs px-2 py-1 animate-pulse">
                              <Clock className="w-3 h-3 mr-1" />
                              Спешите!
                            </Badge>
                          </div>
                          <Button size="sm" className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white font-bold py-2">
                            Узнать подробнее
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-transparent border-0 p-0">
                    <ExclusiveAccessBanner />
                  </DialogContent>
                </Dialog>

                {/* Premium Giveaway Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="group relative cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/15 to-accent/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                      <Card className="relative bg-gradient-to-br from-slate-800/80 via-slate-900/80 to-slate-800/80 backdrop-blur-xl border-2 border-accent/40 hover:border-accent/60 transition-all duration-500 hover:shadow-xl hover:shadow-accent/10 hover-scale overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent"></div>
                        <CardContent className="p-4 text-center space-y-3">
                          <div className="flex items-center justify-center">
                            <div className="p-3 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full group-hover:from-accent/30 group-hover:to-primary/30 transition-all duration-300">
                              <Gift className="h-6 w-6 text-accent animate-bounce" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                              Премиум розыгрыш
                            </h3>
                            <p className="text-sm text-slate-300">
                              Призы на миллионы рублей ждут победителей!
                            </p>
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            <Badge className="bg-accent/20 text-accent border-accent/30 text-xs px-2 py-1">
                              📱 iPhone 17 Pro
                            </Badge>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs px-2 py-1">
                              🎮 PlayStation 5
                            </Badge>
                          </div>
                          <Button size="sm" className="w-full bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent text-white font-bold py-2">
                            Участвовать в розыгрыше
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-transparent border-0 p-0">
                    <GiveawayPreview />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Bottom CTA */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl blur-md"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-xl p-4 rounded-xl border border-primary/20">
                  <p className="text-sm text-slate-300 mb-3">
                    ⚡ Не упустите шанс стать частью элитного сообщества и выиграть невероятные призы!
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1 text-xs">
                      🎯 Эксклюзивные возможности
                    </Badge>
                    <Badge className="bg-accent/20 text-accent border-accent/30 px-3 py-1 text-xs">
                      💎 Премиум опыт
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 px-3 py-1 text-xs">
                      🏆 Миллионные призы
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};