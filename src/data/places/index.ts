import type { Place } from '../types'
import { holyLandPlaces } from './holy-land'
import { mediterraneanPlaces } from './mediterranean'
import { earlyChurchPlaces } from './early-church'
import { laterActsPlaces } from './later-acts'
import { gospelsExtendedPlaces } from './gospels-extended'
import { morePlaces } from './more-places'

export const places: Place[] = [...mediterraneanPlaces, ...holyLandPlaces, ...earlyChurchPlaces, ...laterActsPlaces, ...gospelsExtendedPlaces, ...morePlaces]
