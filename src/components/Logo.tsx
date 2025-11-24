import { Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: 'default' | 'compact';
  linkTo?: string;
}

export const Logo = ({ variant = 'default', linkTo = "/" }: LogoProps) => {
  const logoContent = (
    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
      {/* Icon */}
      <div className="flex-shrink-0 p-2 sm:p-2.5 bg-card/50 rounded-full border border-border">
        <Crown className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
      </div>

      {/* Text content */}
      <div className="min-w-0">
        <h1 className={`font-bold text-foreground ${
          variant === 'compact' ? 'text-lg sm:text-2xl' : 'text-lg sm:text-2xl md:text-3xl'
        }`}>
          Oil Tycoon
        </h1>
        {variant === 'default' && (
          <div className="flex items-center gap-1 mt-0.5">
            <Sparkles className="h-3 w-3 text-accent" />
            <span className="text-xs text-muted-foreground font-medium">
              Нефтяная империя
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="hover-scale">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
