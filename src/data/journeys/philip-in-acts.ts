import { en } from '../text'
import type { Journey } from '../types'

export const philipInActs: Journey = {
  id: 'philip-in-acts',
  type: 'route',
  eraId: 'apostolic-age',
  title: en('Philip the Evangelist in Acts 8'),
  shortTitle: en('Philip in Acts'),
  subtitle: en('From Jerusalem to Samaria, the Gaza road, Azotus and Caesarea'),
  summary: en(
    'When persecution scattered the believers after Stephen’s death, Philip, one of the seven, proclaimed the Christ in the city of Samaria. An angel then sent him to the road from Jerusalem to Gaza, where he baptized an Ethiopian official; afterward he was found at Azotus and preached in all the cities until he came to Caesarea.',
  ),
  passages: ['ACT 6:1-7', 'ACT 8:1-40'],
  stops: [
    {
      placeId: 'jerusalem',
      eventIds: ['the-seven-chosen', 'persecution-scatters-the-church'],
      passage: 'ACT 8:1-4',
      note: en(
        'Philip was one of the seven chosen in Jerusalem (Acts 6:5). When persecution broke out, all except the apostles were scattered from the church there (Acts 8:1).',
      ),
    },
    {
      placeId: 'samaria',
      eventIds: ['philip-in-samaria'],
      passage: 'ACT 8:5-13',
      arrival: {
        mode: 'unspecified',
        certainty: 'implied',
        note: en(
          'Acts says Philip went down to the city of Samaria (Acts 8:5); that he set out from Jerusalem is implied by the scattering in Acts 8:1–4.',
        ),
      },
    },
    {
      placeId: 'gaza',
      eventIds: ['the-ethiopian-official'],
      passage: 'ACT 8:26-39',
      arrival: {
        mode: 'unspecified',
        certainty: 'uncertain',
        note: en(
          'Acts does not say where Philip was when the angel spoke to him. He went south to the road from Jerusalem to Gaza and met the official somewhere along it, so this leg is schematic.',
        ),
      },
      note: en('The marker shows Gaza, the end of the road Acts names; the meeting and the baptism took place on the road.'),
      quote: { ref: 'ACT 8:26', text: 'the way that goes down from Jerusalem to Gaza. This is a desert.' },
    },
    {
      placeId: 'azotus',
      eventIds: ['philip-from-azotus-to-caesarea'],
      passage: 'ACT 8:39-40',
      arrival: {
        mode: 'unspecified',
        certainty: 'uncertain',
        note: en(
          'After the baptism the Spirit of the Lord caught Philip away, and he was found at Azotus (Acts 8:39–40). Acts does not describe how he got there.',
        ),
      },
      quote: { ref: 'ACT 8:40', text: 'Philip was found at Azotus.' },
    },
    {
      placeId: 'caesarea',
      eventIds: ['philip-from-azotus-to-caesarea'],
      passage: 'ACT 8:40',
      arrival: {
        mode: 'unspecified',
        certainty: 'stated',
        note: en('He preached in all the cities on the way; Acts does not name them.'),
      },
      note: en('Years later Paul’s company stayed at the house of Philip the evangelist in Caesarea (Acts 21:8).'),
    },
  ],
  tags: ['philip', 'evangelist', 'samaria', 'ethiopian eunuch', 'gaza', 'azotus', 'caesarea'],
  featured: false,
}
