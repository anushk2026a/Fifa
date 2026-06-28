declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';

  type IconProps = SVGProps<SVGSVGElement> & {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
    className?: string;
  };

  // Already-used icons
  export const CheckCircle: FC<IconProps>;
  export const Star: FC<IconProps>;
  export const MapPin: FC<IconProps>;
  export const Quote: FC<IconProps>;
  export const Globe: FC<IconProps>;
  export const ExternalLink: FC<IconProps>;
  export const Users: FC<IconProps>;
  export const Mail: FC<IconProps>;
  export const Phone: FC<IconProps>;
  export const MessageSquare: FC<IconProps>;
  export const Send: FC<IconProps>;
  export const Search: FC<IconProps>;
  export const Menu: FC<IconProps>;
  export const X: FC<IconProps>;
  export const ChevronDown: FC<IconProps>;
  export const ChevronUp: FC<IconProps>;
  export const ChevronLeft: FC<IconProps>;
  export const ChevronRight: FC<IconProps>;
  export const ArrowRight: FC<IconProps>;
  export const Trash2: FC<IconProps>;
  export const LogOut: FC<IconProps>;
  export const Calendar: FC<IconProps>;
  export const Plus: FC<IconProps>;
  export const PlusCircle: FC<IconProps>;
  export const Trophy: FC<IconProps>;
  export const Camera: FC<IconProps>;
  export const User: FC<IconProps>;
  export const Building2: FC<IconProps>;
  export const Link2: FC<IconProps>;

  // Admin panel icons
  export const LayoutDashboard: FC<IconProps>;
  export const Newspaper: FC<IconProps>;
  export const BookOpen: FC<IconProps>;
  export const Clock: FC<IconProps>;
  export const TrendingUp: FC<IconProps>;
  export const BarChart3: FC<IconProps>;
  export const Activity: FC<IconProps>;
  export const List: FC<IconProps>;
  export const Tag: FC<IconProps>;
  export const PanelLeft: FC<IconProps>;
  export const AlertTriangle: FC<IconProps>;
  export const Pencil: FC<IconProps>;
  export const Check: FC<IconProps>;
  export const Save: FC<IconProps>;
  export const Eye: FC<IconProps>;
  export const EyeOff: FC<IconProps>;
  export const Filter: FC<IconProps>;
  export const RefreshCw: FC<IconProps>;
  export const Download: FC<IconProps>;
  export const Upload: FC<IconProps>;
  export const Settings: FC<IconProps>;
  export const Shield: FC<IconProps>;
  export const Info: FC<IconProps>;
  export const ExternalLink2: FC<IconProps>;
  export const Hash: FC<IconProps>;
  export const Flag: FC<IconProps>;
  export const Zap: FC<IconProps>;
  export const Target: FC<IconProps>;
}
