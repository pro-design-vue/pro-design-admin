declare type FocusEventHandler = (e: FocusEvent) => void
declare type MouseEventHandler = (e: MouseEvent) => void
declare type KeyboardEventHandler = (e: KeyboardEvent) => void
declare type CompositionEventHandler = (e: CompositionEvent) => void
declare type ClipboardEventHandler = (e: ClipboardEvent) => void
declare type ChangeEventHandler = (e: ChangeEvent) => void
declare type WheelEventHandler = (e: WheelEvent) => void
declare type ChangeEvent = Event & {
	target: {
		value?: string | undefined
	}
}

declare type CheckboxChangeEvent = Event & {
	target: {
		checked?: boolean
	}
}

declare type EventHandler = (...args: any[]) => void
