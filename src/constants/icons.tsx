import React from 'react';
import {
  UtensilsCrossed,
  Soup,
  Bus,
  FileText,
  Smartphone,
  CreditCard,
  Coffee,
  BookOpen,
  Dumbbell,
  Shirt,
  Pill,
  Ticket,
  ShoppingBag,
  Heart,
  Dices,
  Home,
  Package,
  IceCream,
  Popcorn,
  Palmtree,
  Flower2,
  LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Soup,
  Bus,
  FileText,
  Smartphone,
  CreditCard,
  Coffee,
  BookOpen,
  Dumbbell,
  Shirt,
  Pill,
  Ticket,
  ShoppingBag,
  Heart,
  Dices,
  Home,
  Package,
  IceCream,
  Popcorn,
  Palmtree,
  Flower2,
};

interface CategoryIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className, style }) => {
  const Icon = ICON_MAP[name] || Package;
  return <Icon className={className} style={style} strokeWidth={2} />;
};
