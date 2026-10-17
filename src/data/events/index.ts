import type { BiblicalEvent } from '../types'
import { gospelEvents } from './gospels'
import { paulEvents } from './paul'
import { earlyChurchEvents } from './early-church'
import { laterActsEvents } from './later-acts'
import { gospelsExtendedEvents } from './gospels-extended'
import { morePlacesEvents } from './more-places'

export const events: BiblicalEvent[] = [...gospelEvents, ...paulEvents, ...earlyChurchEvents, ...laterActsEvents, ...gospelsExtendedEvents, ...morePlacesEvents]
