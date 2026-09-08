import './style.css'

export { default as Button } from './components/Button/Button.vue'
export { default as Pill } from './components/Pill/Pill.vue'
export { default as Card } from './components/Card/Card.vue'
export { default as Countdown } from './components/Countdown/Countdown.vue'
export { default as Carousel } from './components/Carousel/Carousel.vue'
export { default as CarouselSlide } from './components/Carousel/CarouselSlide.vue'
export { default as Notification } from './components/Notification/Notification.vue'
export { default as NotificationsContainer } from './components/Notification/NotificationsContainer.vue'
export { useNotifications } from './components/Notification/useNotifications'
export type { NotificationVariant, NotificationItem } from './components/Notification/useNotifications'

export { default as LotteryBallBadge } from './components/LotteryBallBadge/LotteryBallBadge.vue'
export { default as NumberGrid } from './components/NumberGrid/NumberGrid.vue'
export { default as QuantityStepper } from './components/QuantityStepper/QuantityStepper.vue'
export { default as Modal } from './components/Modal/Modal.vue'

export { default as JackpotCard } from './components/JackpotCard/JackpotCard.vue'
export type {
  LotteryBall,
  MagicNumberConfig,
  RangeGameConfig,
  FixedGameConfig,
  JackpotGame,
} from './components/JackpotCard/types'

export { default as TicketPicker } from './components/TicketPicker/TicketPicker.vue'
export { DEFAULT_DRAW_DURATION_OPTIONS, DEFAULT_TICKET_PICKER_COPY } from './components/TicketPicker/types'
export type {
  PickerMode,
  FixedFlowOptionId,
  TicketLine,
  MagicBet,
  DrawDurationOption,
  RangeTicketPayload,
  FixedTicketPayload,
  Ticket,
  TicketPickerCopy,
} from './components/TicketPicker/types'
