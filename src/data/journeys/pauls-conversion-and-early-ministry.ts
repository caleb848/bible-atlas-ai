import { en } from '../text'
import type { Journey } from '../types'

export const paulsConversionAndEarlyMinistry: Journey = {
  id: 'pauls-conversion-and-early-ministry',
  type: 'collection',
  eraId: 'apostolic-age',
  title: en('Paul’s Conversion and Early Ministry'),
  shortTitle: en('Paul’s Conversion'),
  subtitle: en('The account in Acts and Paul’s own account in Galatians, side by side'),
  summary: en(
    'Acts tells how Saul, who had persecuted the church, saw a light and heard the voice of Jesus near Damascus, was baptized there and preached in its synagogues before escaping over the wall. The believers later sent him from Jerusalem to Tarsus, until Barnabas brought him to Antioch. In Galatians Paul gives his own account: Arabia, a return to Damascus, fifteen days with Peter in Jerusalem, and then the regions of Syria and Cilicia.',
  ),
  passages: ['ACT 7:58-8:3', 'ACT 9:1-30', 'ACT 11:25-30', 'ACT 12:25', 'GAL 1:15-24'],
  orderingNote: en(
    'Two accounts are shown side by side: Acts 7–12 and Paul’s own account in Galatians 1. Each section follows its own account’s order; the two are not combined into one itinerary, and the places are not joined by a route.',
  ),
  sections: [
    { id: 'acts', title: en('In Acts'), description: en('Acts 7–12') },
    { id: 'galatians', title: en('In Paul’s letter to the Galatians'), description: en('Galatians 1:15–24') },
  ],
  stops: [
    {
      sectionId: 'acts',
      placeId: 'jerusalem',
      eventIds: ['stephen-stoned', 'persecution-scatters-the-church'],
      passage: 'ACT 7:58-8:3',
      note: en('Saul first appears at Stephen’s stoning and then ravages the church in Jerusalem.'),
      quote: { ref: 'ACT 7:58', text: 'a young man named Saul' },
    },
    {
      sectionId: 'acts',
      placeId: 'damascus',
      eventIds: ['saul-on-the-damascus-road'],
      passage: 'ACT 9:1-9',
      quote: { ref: 'ACT 9:4', text: 'Saul, Saul, why do you persecute me?' },
    },
    { sectionId: 'acts', placeId: 'damascus', eventIds: ['ananias-visits-saul', 'escape-from-damascus'], passage: 'ACT 9:10-25' },
    { sectionId: 'acts', placeId: 'jerusalem', eventIds: ['saul-in-jerusalem'], passage: 'ACT 9:26-29' },
    { sectionId: 'acts', placeId: 'caesarea', eventIds: ['saul-sent-to-tarsus'], passage: 'ACT 9:30' },
    {
      sectionId: 'acts',
      placeId: 'tarsus',
      eventIds: ['saul-sent-to-tarsus'],
      passage: 'ACT 9:30',
      note: en('Barnabas later went to Tarsus to look for Saul (Acts 11:25).'),
    },
    {
      sectionId: 'acts',
      placeId: 'antioch-syria',
      eventIds: ['first-called-christians', 'famine-relief-from-antioch'],
      passage: 'ACT 11:25-30',
      quote: { ref: 'ACT 11:26', text: 'The disciples were first called Christians in Antioch.' },
    },
    {
      sectionId: 'acts',
      placeId: 'jerusalem',
      eventIds: ['barnabas-and-saul-return-with-mark'],
      passage: 'ACT 12:25',
      note: en('The WEB reads “returned to Jerusalem”; other manuscripts, followed by many translations, have them return from Jerusalem.'),
    },
    {
      sectionId: 'galatians',
      placeId: 'arabia',
      eventIds: ['into-arabia-and-back-to-damascus'],
      passage: 'GAL 1:15-17',
      quote: { ref: 'GAL 1:17', text: 'I went away into Arabia. Then I returned to Damascus.' },
    },
    { sectionId: 'galatians', placeId: 'damascus', eventIds: ['into-arabia-and-back-to-damascus'], passage: 'GAL 1:17' },
    {
      sectionId: 'galatians',
      placeId: 'jerusalem',
      eventIds: ['fifteen-days-with-peter'],
      passage: 'GAL 1:18-20',
      quote: { ref: 'GAL 1:18', text: 'I went up to Jerusalem to visit Peter, and stayed with him fifteen days.' },
    },
    { sectionId: 'galatians', placeId: 'syria', eventIds: ['to-syria-and-cilicia'], passage: 'GAL 1:21-24' },
    { sectionId: 'galatians', placeId: 'cilicia', eventIds: ['to-syria-and-cilicia'], passage: 'GAL 1:21-24' },
  ],
  tags: ['paul', 'saul', 'conversion', 'damascus road', 'tarsus', 'arabia', 'galatians'],
  featured: false,
}
