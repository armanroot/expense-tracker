import {
  CarFront,
  CircleHelp,
  HeartPulse,
  House,
  ShoppingBag,
  ShoppingBasket,
  Tv,
  UtensilsCrossed,
  UtilityPole,
  Plane,
} from 'lucide-react'

const categoryIcons = {
  groceries: ShoppingBasket,
  rent: House,
  transport: CarFront,
  utilities: UtilityPole,
  health: HeartPulse,
  dining: UtensilsCrossed,
  subscriptions: Tv,
  shopping: ShoppingBag,
  travel: Plane,
  other: CircleHelp,
}

export const getCategoryIcon = (value) => categoryIcons[value] || CircleHelp

export default categoryIcons
