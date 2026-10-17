import type { Journey } from '../types'
import { birthAndChildhoodOfJesus } from './jesus-birth'
import { finalWeekInJerusalem } from './jesus-final-week'
import { ministryOfJesus } from './jesus-ministry'
import { paulFirstJourney } from './paul-first'
import { paulJourneyToRome } from './paul-rome'
import { paulSecondJourney } from './paul-second'
import { paulThirdJourney } from './paul-third'
import { peterAndTheEarlyChurch } from './peter-and-the-early-church'
import { philipInActs } from './philip-in-acts'
import { paulsConversionAndEarlyMinistry } from './pauls-conversion-and-early-ministry'
import { jerusalemInActs } from './jerusalem-in-acts'
import { paulsArrestAndTrials } from './pauls-arrest-and-trials'
import { resurrectionAppearances } from './resurrection-appearances'
import { johnTheBaptist } from './john-the-baptist'
import { womenInTheGospelsAndActs } from './women-in-the-gospels-and-acts'

/**
 * Display order: the story order, from Jesus' birth to Paul's arrival in Rome. Within each list
 * (routes, collections) the index keeps this order.
 */
export const journeys: Journey[] = [
  birthAndChildhoodOfJesus,
  johnTheBaptist,
  ministryOfJesus,
  finalWeekInJerusalem,
  resurrectionAppearances,
  womenInTheGospelsAndActs,
  jerusalemInActs,
  peterAndTheEarlyChurch,
  philipInActs,
  paulsConversionAndEarlyMinistry,
  paulFirstJourney,
  paulSecondJourney,
  paulThirdJourney,
  paulsArrestAndTrials,
  paulJourneyToRome,
]
