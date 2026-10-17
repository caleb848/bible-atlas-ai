import { en } from '../text'
import type { BiblicalEvent } from '../types'

/** The Eleven named in Acts 1:13 (Peter, John, James, Andrew, Philip, Thomas, Bartholomew, Matthew, James son of Alphaeus, Simon the Zealot, Judas son of James). */
const ELEVEN_OF_ACTS_1_13 = [
  'peter',
  'john-zebedee',
  'james-zebedee',
  'andrew',
  'philip-apostle',
  'thomas',
  'bartholomew',
  'matthew',
  'james-alphaeus',
  'simon-zealot',
  'thaddaeus',
]

/**
 * The church in Acts 1–12 and the Jerusalem council (Acts 15), with Paul’s own account in Galatians 1. Summaries are editorial paraphrases of the cited passage; the passage itself (World English Bible) is always one tap away.
 */
export const earlyChurchEvents: BiblicalEvent[] = [
  // Jerusalem — Acts 1–5
  {
    id: 'apostles-in-the-upper-room',
    title: en('Praying in the upper room'),
    summary: en(
      'After the ascension the apostles returned to Jerusalem from the mountain called Olivet and went up to the upper room where they were staying. They continued steadfastly in prayer along with the women and Mary the mother of Jesus, and with his brothers.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('Acts says only that they went up to the upper room where they were staying; the house is not identified.'),
    personIds: [...ELEVEN_OF_ACTS_1_13, 'mary-mother'],
    passage: 'ACT 1:12-14',
    excerpt: 'ACT 1:13-14',
    relatedRefs: ['LUK 6:13-16'],
    tags: ['upper room', 'prayer', 'apostles', 'the eleven'],
  },
  {
    id: 'matthias-chosen',
    title: en('Matthias is chosen'),
    summary: en(
      'Peter told about 120 disciples that one of the men who had accompanied them from John’s baptism until Jesus was taken up must replace Judas as a witness of the resurrection. They put forward Joseph called Barsabbas and Matthias, prayed and drew lots; the lot fell on Matthias, who was counted with the eleven apostles.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'Acts does not say where the disciples were gathered; the preceding verses place the apostles in Jerusalem (Acts 1:12–13).',
    ),
    personIds: ['peter', 'joseph-barsabbas', 'matthias'],
    passage: 'ACT 1:15-26',
    excerpt: 'ACT 1:23-26',
    tags: ['matthias', 'casting lots', 'apostles', 'judas replaced'],
  },
  {
    id: 'pentecost',
    title: en('The Holy Spirit at Pentecost'),
    summary: en(
      'At Pentecost a sound like a mighty wind filled the house, and tongues like fire rested on each of them. Filled with the Holy Spirit, they spoke in other languages, which devout Jews from every nation heard as their own. Peter, standing with the Eleven, addressed the crowd, and about three thousand were baptized.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'Acts says they were together in one place, a house, without identifying it; the crowd was made up of people dwelling in Jerusalem (Acts 2:5).',
    ),
    personIds: [...ELEVEN_OF_ACTS_1_13, 'matthias'],
    passage: 'ACT 2:1-41',
    excerpt: 'ACT 2:1-4',
    tags: ['pentecost', 'holy spirit', 'tongues', 'sermon', 'baptism'],
  },
  {
    id: 'lame-man-at-the-beautiful-gate',
    title: en('A lame man healed at the temple'),
    summary: en(
      'At the hour of prayer a man lame from birth asked Peter and John for gifts at the temple door called Beautiful. Peter told him in the name of Jesus Christ of Nazareth to walk, and he went into the temple walking, leaping and praising God. In Solomon’s porch Peter spoke to the amazed crowd.',
    ),
    placeIds: ['temple-mount'],
    locationNote: en('Acts names the temple door called Beautiful and the porch called Solomon’s; the marker shows the temple platform.'),
    personIds: ['peter', 'john-zebedee'],
    passage: 'ACT 3:1-26',
    excerpt: 'ACT 3:1-8',
    tags: ['healing', 'miracle', 'lame man', 'beautiful gate', 'solomons porch'],
  },
  {
    id: 'peter-and-john-before-the-council',
    title: en('Peter and John before the council'),
    summary: en(
      'As Peter and John spoke to the people, the priests, the captain of the temple and the Sadducees arrested them. The next day, before the rulers, elders and scribes, with Annas and Caiaphas present, Peter said the man had been healed in the name of Jesus. The council threatened them and let them go.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'Peter and John were arrested while speaking to the people at the temple (Acts 3:11; 4:1–3) and examined the next day by the rulers gathered in Jerusalem; Acts does not say where they met.',
    ),
    personIds: ['peter', 'john-zebedee', 'annas', 'caiaphas'],
    passage: 'ACT 4:1-22',
    excerpt: 'ACT 4:8-13',
    tags: ['arrest', 'council', 'sanhedrin', 'boldness', 'trial'],
  },
  {
    id: 'barnabas-sells-his-field',
    title: en('Barnabas sells his field'),
    summary: en(
      'Joses, a Levite of Cyprus whom the apostles called Barnabas, meaning Son of Encouragement, sold a field he owned and laid the money at the apostles’ feet.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('Acts does not say where the field was; the money was laid at the apostles’ feet among the believers in Jerusalem.'),
    personIds: ['barnabas'],
    passage: 'ACT 4:36-37',
    tags: ['generosity', 'sharing', 'son of encouragement'],
  },
  {
    id: 'ananias-and-sapphira',
    title: en('Ananias and Sapphira'),
    summary: en(
      'Ananias and his wife Sapphira sold land; with her knowledge he kept back part of the price and laid the rest at the apostles’ feet. Rebuked by Peter for lying to God, he fell down and died; about three hours later Sapphira repeated the claim and also died. Great fear came on the whole assembly.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('Acts does not name the place; the community of believers it describes is in Jerusalem (compare Acts 5:16, 5:28).'),
    personIds: ['peter', 'ananias-husband-of-sapphira', 'sapphira'],
    passage: 'ACT 5:1-11',
    excerpt: 'ACT 5:3-5',
    tags: ['deception', 'judgment', 'fear', 'property'],
  },
  {
    id: 'signs-in-solomons-porch',
    title: en('Signs and wonders in Solomon’s porch'),
    summary: en(
      'The apostles did many signs and wonders, and they were all together in Solomon’s porch. People carried the sick into the streets so that Peter’s shadow might fall on some of them, and crowds came from the cities around Jerusalem with the sick and those tormented by unclean spirits, and they were all healed.',
    ),
    placeIds: ['temple-mount'],
    locationNote: en(
      'Acts names Solomon’s porch, which John 10:23 places in the temple; the sick were laid in the streets. The marker shows the temple platform.',
    ),
    personIds: ['peter'],
    passage: 'ACT 5:12-16',
    excerpt: 'ACT 5:15-16',
    tags: ['healing', 'miracles', 'peters shadow', 'solomons porch'],
  },
  {
    id: 'apostles-freed-and-gamaliels-counsel',
    title: en('The apostles freed and Gamaliel’s counsel'),
    summary: en(
      'The high priest and the Sadducees jailed the apostles, but an angel opened the prison by night, and at daybreak they were teaching in the temple. Before the council Peter and the apostles said they must obey God rather than men. Gamaliel, a Pharisee, advised leaving them alone, and they were beaten and released.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'The apostles were held in the public prison, taught in the temple and were questioned by the council; Acts does not say where the council met.',
    ),
    personIds: ['peter', 'gamaliel'],
    passage: 'ACT 5:17-42',
    excerpt: 'ACT 5:38-41',
    tags: ['prison', 'angel', 'council', 'gamaliel', 'persecution'],
  },

  // Stephen and the scattering — Acts 6–8
  {
    id: 'the-seven-chosen',
    title: en('Seven men chosen to serve'),
    summary: en(
      'When the Hellenists complained that their widows were neglected in the daily service, the Twelve asked the disciples to choose seven men full of the Spirit and of wisdom. They chose Stephen, Philip, Prochorus, Nicanor, Timon, Parmenas and Nicolaus and set them before the apostles, and after prayer hands were laid on them.',
    ),
    placeIds: ['jerusalem'],
    personIds: ['stephen', 'philip-evangelist'],
    passage: 'ACT 6:1-7',
    excerpt: 'ACT 6:3-6',
    tags: ['the seven', 'service', 'widows', 'hellenists'],
  },
  {
    id: 'stephen-stoned',
    title: en('Stephen’s speech and death'),
    summary: en(
      'Stephen, who did great wonders, was seized and brought before the council, where false witnesses accused him of speaking against the temple and the law. He answered with a long account of Israel’s history. Enraged, they threw him out of the city and stoned him as he prayed, and Saul consented to his death.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('Stephen was tried before the council and stoned outside the city (Acts 7:58); Acts does not name the spot.'),
    personIds: ['stephen', 'paul'],
    passage: 'ACT 6:8-8:1',
    excerpt: 'ACT 7:57-60',
    relatedRefs: ['ACT 22:20'],
    tags: ['stephen', 'martyr', 'stoning', 'speech', 'saul'],
  },
  {
    id: 'persecution-scatters-the-church',
    title: en('Persecution scatters the church'),
    summary: en(
      'A great persecution arose against the church in Jerusalem, and all except the apostles were scattered through the regions of Judea and Samaria. Devout men buried Stephen, while Saul entered house after house and dragged men and women off to prison. Those who were scattered went about preaching the word.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en('The persecution was against the church in Jerusalem. Acts says only that the believers were scattered through the regions of Judea and Samaria.'),
    personIds: ['paul'],
    passage: 'ACT 8:1-4',
    tags: ['persecution', 'scattering', 'saul', 'burial of stephen'],
  },

  // Philip — Acts 8
  {
    id: 'philip-in-samaria',
    title: en('Philip preaches in Samaria'),
    summary: en(
      'Philip went down to the city of Samaria and proclaimed the Christ; the crowds listened as unclean spirits came out and many who were paralyzed or lame were healed. Men and women who believed were baptized, among them Simon, who had long amazed the people with sorcery and now stayed with Philip.',
    ),
    placeIds: ['samaria'],
    locationNote: en('Acts 8:5 says Philip went down to “the city of Samaria” but does not name the city further; the marker shows the region.'),
    personIds: ['philip-evangelist', 'simon-the-sorcerer'],
    passage: 'ACT 8:5-13',
    excerpt: 'ACT 8:5-8',
    tags: ['samaria', 'preaching', 'baptism', 'healing', 'sorcerer'],
  },
  {
    id: 'peter-and-john-in-samaria',
    title: en('Peter and John in Samaria'),
    summary: en(
      'Hearing that Samaria had received the word of God, the apostles in Jerusalem sent Peter and John, who prayed for the believers and laid hands on them, and they received the Holy Spirit. Simon offered money for this power, and Peter rebuked him. Peter and John then returned to Jerusalem, preaching in many Samaritan villages.',
    ),
    placeIds: ['samaria'],
    locationNote: en('Acts does not name the town where Peter and John met the new believers; the marker shows the region of Samaria.'),
    personIds: ['peter', 'john-zebedee', 'simon-the-sorcerer'],
    passage: 'ACT 8:14-25',
    excerpt: 'ACT 8:14-17',
    tags: ['samaria', 'holy spirit', 'laying on of hands', 'simony'],
  },
  {
    id: 'the-ethiopian-official',
    title: en('Philip and the Ethiopian official'),
    summary: en(
      'An angel sent Philip south to the road that goes down from Jerusalem to Gaza. There he met an Ethiopian eunuch, treasurer of Queen Candace, returning from worship in Jerusalem and reading Isaiah in his chariot. Philip preached to him about Jesus from that Scripture, and when they came to some water, he baptized him.',
    ),
    placeIds: ['gaza'],
    locationNote: en(
      'Acts places the meeting on “the way that goes down from Jerusalem to Gaza” and the baptism at some water along it, without saying where. The marker shows Gaza, the end of the road it names.',
    ),
    personIds: ['philip-evangelist', 'ethiopian-official'],
    passage: 'ACT 8:26-39',
    excerpt: 'ACT 8:35-39',
    tags: ['ethiopian eunuch', 'baptism', 'isaiah', 'chariot', 'gaza road'],
  },
  {
    id: 'philip-from-azotus-to-caesarea',
    title: en('From Azotus to Caesarea'),
    summary: en(
      'After the baptism the Spirit of the Lord caught Philip away, and he was found at Azotus. Passing through, he preached the good news in all the cities until he came to Caesarea.',
    ),
    placeIds: ['azotus', 'caesarea'],
    locationNote: en('Acts does not name the cities between Azotus and Caesarea.'),
    personIds: ['philip-evangelist'],
    passage: 'ACT 8:39-40',
    tags: ['philip', 'preaching', 'caught away', 'coastal cities'],
  },

  // Saul — Acts 9
  {
    id: 'saul-on-the-damascus-road',
    title: en('Saul on the road to Damascus'),
    summary: en(
      'Saul was nearing Damascus with letters from the high priest to bring followers of the Way to Jerusalem bound, when a light from the sky shone around him and a voice told him it was Jesus, whom he was persecuting. Led into the city unable to see, for three days he neither ate nor drank.',
    ),
    placeIds: ['damascus'],
    locationNote: en('Acts says this happened as Saul came near Damascus; it does not name the spot on the road.'),
    personIds: ['paul'],
    passage: 'ACT 9:1-9',
    excerpt: 'ACT 9:3-6',
    relatedRefs: ['ACT 22:6-11', 'ACT 26:12-18'],
    tags: ['conversion', 'damascus road', 'light', 'vision', 'saul'],
  },
  {
    id: 'ananias-visits-saul',
    title: en('Ananias lays hands on Saul'),
    summary: en(
      'In a vision the Lord sent Ananias, a disciple at Damascus, to Saul at the house of Judah on the street called Straight. Ananias had heard of the evil Saul had done, but he went and laid hands on him; something like scales fell from Saul’s eyes, and he received his sight and was baptized.',
    ),
    placeIds: ['damascus'],
    personIds: ['ananias-of-damascus', 'paul'],
    passage: 'ACT 9:10-19',
    excerpt: 'ACT 9:17-19',
    relatedRefs: ['ACT 22:12-16'],
    tags: ['ananias', 'baptism', 'sight restored', 'straight street'],
  },
  {
    id: 'escape-from-damascus',
    title: en('Escape over the Damascus wall'),
    summary: en(
      'At Damascus Saul at once proclaimed the Christ in the synagogues, that he is the Son of God, and confounded the Jews who lived there. After many days a plot was made to kill him and the gates were watched day and night, but his disciples let him down through the wall in a basket.',
    ),
    placeIds: ['damascus'],
    personIds: ['paul'],
    passage: 'ACT 9:19-25',
    excerpt: 'ACT 9:23-25',
    relatedRefs: ['2CO 11:32-33'],
    tags: ['escape', 'basket', 'wall', 'synagogue', 'preaching'],
  },
  {
    id: 'saul-in-jerusalem',
    title: en('Saul with the apostles in Jerusalem'),
    summary: en(
      'When Saul came to Jerusalem the disciples were afraid of him, but Barnabas brought him to the apostles and told how he had seen the Lord on the way and preached boldly at Damascus. Saul was with them, preaching boldly and disputing with the Hellenists, who were seeking to kill him.',
    ),
    placeIds: ['jerusalem'],
    personIds: ['paul', 'barnabas'],
    passage: 'ACT 9:26-29',
    excerpt: 'ACT 9:26-28',
    relatedRefs: ['GAL 1:18-20'],
    tags: ['saul', 'barnabas', 'apostles', 'hellenists'],
  },
  {
    id: 'saul-sent-to-tarsus',
    title: en('Sent off to Tarsus'),
    summary: en(
      'When the brothers learned that the Hellenists were seeking to kill him, they brought Saul down to Caesarea and sent him off to Tarsus.',
    ),
    placeIds: ['caesarea', 'tarsus'],
    personIds: ['paul'],
    passage: 'ACT 9:29-30',
    tags: ['tarsus', 'caesarea', 'departure', 'saul'],
  },

  // Peter on the coastal plain — Acts 9–11
  {
    id: 'aeneas-healed-at-lydda',
    title: en('Aeneas healed at Lydda'),
    summary: en(
      'Going throughout those parts, Peter came down to the saints at Lydda and found Aeneas, who had been bedridden and paralyzed for eight years. Peter told him that Jesus Christ healed him, and he got up at once; all who lived at Lydda and in Sharon saw him and turned to the Lord.',
    ),
    placeIds: ['lydda'],
    personIds: ['peter', 'aeneas'],
    passage: 'ACT 9:32-35',
    excerpt: 'ACT 9:33-35',
    tags: ['healing', 'paralyzed', 'miracle', 'sharon'],
  },
  {
    id: 'tabitha-raised-at-joppa',
    title: en('Tabitha raised at Joppa'),
    summary: en(
      'Tabitha, also called Dorcas, a disciple at Joppa full of good works, died, and the disciples sent to nearby Lydda for Peter. He sent everyone out of the upper room, prayed and told her to get up, and she sat up; many in Joppa believed. Peter stayed there many days with Simon, a tanner.',
    ),
    placeIds: ['joppa'],
    personIds: ['peter', 'tabitha', 'simon-the-tanner'],
    passage: 'ACT 9:36-43',
    excerpt: 'ACT 9:39-41',
    tags: ['raised from the dead', 'miracle', 'dorcas', 'widows'],
  },
  {
    id: 'cornelius-vision',
    title: en('Cornelius’ vision'),
    summary: en(
      'Cornelius, a devout centurion of the Italian Regiment in Caesarea who gave generously and always prayed, saw an angel of God in a vision. The angel told him to send to Joppa for Simon called Peter, who was staying with a tanner by the seaside, and Cornelius sent two household servants and a devout soldier.',
    ),
    placeIds: ['caesarea'],
    personIds: ['cornelius'],
    passage: 'ACT 10:1-8',
    excerpt: 'ACT 10:3-6',
    tags: ['vision', 'angel', 'centurion', 'gentiles'],
  },
  {
    id: 'peters-vision-at-joppa',
    title: en('Peter’s vision on the housetop'),
    summary: en(
      'As Cornelius’ men neared Joppa, Peter went up on the housetop to pray and fell into a trance. He saw something like a great sheet let down from heaven, full of animals, and a voice told him not to call unclean what God has cleansed. The Spirit then told him to go with the men.',
    ),
    placeIds: ['joppa'],
    locationNote: en('Peter was staying at the house of Simon the tanner, by the seaside (Acts 10:6, 10:17–18).'),
    personIds: ['peter'],
    passage: 'ACT 10:9-23',
    excerpt: 'ACT 10:13-16',
    tags: ['vision', 'clean and unclean', 'sheet', 'housetop', 'gentiles'],
  },
  {
    id: 'peter-at-cornelius-house',
    title: en('Peter at the house of Cornelius'),
    summary: en(
      'Peter came to Caesarea, where Cornelius had gathered his relatives and near friends. Peter told them that God shows no favoritism and spoke of Jesus; while he was still speaking the Holy Spirit fell on all who heard, and Peter commanded that they be baptized in the name of Jesus Christ.',
    ),
    placeIds: ['caesarea'],
    personIds: ['peter', 'cornelius'],
    passage: 'ACT 10:24-48',
    excerpt: 'ACT 10:44-47',
    tags: ['gentiles', 'holy spirit', 'baptism', 'centurion', 'no favoritism'],
  },
  {
    id: 'peter-explains-in-jerusalem',
    title: en('Peter explains himself in Jerusalem'),
    summary: en(
      'When Peter came up to Jerusalem, those of the circumcision objected that he had eaten with uncircumcised men. He told them about his vision at Joppa, the men sent from Caesarea and the Holy Spirit falling on those in the house. They fell silent and glorified God for granting the Gentiles repentance to life.',
    ),
    placeIds: ['jerusalem'],
    personIds: ['peter'],
    passage: 'ACT 11:1-18',
    excerpt: 'ACT 11:15-18',
    tags: ['gentiles', 'circumcision', 'report', 'repentance'],
  },

  // Antioch — Acts 11
  {
    id: 'the-word-reaches-antioch',
    title: en('The word reaches Antioch'),
    summary: en(
      'Believers scattered by the persecution that arose over Stephen traveled as far as Phoenicia, Cyprus and Antioch, speaking the word only to Jews. But some men of Cyprus and Cyrene who came to Antioch also spoke to the Hellenists about the Lord Jesus, and a great number believed.',
    ),
    placeIds: ['phoenicia', 'cyprus', 'antioch-syria'],
    locationNote: en('Acts does not name the towns in Phoenicia or on Cyprus where the word was spoken.'),
    personIds: [],
    passage: 'ACT 11:19-21',
    tags: ['spread of the gospel', 'hellenists', 'phoenicia', 'cyprus', 'antioch'],
  },
  {
    id: 'first-called-christians',
    title: en('First called Christians at Antioch'),
    summary: en(
      'The church in Jerusalem sent Barnabas to Antioch, and he exhorted the believers to remain near to the Lord. He then went to Tarsus to look for Saul and brought him to Antioch, where for a whole year they taught many people. At Antioch the disciples were first called Christians.',
    ),
    placeIds: ['antioch-syria', 'tarsus'],
    personIds: ['barnabas', 'paul'],
    passage: 'ACT 11:22-26',
    excerpt: 'ACT 11:25-26',
    tags: ['christians', 'antioch', 'barnabas', 'saul', 'teaching'],
  },
  {
    id: 'famine-relief-from-antioch',
    title: en('Agabus foretells a famine'),
    summary: en(
      'Prophets came down from Jerusalem to Antioch, and one of them, Agabus, foretold by the Spirit a great famine over all the world, which came in the days of Claudius. The disciples, each as he had plenty, sent relief for the brothers in Judea to the elders by Barnabas and Saul.',
    ),
    placeIds: ['antioch-syria'],
    locationNote: en(
      'The prophecy and the decision to send relief took place at Antioch; Acts says the relief went to the elders, for the brothers in Judea, without naming a town.',
    ),
    personIds: ['agabus', 'barnabas', 'paul'],
    passage: 'ACT 11:27-30',
    tags: ['prophecy', 'famine', 'relief', 'claudius'],
  },

  // Herod — Acts 12
  {
    id: 'peter-freed-from-prison',
    title: en('Peter freed from prison'),
    summary: en(
      'King Herod killed James the brother of John and imprisoned Peter. On the night before Herod would bring him out, an angel led Peter out of the prison. He went to the house of Mary, mother of John Mark, where many were praying, and the servant girl Rhoda recognized his voice at the gate.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'Acts 12:1–17 does not name the city. It is generally understood to be Jerusalem: afterward Herod went down from Judea to Caesarea (Acts 12:19).',
    ),
    personIds: ['herod-agrippa-i', 'james-zebedee', 'peter', 'mary-mother-of-john-mark', 'rhoda'],
    passage: 'ACT 12:1-17',
    excerpt: 'ACT 12:7-10',
    tags: ['prison', 'angel', 'escape', 'rhoda', 'death of james'],
  },
  {
    id: 'death-of-herod',
    title: en('The death of Herod'),
    summary: en(
      'Herod had the guards executed and went down to Caesarea. When the people of Tyre and Sidon asked for peace, he made a speech in royal clothing, and the people shouted that it was the voice of a god. An angel of the Lord struck him for not giving God the glory, and he died.',
    ),
    placeIds: ['caesarea'],
    locationNote: en('Acts says Herod went down to Caesarea and stayed there; the speech and his death follow without another place being named.'),
    personIds: ['herod-agrippa-i'],
    passage: 'ACT 12:19-23',
    excerpt: 'ACT 12:21-23',
    tags: ['herod', 'death', 'pride', 'tyre and sidon', 'angel'],
  },
  {
    id: 'barnabas-and-saul-return-with-mark',
    title: en('Barnabas and Saul take John Mark'),
    summary: en(
      'In the WEB text, Barnabas and Saul returned to Jerusalem when they had fulfilled their service, taking with them John who was called Mark.',
    ),
    placeIds: ['jerusalem'],
    locationNote: en(
      'The WEB reads “returned to Jerusalem”; other manuscripts, followed by many translations, have them return from Jerusalem. John Mark’s mother had a house where believers gathered (Acts 12:12), and the next chapter finds Barnabas and Saul at Antioch (Acts 13:1).',
    ),
    personIds: ['barnabas', 'paul', 'john-mark'],
    passage: 'ACT 12:25',
    tags: ['john mark', 'return', 'textual variant', 'relief'],
  },

  // The council — Acts 15:1–35
  {
    id: 'dispute-at-antioch',
    title: en('Dispute over circumcision at Antioch'),
    summary: en(
      'Men who came down from Judea taught the brothers that they could not be saved unless they were circumcised after the custom of Moses. After much dispute, Paul, Barnabas and some others were appointed to go up to the apostles and elders in Jerusalem about the question.',
    ),
    placeIds: ['antioch-syria'],
    locationNote: en(
      'Acts 15:1 does not name the city; Paul and Barnabas had been staying at Antioch (Acts 14:26–28), and the council’s reply was sent there (Acts 15:22–23).',
    ),
    personIds: ['paul', 'barnabas'],
    passage: 'ACT 15:1-2',
    tags: ['circumcision', 'dispute', 'law of moses', 'gentiles'],
  },
  {
    id: 'through-phoenicia-and-samaria',
    title: en('Through Phoenicia and Samaria'),
    summary: en(
      'Sent on their way by the church, Paul and Barnabas passed through Phoenicia and Samaria, telling of the conversion of the Gentiles, which brought great joy to all the brothers.',
    ),
    placeIds: ['phoenicia', 'samaria'],
    locationNote: en('Acts names only the regions, not the towns they visited.'),
    personIds: ['paul', 'barnabas'],
    passage: 'ACT 15:3',
    tags: ['travel', 'phoenicia', 'samaria', 'joy'],
  },
  {
    id: 'council-at-jerusalem',
    title: en('The council at Jerusalem'),
    summary: en(
      'At Jerusalem some believing Pharisees said Gentile believers must be circumcised and keep the law of Moses. After Peter, Barnabas and Paul spoke, James judged that Gentiles turning to God should not be troubled, only asked to abstain from a few things. Judas called Barsabbas and Silas were chosen to carry the letter to Antioch.',
    ),
    placeIds: ['jerusalem'],
    personIds: ['paul', 'barnabas', 'peter', 'james-brother-of-jesus', 'judas-barsabbas', 'silas'],
    passage: 'ACT 15:4-29',
    excerpt: 'ACT 15:19-22',
    tags: ['council', 'circumcision', 'gentiles', 'james', 'letter', 'apostles and elders'],
  },
  {
    id: 'letter-read-at-antioch',
    title: en('The letter delivered at Antioch'),
    summary: en(
      'At Antioch the messengers gathered the believers and delivered the letter, and they rejoiced at its encouragement. Judas and Silas, who were prophets, encouraged and strengthened the brothers and after some time were sent back in peace, while Paul and Barnabas stayed in Antioch, teaching and preaching the word of the Lord.',
    ),
    placeIds: ['antioch-syria'],
    personIds: ['paul', 'barnabas', 'judas-barsabbas', 'silas'],
    passage: 'ACT 15:30-35',
    excerpt: 'ACT 15:30-32',
    tags: ['letter', 'encouragement', 'prophets', 'antioch'],
  },

  // Paul's own account — Galatians 1:15–24 (kept separate from Acts 9)
  {
    id: 'into-arabia-and-back-to-damascus',
    title: en('Into Arabia and back to Damascus'),
    summary: en(
      'In his letter to the Galatians, Paul writes that when God revealed his Son in him, he did not immediately consult anyone or go up to Jerusalem to the apostles, but went away into Arabia and then returned to Damascus.',
    ),
    placeIds: ['arabia', 'damascus'],
    locationNote: en('Paul does not say where in Arabia he went or how long he stayed. This is his own account; Acts 9 does not mention Arabia.'),
    personIds: ['paul'],
    passage: 'GAL 1:15-17',
    excerpt: 'GAL 1:17',
    tags: ['arabia', 'damascus', 'galatians', 'calling'],
  },
  {
    id: 'fifteen-days-with-peter',
    title: en('Fifteen days with Peter'),
    summary: en(
      'Paul writes that three years later he went up to Jerusalem to visit Peter and stayed with him fifteen days, seeing none of the other apostles except James, the Lord’s brother. He adds that before God he is not lying.',
    ),
    placeIds: ['jerusalem'],
    personIds: ['paul', 'peter', 'james-brother-of-jesus'],
    passage: 'GAL 1:18-20',
    relatedRefs: ['ACT 9:26-29'],
    tags: ['jerusalem', 'peter', 'james', 'galatians', 'visit'],
  },
  {
    id: 'to-syria-and-cilicia',
    title: en('To the regions of Syria and Cilicia'),
    summary: en(
      'Paul writes that he then came to the regions of Syria and Cilicia. The churches of Judea still did not know him by face; they only heard that their former persecutor was preaching the faith he once tried to destroy, and they glorified God.',
    ),
    placeIds: ['syria', 'cilicia'],
    locationNote: en('Paul names only the regions, not any towns.'),
    personIds: ['paul'],
    passage: 'GAL 1:21-24',
    excerpt: 'GAL 1:21-23',
    tags: ['syria', 'cilicia', 'galatians', 'persecutor', 'preaching'],
  },
]
