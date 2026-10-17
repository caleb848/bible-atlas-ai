import { en } from '../text'
import type { Journey } from '../types'

export const jerusalemInActs: Journey = {
  id: 'jerusalem-in-acts',
  type: 'collection',
  eraId: 'apostolic-age',
  title: en('Jerusalem in Acts'),
  shortTitle: en('Jerusalem in Acts'),
  subtitle: en('The church in Jerusalem from the upper room to the council'),
  summary: en(
    'The first chapters of Acts are set in Jerusalem: the apostles waited and prayed, the Spirit came at Pentecost, and the apostles taught in the temple and faced the council. Stephen’s death brought persecution and scattering; later Saul came back as a disciple, Peter was freed from Herod’s prison, and the apostles and elders met over whether Gentile believers must be circumcised.',
  ),
  passages: ['ACT 1:12-8:4', 'ACT 9:26-29', 'ACT 11:1-18', 'ACT 12:1-17', 'ACT 15:4-29'],
  orderingNote: en(
    'Listed in the order of Acts. These are events in one city, not stops on a journey. Acts seldom says exactly where in the city they happened, so most are marked at Jerusalem itself, and those in the temple courts at the Temple Mount.',
  ),
  sections: [
    { id: 'beginnings', title: en('The first days'), description: en('Acts 1–2') },
    { id: 'apostles', title: en('The apostles in the temple and before the council'), description: en('Acts 3–5') },
    { id: 'stephen', title: en('Stephen and the scattering'), description: en('Acts 6–8') },
    { id: 'later', title: en('Saul, Peter and the council'), description: en('Acts 9–15') },
  ],
  stops: [
    { sectionId: 'beginnings', placeId: 'jerusalem', eventIds: ['apostles-in-the-upper-room'], passage: 'ACT 1:12-14' },
    { sectionId: 'beginnings', placeId: 'jerusalem', eventIds: ['matthias-chosen'], passage: 'ACT 1:15-26' },
    {
      sectionId: 'beginnings',
      placeId: 'jerusalem',
      eventIds: ['pentecost'],
      passage: 'ACT 2:1-41',
      quote: { ref: 'ACT 2:4', text: 'They were all filled with the Holy Spirit and began to speak with other languages' },
    },
    {
      sectionId: 'apostles',
      placeId: 'temple-mount',
      eventIds: ['lame-man-at-the-beautiful-gate'],
      passage: 'ACT 3:1-26',
      quote: { ref: 'ACT 3:6', text: 'I have no silver or gold, but what I have, that I give you.' },
    },
    { sectionId: 'apostles', placeId: 'jerusalem', eventIds: ['peter-and-john-before-the-council'], passage: 'ACT 4:1-22' },
    {
      sectionId: 'apostles',
      placeId: 'jerusalem',
      eventIds: ['barnabas-sells-his-field', 'ananias-and-sapphira'],
      passage: 'ACT 4:36-5:11',
    },
    { sectionId: 'apostles', placeId: 'temple-mount', eventIds: ['signs-in-solomons-porch'], passage: 'ACT 5:12-16' },
    { sectionId: 'apostles', placeId: 'jerusalem', eventIds: ['apostles-freed-and-gamaliels-counsel'], passage: 'ACT 5:17-42' },
    { sectionId: 'stephen', placeId: 'jerusalem', eventIds: ['the-seven-chosen'], passage: 'ACT 6:1-7' },
    {
      sectionId: 'stephen',
      placeId: 'jerusalem',
      eventIds: ['stephen-stoned', 'persecution-scatters-the-church'],
      passage: 'ACT 6:8-8:4',
    },
    { sectionId: 'later', placeId: 'jerusalem', eventIds: ['saul-in-jerusalem'], passage: 'ACT 9:26-29' },
    { sectionId: 'later', placeId: 'jerusalem', eventIds: ['peter-explains-in-jerusalem'], passage: 'ACT 11:1-18' },
    { sectionId: 'later', placeId: 'jerusalem', eventIds: ['peter-freed-from-prison'], passage: 'ACT 12:1-17' },
    {
      sectionId: 'later',
      placeId: 'jerusalem',
      eventIds: ['council-at-jerusalem'],
      passage: 'ACT 15:4-29',
      quote: {
        ref: 'ACT 15:28',
        text: 'it seemed good to the Holy Spirit, and to us, to lay no greater burden on you than these necessary things',
      },
    },
  ],
  tags: ['jerusalem', 'early church', 'pentecost', 'temple', 'stephen', 'council', 'acts'],
  featured: false,
}
