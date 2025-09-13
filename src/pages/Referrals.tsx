import { ReferralSystem } from "@/components/ReferralSystem";

export default function Referrals() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Реферальная система</h1>
          <p className="text-muted-foreground">
            Приглашайте друзей и зарабатывайте вместе
          </p>
        </div>
        
        <ReferralSystem />
      </div>
    </div>
  );
}