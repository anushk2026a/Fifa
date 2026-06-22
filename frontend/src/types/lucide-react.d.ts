declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  
  type IconProps = SVGProps<SVGSVGElement> & {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  };
  
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
  export const ArrowRight: FC<IconProps>;
  export const Trash2: FC<IconProps>;
  export const LogOut: FC<IconProps>;
  export const Calendar: FC<IconProps>;
  export const Plus: FC<IconProps>;
  export const Trophy: FC<IconProps>;
  export const Camera: FC<IconProps>;
  export const User: FC<IconProps>;
  export const Building2: FC<IconProps>;
  export const Link2: FC<IconProps>;
}
