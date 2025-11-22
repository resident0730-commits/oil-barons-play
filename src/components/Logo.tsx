import { Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  variant?: 'default' | 'compact';
  linkTo?: string;
}

export const Logo = ({ variant = 'default', linkTo = "/" }: LogoProps) => {
  const logoContent = (
    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 group cursor-pointer">
      {/* Icon with glow effect */}
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-md opacity-60 group-hover:opacity-90 animate-pulse transition-opacity duration-300"></div>
        <div className="relative p-2 sm:p-2.5 bg-gradient-to-br from-primary/30 via-accent/30 to-primary/30 rounded-full border-2 border-primary/40 group-hover:border-accent/60 transition-all duration-300 hover-scale">
          <Crown className="h-5 w-5 sm:h-7 sm:w-7 text-primary drop-shadow-[0_0_12px_rgba(var(--primary-rgb),0.8)] group-hover:rotate-12 transition-transform duration-300" />
        </div>
      </div>

      {/* Text content */}
      <div className="min-w-0">
        <h1 className={`font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg animate-fade-in ${
          variant === 'compact' ? 'text-lg sm:text-2xl' : 'text-lg sm:text-2xl md:text-3xl'
        }`}>
          Oil Tycoon
        </h1>
        {variant === 'default' && (
          <div className="flex items-center gap-1 mt-0.5">
            <Sparkles className="h-3 w-3 text-accent/70 animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
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
