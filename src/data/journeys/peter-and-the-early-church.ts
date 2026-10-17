import { en } from '../text'
import type { Journey } from '../types'

export const peterAndTheEarlyChurch: Journey = {
  id: 'peter-and-the-early-church',
  type: 'collection',
  eraId: 'apostolic-age',
  title: en('Peter and the Early Church'),
  shortTitle: en('Peter in Acts'),
  subtitle: en('Jerusalem, Samaria and the coastal plain in Acts 1–15'),
  summary: en(
    'In the first half of Acts, Peter spoke for the apostles at Pentecost, healed and preached in Jerusalem and faced the council. He went with John to Samaria, traveled to Lydda and Joppa, and was called to the house of the centurion Cornelius at Caesarea. Back in Jerusalem he explained what had happened, was freed from Herod’s prison and spoke at the council.',
  ),
  passages: ['ACT 1:12-5:42', 'ACT 8:14-25', 'ACT 9:32-11:18', 'ACT 12:1-17', 'ACT 15:4-29'],
  orderingNote: en(
    'Listed in the order of Acts and grouped by region. Acts narrates only parts of Peter’s movements (Lydda to Joppa to Caesarea, then up to Jerusalem), so the places are shown as a collection rather than a single route.',
  ),
  sections: [
    { id: 'jerusalem', title: en('Jerusalem'), description: en('Acts 1–5') },
    { id: 'samaria', title: en('Samaria'), description: en('Acts 8') },
    { id: 'coast', title: en('The coastal plain'), description: en('Lydda, Joppa and Caesarea (Acts 9–10)') },
    { id: 'jerusalem-again', title: en('Jerusalem again'), description: en('Acts 11–15') },
  ],
  stops: [
    {
      sectionId: 'jerusalem',
      placeId: 'jerusalem',
      eventIds: ['apostles-in-the-upper-room', 'matthias-chosen', 'pentecost'],
      passage: 'ACT 1:12-2:41',
      quote: { ref: 'ACT 2:14', text: 'Peter, standing up with the eleven, lifted up his voice' },
    },
    { sectionId: 'jerusalem', placeId: 'temple-mount', eventIds: ['lame-man-at-the-beautiful-gate'], passage: 'ACT 3:1-26' },
    {
      sectionId: 'jerusalem',
      placeId: 'jerusalem',
      eventIds: ['peter-and-john-before-the-council', 'ananias-and-sapphira'],
      passage: 'ACT 4:1-5:11',
    },
    { sectionId: 'jerusalem', placeId: 'temple-mount', eventIds: ['signs-in-solomons-porch'], passage: 'ACT 5:12-16' },
    {
      sectionId: 'jerusalem',
      placeId: 'jerusalem',
      eventIds: ['apostles-freed-and-gamaliels-counsel'],
      passage: 'ACT 5:17-42',
      quote: { ref: 'ACT 5:29', text: 'We must obey God rather than men.' },
    },
    { sectionId: 'samaria', placeId: 'samaria', eventIds: ['peter-and-john-in-samaria'], passage: 'ACT 8:14-25' },
    { sectionId: 'coast', placeId: 'lydda', eventIds: ['aeneas-healed-at-lydda'], passage: 'ACT 9:32-35' },
    {
      sectionId: 'coast',
      placeId: 'joppa',
      eventIds: ['tabitha-raised-at-joppa', 'peters-vision-at-joppa'],
      passage: 'ACT 9:36-10:23',
      quote: { ref: 'ACT 10:15', text: 'What God has cleansed, you must not call unclean.' },
    },
    {
      sectionId: 'coast',
      placeId: 'caesarea',
      eventIds: ['cornelius-vision', 'peter-at-cornelius-house'],
      passage: 'ACT 10:24-48',
      quote: { ref: 'ACT 10:34', text: 'Truly I perceive that God doesn’t show favoritism' },
    },
    { sectionId: 'jerusalem-again', placeId: 'jerusalem', eventIds: ['peter-explains-in-jerusalem'], passage: 'ACT 11:1-18' },
    { sectionId: 'jerusalem-again', placeId: 'jerusalem', eventIds: ['peter-freed-from-prison'], passage: 'ACT 12:1-17' },
    { sectionId: 'jerusalem-again', placeId: 'jerusalem', eventIds: ['council-at-jerusalem'], passage: 'ACT 15:4-29' },
  ],
  tags: ['peter', 'apostles', 'early church', 'pentecost', 'cornelius', 'joppa', 'acts'],
  featured: false,
}
