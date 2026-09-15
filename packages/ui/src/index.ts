import './style.css'

export { default as Button } from './components/Button/Button.vue'
export { default as Pill } from './components/Pill/Pill.vue'
export { default as Card } from './components/Card/Card.vue'
export { default as Countdown } from './components/Countdown/Countdown.vue'
export { default as Carousel } from './components/Carousel/Carousel.vue'
export { default as CarouselSlide } from './components/Carousel/CarouselSlide.vue'
export { default as CarouselSection } from './components/Carousel/CarouselSection.vue'
export { default as Notification } from './components/Notification/Notification.vue'
export { default as NotificationsContainer } from './components/Notification/NotificationsContainer.vue'
export { useNotifications } from './components/Notification/useNotifications'
export type { NotificationVariant, NotificationItem } from './components/Notification/useNotifications'

export { default as LotteryBallBadge } from './components/LotteryBallBadge/LotteryBallBadge.vue'
export { default as NumberGrid } from './components/NumberGrid/NumberGrid.vue'
export { default as QuantityStepper } from './components/QuantityStepper/QuantityStepper.vue'
export { default as Modal } from './components/Modal/Modal.vue'
export { default as Accordion } from './components/Accordion/Accordion.vue'
export { default as AccordionItem } from './components/Accordion/AccordionItem.vue'
export { default as PillToggleGroup } from './components/PillToggleGroup/PillToggleGroup.vue'
export { default as ProgressMeter } from './components/ProgressMeter/ProgressMeter.vue'
export { default as PromoSlider } from './components/PromoSlider/PromoSlider.vue'
export { default as PromoSliderSlide } from './components/PromoSlider/PromoSliderSlide.vue'
export type { PromoSliderImage } from './components/PromoSlider/PromoSlider.vue'
export { default as StatusIcon } from './components/StatusIcon/StatusIcon.vue'
export { default as Spinner } from './components/Spinner/Spinner.vue'
export { default as LoadingBar } from './components/LoadingBar/LoadingBar.vue'
export { default as StepList } from './components/StepList/StepList.vue'
export type { StepItem } from './components/StepList/types'
export { default as StatCard } from './components/StatCard/StatCard.vue'

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

export { default as LotteryTeamCard } from './components/LotteryTeamCard/LotteryTeamCard.vue'
export { default as LotteryTeamPickerModal } from './components/LotteryTeamCard/LotteryTeamPickerModal.vue'
export type { LotteryGroup, LotteryGroupOption } from './components/LotteryTeamCard/types'

export { default as CasinoGameCard } from './components/CasinoGame/CasinoGameCard.vue'
export { default as GameBalanceModal } from './components/CasinoGame/GameBalanceModal.vue'
export { default as GamePlayerToolbar } from './components/CasinoGame/GamePlayerToolbar.vue'
export type { BalanceOption } from './components/CasinoGame/types'
